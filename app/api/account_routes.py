"""
Route tài khoản người dùng: xuất dữ liệu (GDPR), xóa vĩnh viễn, gói dịch vụ. (Tách từ main.py.)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth_routes import get_current_user

router = APIRouter(tags=["Security"])


@router.get("/api/v1/users/me/export", tags=["Security"])
async def export_user_data(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """GDPR Data Portability: Export all user data as JSON."""
    from app.models.models import User, Project, FormData, BrandDNA
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    projects = db.query(Project).filter(Project.user_id == user_id).all()
    
    export = {
        "user": {
            "id": user.id,
            "email": user.email,
            "display_name": user.display_name,
            "tier": user.tier,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        },
        "projects": [],
        "brand_dnas": [],
    }
    
    for proj in projects:
        forms = db.query(FormData).filter(FormData.project_id == proj.id).all()
        export["projects"].append({
            "id": proj.id,
            "name": proj.name,
            "industry": proj.industry,
            "created_at": proj.created_at.isoformat() if proj.created_at else None,
            "forms": [{"form_key": f.form_key, "data": f.data, "version": f.version} for f in forms],
        })
    
    dnas = db.query(BrandDNA).filter(BrandDNA.user_id == user_id).all()
    export["brand_dnas"] = [
        {"brand_name": d.brand_name, "dna_data": d.dna_data, "source": d.source}
        for d in dnas
    ]
    
    return {"status": "ok", "export": export}


@router.delete("/api/v1/users/me/purge", tags=["Security"])
async def purge_user_data(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """GDPR Right to be Forgotten: Permanently delete ALL user data."""
    from app.models.models import User, Project, FormData, BrandDNA
    
    # Delete Brand DNAs
    db.query(BrandDNA).filter(BrandDNA.user_id == user_id).delete()
    
    # Delete all forms for user's projects
    projects = db.query(Project).filter(Project.user_id == user_id).all()
    for proj in projects:
        db.query(FormData).filter(FormData.project_id == proj.id).delete()
    
    # Delete projects
    db.query(Project).filter(Project.user_id == user_id).delete()
    
    # Clear cache
    try:
        from app.core.cache_layer import SmartCache
        SmartCache.instance().invalidate_user(user_id)
    except Exception:
        pass
    
    # Delete user
    db.query(User).filter(User.id == user_id).delete()
    db.commit()
    
    return {"status": "ok", "message": "All data permanently deleted (GDPR Right to be Forgotten)"}


@router.get("/api/v1/users/me/tier", tags=["System"])
async def get_user_tier(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user tier and feature access."""
    from app.models.models import User
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    tier = user.tier or "FREE"
    
    # Tier feature matrix per business plan
    tier_features = {
        "FREE": {
            "agents": ["intake", "phase1", "phase2"],
            "review_board": False,
            "content_lab": False,
            "design_studio": False,
            "max_projects": 1,
            "route": "fast-track",
        },
        "PLUS": {
            "agents": ["intake", "phase1", "phase2", "phase3", "phase4"],
            "review_board": True,  # CFO + Customer only
            "content_lab": True,
            "design_studio": False,
            "max_projects": 5,
            "route": "balanced",
        },
        "PRO": {
            "agents": ["intake", "phase1", "phase2", "phase3", "phase4"],
            "review_board": True,  # All 4 reviewers + deep-analysis
            "content_lab": True,
            "design_studio": True,
            "max_projects": -1,  # Unlimited
            "route": "deep-analysis",
        },
    }
    
    return {
        "status": "ok",
        "tier": tier,
        "features": tier_features.get(tier, tier_features["FREE"]),
    }
