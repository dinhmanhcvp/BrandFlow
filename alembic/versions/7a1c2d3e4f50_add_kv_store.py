"""Add kv_store for persistent quota, usage and plan registry

Revision ID: 7a1c2d3e4f50
Revises: 365f48e858f9
Create Date: 2026-10-19 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7a1c2d3e4f50'
down_revision: Union[str, Sequence[str], None] = '365f48e858f9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'kv_store',
        sa.Column('namespace', sa.String(length=50), nullable=False),
        sa.Column('key', sa.String(length=255), nullable=False),
        sa.Column('value', sa.JSON(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('namespace', 'key'),
    )
    op.create_index('ix_kv_store_updated_at', 'kv_store', ['updated_at'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('ix_kv_store_updated_at', table_name='kv_store')
    op.drop_table('kv_store')
