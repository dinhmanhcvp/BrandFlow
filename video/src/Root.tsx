import { Composition } from "remotion";
import "./globals.css";
import { MotionLab } from "./MotionLab";
import { ComponentLab } from "./ComponentLab";
import { MainVideo } from "./Main";
import { MainVertical } from "./MainVertical";
import { Main30s } from "./Main30s";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={MainVideo}
        durationInFrames={3120} // 104s
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Main-Vertical"
        component={MainVertical}
        durationInFrames={1800} // 60s
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Main-30s"
        component={Main30s}
        durationInFrames={900} // 30s
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Motion-Lab"
        component={MotionLab}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Component-Lab"
        component={ComponentLab}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
