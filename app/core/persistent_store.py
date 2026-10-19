"""
Kho key-value lưu trong DB (bảng kv_store) — thay cho dict in-memory của quota/usage/plan registry.

 • Không mất khi restart; đúng khi chạy nhiều worker/instance (cùng DATABASE_URL).
 • `update()` đọc–sửa–ghi trong một transaction; trên PostgreSQL khóa dòng bằng SELECT ... FOR UPDATE,
   trên SQLite writer đã được tuần tự hóa sẵn.
 • Giao diện gần với dict (`get`, `[]=`, `clear`) để code gọi cũ ít phải đổi.
"""

import copy
from contextlib import contextmanager
from datetime import datetime, timedelta
from typing import Any, Callable, Iterator, Optional

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.models import KeyValueEntry

_ready_binds: set = set()


def _ensure_table(db: Session) -> None:
  """Tạo bảng kv_store nếu DB chưa có (kể cả khi chưa chạy init_db/alembic)."""
  bind = db.get_bind()
  key = str(bind.url)
  if key not in _ready_binds:
    KeyValueEntry.__table__.create(bind=bind, checkfirst=True)
    _ready_binds.add(key)


class PersistentStore:
  def __init__(self, namespace: str, session_factory: Callable[[], Session] = SessionLocal):
    self.namespace = namespace
    self._session_factory = session_factory

  @contextmanager
  def _session(self) -> Iterator[Session]:
    db = self._session_factory()
    try:
      _ensure_table(db)
      yield db
    finally:
      db.close()

  def _query(self, db: Session, key: str, lock: bool = False):
    q = db.query(KeyValueEntry).filter(KeyValueEntry.namespace == self.namespace, KeyValueEntry.key == key)
    if lock and db.bind is not None and db.bind.dialect.name == "postgresql":
      q = q.with_for_update()
    return q.first()

  def get(self, key: str, default: Any = None) -> Any:
    with self._session() as db:
      row = self._query(db, key)
      return copy.deepcopy(row.value) if row is not None else default

  def __getitem__(self, key: str) -> Any:
    value = self.get(key, _MISSING)
    if value is _MISSING:
      raise KeyError(key)
    return value

  def __setitem__(self, key: str, value: Any) -> None:
    self.update(key, lambda _current: value)

  def __contains__(self, key: str) -> bool:
    return self.get(key, _MISSING) is not _MISSING

  def update(self, key: str, mutate: Callable[[Any], Any], default: Optional[Callable[[], Any]] = None) -> Any:
    """
    Đọc giá trị hiện tại (hoặc default()), gọi mutate(value) và ghi lại trong cùng transaction.
    mutate có thể sửa trực tiếp object rồi trả None, hoặc trả về giá trị mới. Trả về giá trị đã lưu.
    """
    with self._session() as db:
      try:
        row = self._query(db, key, lock=True)
        current = copy.deepcopy(row.value) if row is not None else (default() if default else None)
        result = mutate(current)
        new_value = current if result is None else result
        if row is None:
          db.add(KeyValueEntry(namespace=self.namespace, key=key, value=new_value))
        else:
          row.value = new_value
          row.updated_at = datetime.utcnow()
        db.commit()
        return copy.deepcopy(new_value)
      except Exception:
        db.rollback()
        raise

  def clear(self) -> None:
    with self._session() as db:
      db.query(KeyValueEntry).filter(KeyValueEntry.namespace == self.namespace).delete()
      db.commit()

  def purge_older_than(self, days: int) -> int:
    """Dọn bản ghi cũ (vd. bộ đếm theo ngày) để bảng không phình mãi."""
    cutoff = datetime.utcnow() - timedelta(days=days)
    with self._session() as db:
      deleted = db.query(KeyValueEntry).filter(
        KeyValueEntry.namespace == self.namespace, KeyValueEntry.updated_at < cutoff
      ).delete()
      db.commit()
      return deleted


_MISSING = object()
