"""
Canonical Data Model (CDM) cho SME — bộ khung chung mà mọi file Excel được ánh xạ về.

Mỗi cột chuẩn có: kiểu, mô tả (cho LLM + Data Brief) và danh sách từ đồng nghĩa đã bỏ dấu
(cho ánh xạ heuristic — chạy không cần LLM).
"""

from dataclasses import dataclass
from typing import Dict, List


@dataclass(frozen=True)
class CanonicalColumn:
  type: str            # text | number | date | period
  description: str
  synonyms: tuple = ()


@dataclass(frozen=True)
class CanonicalEntity:
  name: str
  description: str
  columns: Dict[str, CanonicalColumn]
  key_columns: tuple   # phải map được ít nhất 1 cột trong nhóm này thì mới chọn thực thể
  min_matches: int = 2


def _c(type_: str, description: str, *synonyms: str) -> CanonicalColumn:
  return CanonicalColumn(type_, description, tuple(synonyms))


ENTITIES: Dict[str, CanonicalEntity] = {
  "sales_line": CanonicalEntity(
    name="sales_line",
    description="Từng dòng bán hàng / đơn hàng (doanh thu thực tế)",
    columns={
      "date": _c("date", "Ngày bán", "ngay", "ngay ban", "ngay ban hang", "ngay dat", "ngay dat hang",
                 "ngay chung tu", "ngay hd", "ngay hoa don", "date", "order date", "thoi gian"),
      "period": _c("period", "Kỳ (tháng/quý) nếu không có ngày", "thang", "ky", "quy", "month", "period"),
      "order_id": _c("text", "Mã đơn / số hóa đơn", "ma don", "ma don hang", "so don", "so hd", "so hoa don",
                     "ma hd", "order id", "invoice", "so chung tu", "ma phieu"),
      "customer_name": _c("text", "Tên khách hàng", "khach", "khach hang", "ten khach", "ten khach hang", "ten kh",
                          "kh", "customer", "customer name", "nguoi mua"),
      "customer_phone": _c("text", "SĐT khách hàng", "sdt", "so dien thoai", "dien thoai", "phone", "dt", "sdt kh"),
      "product_name": _c("text", "Tên sản phẩm", "san pham", "ten san pham", "ten sp", "sp", "mat hang", "ten hang",
                         "hang hoa", "ten hang hoa", "product", "product name", "item", "mon", "ten mon"),
      "sku": _c("text", "Mã sản phẩm", "ma sp", "ma san pham", "ma hang", "sku", "ma vach", "barcode", "product code"),
      "category": _c("text", "Ngành hàng / nhóm sản phẩm", "nganh", "nganh hang", "nhom", "nhom hang", "nhom sp",
                     "danh muc", "loai", "loai hang", "category"),
      "quantity": _c("number", "Số lượng", "so luong", "sl", "qty", "quantity", "so luong ban", "sl ban"),
      "unit_price": _c("number", "Đơn giá", "don gia", "gia", "gia ban", "price", "unit price", "gia ban le"),
      "revenue": _c("number", "Doanh thu (VND)", "doanh thu", "doanh so", "thanh tien", "t tien", "tong tien",
                    "doanh thu thuan", "tien hang", "revenue", "sales", "amount", "gia tri", "tong thanh toan",
                    "thuc thu"),
      "discount": _c("number", "Chiết khấu / giảm giá (VND)", "chiet khau", "giam gia", "ck", "discount", "khuyen mai"),
      "channel": _c("text", "Kênh bán", "kenh", "kenh ban", "kenh ban hang", "nguon", "nguon don", "channel",
                    "san", "nen tang"),
      "store": _c("text", "Cửa hàng / chi nhánh / điểm bán", "cua hang", "chi nhanh", "diem ban", "store", "shop",
                  "co so"),
      "region": _c("text", "Khu vực / tỉnh", "khu vuc", "vung", "mien", "tinh", "tinh thanh", "region", "province"),
      "salesperson": _c("text", "Nhân viên bán", "nhan vien", "nv ban", "nvkd", "sale", "salesman", "nguoi ban"),
    },
    key_columns=("revenue",),
  ),
  "product": CanonicalEntity(
    name="product",
    description="Danh mục sản phẩm / tồn kho",
    columns={
      "sku": _c("text", "Mã sản phẩm", "ma sp", "ma san pham", "ma hang", "sku", "ma vach", "barcode"),
      "product_name": _c("text", "Tên sản phẩm", "san pham", "ten san pham", "ten sp", "mat hang", "ten hang",
                         "hang hoa", "product", "product name", "ten mon"),
      "category": _c("text", "Nhóm sản phẩm", "nganh", "nganh hang", "nhom", "nhom hang", "danh muc", "loai",
                     "category"),
      "unit": _c("text", "Đơn vị tính", "dvt", "don vi", "don vi tinh", "unit"),
      "unit_price": _c("number", "Giá bán", "don gia", "gia", "gia ban", "gia ban le", "price"),
      "unit_cost": _c("number", "Giá vốn", "gia von", "gia nhap", "cost", "unit cost"),
      "stock_qty": _c("number", "Tồn kho", "ton", "ton kho", "so luong ton", "sl ton", "stock", "inventory"),
    },
    key_columns=("product_name", "sku"),
  ),
  "customer": CanonicalEntity(
    name="customer",
    description="Danh sách khách hàng",
    columns={
      "customer_name": _c("text", "Tên khách hàng", "khach hang", "ten khach", "ten khach hang", "ten kh", "ho ten",
                          "ho va ten", "customer", "customer name"),
      "phone": _c("text", "Số điện thoại", "sdt", "so dien thoai", "dien thoai", "phone", "mobile"),
      "email": _c("text", "Email", "email", "e mail", "mail", "email lien he"),
      "province": _c("text", "Tỉnh / thành", "tinh", "tinh thanh", "thanh pho", "province", "city", "dia chi"),
      "segment": _c("text", "Phân khúc / hạng", "phan khuc", "hang", "hang the", "nhom khach", "segment", "tier"),
      "gender": _c("text", "Giới tính", "gioi tinh", "gender"),
      "total_spent": _c("number", "Tổng chi tiêu", "tong chi tieu", "tong mua", "doanh so", "total spent"),
      "first_purchase_date": _c("date", "Ngày mua đầu", "ngay mua dau", "ngay tao", "first purchase"),
    },
    key_columns=("customer_name", "phone", "email"),
  ),
  "budget_plan": CanonicalEntity(
    name="budget_plan",
    description="Kế hoạch / ngân sách (marketing, chi phí) theo hạng mục",
    columns={
      "period": _c("period", "Kỳ kế hoạch", "thang", "ky", "quy", "month", "period", "nam"),
      "category": _c("text", "Ngành / hạng mục lớn", "nganh", "nganh hang", "hang muc", "nhom", "category",
                     "kenh", "kenh truyen thong"),
      "line_item": _c("text", "Chi tiết hạng mục", "chi tiet", "noi dung", "hoat dong", "dien giai",
                      "khoan muc", "item"),
      "target_revenue": _c("number", "Doanh thu mục tiêu", "target", "muc tieu", "chi tieu", "doanh so muc tieu",
                           "target revenue"),
      "planned_revenue": _c("number", "Doanh thu kế hoạch / ước tính", "income", "doanh thu du kien",
                            "doanh thu ke hoach", "income estimate", "doanh thu"),
      "budget_ratio": _c("number", "Tỷ lệ ngân sách / doanh thu (0–1)", "% budget", "%budget", "ty le ngan sach",
                         "ti le ngan sach", "% ngan sach", "% ns"),
      "planned_amount": _c("number", "Ngân sách kế hoạch (VND)", "budget", "ngan sach", "ns", "kinh phi",
                           "chi phi du kien", "du tru", "planned", "ke hoach"),
      "actual_amount": _c("number", "Chi thực tế (VND)", "thuc te", "thuc chi", "da chi", "actual"),
      "fixed_cost": _c("number", "Định phí", "dinh phi", "chi phi co dinh", "fixed cost"),
      "variable_cost": _c("number", "Biến phí", "bien phi", "chi phi bien doi", "variable cost"),
      "note": _c("text", "Ghi chú", "ghi chu", "note", "notes", "chu thich"),
    },
    key_columns=("planned_amount", "budget_ratio", "actual_amount"),
  ),
  "marketing_spend": CanonicalEntity(
    name="marketing_spend",
    description="Chi phí quảng cáo / marketing thực tế theo kênh",
    columns={
      "date": _c("date", "Ngày", "ngay", "date", "thoi gian"),
      "period": _c("period", "Kỳ", "thang", "ky", "month"),
      "channel": _c("text", "Kênh", "kenh", "nen tang", "channel", "platform"),
      "campaign": _c("text", "Chiến dịch", "chien dich", "campaign", "ten chien dich"),
      "amount": _c("number", "Chi phí (VND)", "chi phi", "chi phi quang cao", "so tien chi", "spend", "cost",
                   "amount spent", "ngan sach da chi"),
      "impressions": _c("number", "Lượt hiển thị", "hien thi", "luot hien thi", "impressions", "impr", "ots",
                        "reach", "tiep can"),
      "clicks": _c("number", "Lượt click", "click", "clicks", "luot click"),
      "leads": _c("number", "Lead / data", "lead", "leads", "data", "so data", "inbox", "tin nhan"),
      "orders": _c("number", "Đơn từ quảng cáo", "don", "so don", "orders", "conversions", "chuyen doi"),
    },
    key_columns=("amount",),
  ),
  "kpi_target": CanonicalEntity(
    name="kpi_target",
    description="Chỉ tiêu KPI và kết quả",
    columns={
      "period": _c("period", "Kỳ", "thang", "ky", "quy", "period"),
      "metric": _c("text", "Tên chỉ số", "chi so", "kpi", "chi tieu", "metric", "kenh truyen thong"),
      "channel": _c("text", "Kênh", "kenh", "channel"),
      "target": _c("number", "Mục tiêu", "muc tieu", "target", "ke hoach", "kpi muc tieu"),
      "actual": _c("number", "Thực tế", "thuc te", "dat duoc", "ket qua", "actual"),
      "unit": _c("text", "Đơn vị", "dvt", "don vi", "unit"),
    },
    key_columns=("target", "actual"),
  ),
  "store_outlet": CanonicalEntity(
    name="store_outlet",
    description="Điểm bán / hệ thống phân phối",
    columns={
      "store_name": _c("text", "Tên điểm bán / hệ thống", "ten he thong", "he thong", "ten cua hang", "cua hang",
                       "diem ban", "ten diem ban", "outlet", "store", "sieu thi"),
      "store_type": _c("text", "Loại điểm bán (GT/MT...)", "loai", "loai diem ban", "kenh", "type", "phan loai"),
      "region": _c("text", "Khu vực", "khu vuc", "vung", "mien", "region"),
      "province": _c("text", "Tỉnh / thành", "tinh", "tinh thanh", "province"),
      "outlet_count": _c("number", "Số lượng điểm bán", "so luong", "so luong st", "sl", "so diem", "volume"),
    },
    key_columns=("store_name",),
  ),
}

ORG_PROFILE_TABLE = "org_profile"
CUSTOM_ENTITY = "custom"


def entity_catalog_for_llm() -> List[Dict]:
  """Bản rút gọn CDM để gửi kèm prompt ánh xạ."""
  return [
    {
      "entity": e.name,
      "description": e.description,
      "columns": {name: f"{col.type} — {col.description}" for name, col in e.columns.items()},
    }
    for e in ENTITIES.values()
  ]
