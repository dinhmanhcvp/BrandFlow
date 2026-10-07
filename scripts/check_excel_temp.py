import pandas as pd
import glob
import random
import hashlib
import uuid
from datetime import datetime, timedelta, timezone

# 1. Read 70 doanh nghiệp
f70 = glob.glob('docs/*70*.xlsx')[0]
df_70 = pd.read_excel(f70)
records_70 = df_70[['Tên Doanh nghiệp (SME nhỏ)', 'Email Liên hệ']].dropna().to_dict('records')

# 2. Read Khảo sát định lượng
fk = glob.glob('docs/*khảo sát*.xlsx')[0]
df_k = pd.read_excel(fk)
# Print columns safely
with open('scripts/headers.txt', 'w', encoding='utf-8') as f:
    f.write(str(df_k.columns.tolist()))
