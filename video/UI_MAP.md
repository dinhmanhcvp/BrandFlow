# BrandFlow UI Map for Remotion Video

## Phân tích Codebase Gốc
- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4, globals.css (chứa cấu hình theme chính)
- **Thư viện UI/Icon**: Framer Motion (Animation), Lucide React (Icons), tailwind-merge, clsx.
- **State/Data**: Zustand (global state), Fetch API nội bộ, Context API.

## Danh sách Màn hình (Scenes) & Mapping Component

### 1. Màn hình Onboarding / Upload (Scene 1)
- **Đường dẫn gốc**: `frontend/src/app/demo-video-final/CinematicOnboardingMock.tsx`
- **Các vùng UI chính**: 
  - `upload-zone`: Khu vực kéo thả file (hiệu ứng lò xo, hút từ tính).
  - `intro-text`: Chữ giới thiệu BrandFlow.
- **Mock Data**: Dữ liệu file upload (tên tệp: `brand_guideline.pdf`).

### 2. Màn hình Phân tích Brand DNA (Scene 2)
- **Đường dẫn gốc**: `frontend/src/app/demo-video-final/CinematicDataIngestionMock.tsx`
- **Các vùng UI chính**: 
  - `dna-dashboard`: Lưới Dashboard (Bento grid) chứa các thông số: Goal, Audience, Personality, USP.
  - `sidebar`: Sidebar gốc của app BrandFlow.
- **Mock Data**: Bếp Nhà Mộc (Corporate Catering).

### 3. Màn hình Design Studio (Scene 3)
- **Đường dẫn gốc**: `frontend/src/app/demo-video-final/CinematicDesignStudioMock.tsx` (và `frontend/src/app/design-studio/page.tsx`)
- **Các vùng UI chính**: 
  - `tab-visuals`: Tóm tắt nhận diện thương hiệu, Logo & Color System, Fanpage Mockup.
  - `tab-case-study`: Giao diện cuộn dọc kiểu Behance (Hero, Mission, Typography).
  - `tab-deck-builder`: Các thẻ 3D lật mở (Domino effect) tạo Slide Deck.
- **Mock Data**: Avatar Bếp Nhà Mộc, Banner Bếp Nhà Mộc, Master DNA Bếp Nhà Mộc.

### 4. Màn hình Content Daily (Scene 4)
- **Đường dẫn gốc**: `frontend/src/app/demo-video-final/CinematicContentDailyMock.tsx`
- **Các vùng UI chính**: 
  - `prompt-panel`: Panel cấu hình nội dung bên trái (chứa ô textarea gõ prompt).
  - `phone-mockup`: Khung điện thoại hiển thị 5 mạng xã hội (Facebook, LinkedIn, TikTok, Instagram, Zalo).
- **Mock Data**: Các bài viết tương ứng 5 mạng xã hội của Bếp Nhà Mộc.

### 5. Màn hình Gantt & Finance (Scene 5)
- **Đường dẫn gốc**: `frontend/src/app/demo-video-final/CinematicFinanceGanttMock.tsx` (và `frontend/src/app/planning/b6-gantt/page.tsx`)
- **Các vùng UI chính**: 
  - `gantt-chart`: Biểu đồ Gantt (Timeline).
  - `finance-cards`: Các thẻ chi phí (Budget, Spent, Remaining).

## Cấu trúc Copy sang Remotion
- **UI Components**: Sẽ được copy nguyên vẹn cấu trúc JSX/Tailwind vào `video/src/ui/`.
- **Mock Data**: Lưu tại `video/src/mock/mockData.ts`.
- **Styling**: Bê nguyên `frontend/src/app/globals.css` sang `video/src/globals.css`.
- **Isolation Strategy**: 
  - Gỡ bỏ `next/link`, `next/image`, `next/router`.
  - Thay thế các `useEffect` chứa logic `setTimeout` cứng bằng hook `useCurrentFrame()` của Remotion để đồng bộ frame-by-frame.
