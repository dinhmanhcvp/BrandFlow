import os
import re
from datetime import datetime
from typing import List

# Khai báo các thư viện yêu cầu trong `requirements.txt`:
# unstructured
# langchain-community
# pytesseract
# pdf2image
# python-docx
# langchain-text-splitters
# chromadb
# langchain-chroma

from langchain_community.document_loaders import UnstructuredFileLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.documents import Document

class DocumentIngestor:
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.persist_directory = persist_directory
        self.embeddings = OllamaEmbeddings(model="nomic-embed-text")
        
    def ingest_file(self, file_path: str) -> str:
        """
        Trích xuất văn bản từ đa định dạng file (PDF, DOCX, TXT, PNG/JPG).
        Bật OCR bằng chiến lược 'hi_res' (Yêu cầu cài Tesseract & Poppler trên hệ thống).
        """
        print(f"📄 [Ingestion] Đang trích xuất nội dung từ: {file_path}...")
        try:
            # Sử dụng UnstructuredFileLoader với strategy="hi_res" để buộc chạy OCR trên file ảnh và bản scan PDF
            loader = UnstructuredFileLoader(
                file_path, 
                strategy="hi_res", 
                mode="elements"
            )
            docs = loader.load()
            
            # Ghép tất cả văn bản lại với nhau
            raw_text = "\n\n".join([doc.page_content for doc in docs])
            return raw_text
        except Exception as e:
            print(f"🔴 [Ingestion Lỗi] Không thể đọc file {file_path}: {e}")
            raise ValueError(f"Ingestion failed: {e}")

    def clean_text(self, text: str) -> str:
        """
        Làm sạch văn bản:
        - Xóa khoảng trắng/xuống dòng dư thừa.
        - Xóa mẫu đánh số trang.
        - Xóa ký tự non-ASCII rác.
        """
        if not text:
            return ""

        # 1. Loại bỏ các ký tự non-ASCII hoặc rác mã hóa phức tạp (Giữ lại Unicode cơ bản của Tiếng Việt)
        # Thay thế bằng cách encode/decode cẩn thận hoặc dùng Regex loại bỏ null bytes/kiểu rác đặc thù.
        text = text.replace("\x00", "") 

        # 2. Xóa các mẫu số trang phổ biến ngang hoặc dọc (VD: "Trang 1/10", "Page 2", "- 1- ")
        text = re.sub(r'(?i)^(Trang|Page)\s+\d+(/\d+)?\s*$', '', text, flags=re.MULTILINE)
        text = re.sub(r'^\s*-\s*\d+\s*-\s*$', '', text, flags=re.MULTILINE)

        # 3. Gom khoảng trắng thừa và dòng trống liên tiếp
        text = re.sub(r'[ \t]+', ' ', text)  # Gom nhiều dấu cách lại thành 1
        text = re.sub(r'\n{3,}', '\n\n', text)  # Nếu có 3 \n trở lên thì quy về 2 \n

        return text.strip()

    def semantic_chunking(self, text: str) -> List[str]:
        """
        Cắt văn bản thành các chunks bảo toàn ngữ nghĩa để RAG tốt hơn.
        """
        print("✂️  [Chunking] Đang phân mảnh tài liệu...")
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=150,
            separators=["\n\n", "\n", ".", " ", ""]
        )
        chunks = splitter.split_text(text)
        print(f"   ✅ Đã phân thành {len(chunks)} chunks.")
        return chunks

    def process_and_store(self, file_path: str, category: str):
        """
        Thực thi nguyên Pipeline: Ingestion -> Cleansing -> Chunking -> Metadata -> ChromaDB
        """
        filename = os.path.basename(file_path)
        current_date = datetime.now().isoformat()
        
        try:
            # 1. Ingestion
            raw_text = self.ingest_file(file_path)
            
            # 2. Cleansing
            cleaned_text = self.clean_text(raw_text)
            
            # 3. Semantic Chunking
            chunks = self.semantic_chunking(cleaned_text)
            if not chunks:
                print(f"⚠️ [Pipeline] Không có văn bản nào lấy được từ {filename}.")
                return
            
            # 4. Tạo Document Objects với Metadata
            documents = []
            for i, chunk in enumerate(chunks):
                doc = Document(
                    page_content=chunk,
                    metadata={
                        "source": filename,
                        "category": category,
                        "processed_date": current_date,
                        "chunk_index": i
                    }
                )
                documents.append(doc)
            
            # 5. Lưu vào ChromaDB
            print("💾 [Storage] Đang tạo Embeddings và lưu vào ChromaDB...")
            vectorstore = Chroma(
                collection_name="brandflow_memory",
                embedding_function=self.embeddings,
                persist_directory=self.persist_directory
            )
            
            vectorstore.add_documents(documents)
            print(f"🎉 Hoàn tất! Đã lưu {len(documents)} bản ghi RAG cho file [{filename}] vào database.")
            
        except Exception as e:
            print(f"🔴 [Pipeline Lỗi] Xử lý file thất bại ({filename}): {e}")


if __name__ == "__main__":
    # Test script: Khởi tạo và chạy thử trên một bản mẫu (nếu có file)
    ingestor = DocumentIngestor()
    
    test_file = "test_sample.pdf"
    
    # Tạo một file txt giả nếu không có PDF để tránh code bị vỡ khi chạy thử test local 
    if not os.path.exists(test_file):
        print(f"⚠️ Không tìm thấy file thử nghiệm '{test_file}'. Tạo một file txt giả lập để test...")
        test_file = "test_sample.txt"
        with open(test_file, "w", encoding="utf-8") as f:
            f.write("Đây là tài liệu thử nghiệm.\n\nTrang 1/2\n\n\nKhách hàng MỤC TIÊU của sản phẩm này là những người trẻ tuổi từ 18-25, sinh sống tại các thành phố lớn.\n\nHọ có thói quen tiêu dùng nhanh và thích mua sắm online trên nền tảng Shopee, TikTok.\n\nSản phẩm của chúng tôi bao gồm: trà sữa, cà phê, bánh ngọt, ...với giá chỉ từ 25k.\n\n")

    ingestor.process_and_store(file_path=test_file, category="marketing_materials")
