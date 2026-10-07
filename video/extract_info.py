import os
import subprocess
import json
import glob
from pathlib import Path

def main():
    ref_dir = Path(r"c:\Users\PC\OneDrive - Hanoi University of Science and Technology\BrandFLow\video\ref")
    md_path = ref_dir / "PLATES.md"
    videos = glob.glob(str(ref_dir / "*.mp4"))

    md_content = "# PLATES\n\n"

    for vid in videos:
        basename = os.path.basename(vid)
        name = os.path.splitext(basename)[0]
        frames_dir = ref_dir / "frames" / name
        frames_dir.mkdir(parents=True, exist_ok=True)
        
        # ffprobe
        cmd = [
            "ffprobe", 
            "-v", "error", 
            "-select_streams", "v:0", 
            "-show_entries", "stream=width,height,r_frame_rate,duration", 
            "-of", "json", 
            vid
        ]
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, check=True)
            data = json.loads(res.stdout)
            stream = data.get("streams", [{}])[0]
            w = stream.get("width")
            h = stream.get("height")
            fps_str = stream.get("r_frame_rate", "30/1")
            duration = stream.get("duration")
            
            # calculate fps
            num, den = map(int, fps_str.split('/'))
            fps = num / den if den != 0 else 0
            
            md_content += f"## {name}\n"
            md_content += f"- Resolution: {w}x{h}\n"
            md_content += f"- FPS: {fps:.2f} ({fps_str})\n"
            md_content += f"- Duration: {duration}s\n\n"
            
            print(f"Extracting frames for {name}...")
            # ffmpeg extract 1 frame per 0.5s (2fps)
            extract_cmd = [
                "ffmpeg", "-y", "-i", vid, 
                "-vf", "fps=2", 
                str(frames_dir / "frame_%04d.jpg")
            ]
            subprocess.run(extract_cmd, capture_output=True, check=True)
        except Exception as e:
            print(f"Failed for {vid}: {e}")
            md_content += f"## {name}\n- ERROR: {e}\n\n"

    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    print("Done!")

if __name__ == '__main__':
    main()
