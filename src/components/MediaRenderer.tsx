import { useEffect, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  image_1,
  image_2,
  image_3,
  video_1,
  video_2,
  video_3,
} from "../source";

function getRandomImage(i: number) {
  const images = [image_1, image_2, image_3];
  return images[i % images.length];
}

function getRandomVideo(i: number) {
  const videos = [video_1, video_2, video_3];
  return videos[i % videos.length];
}

const MediaRenderer = () => {
  return (
    <Virtuoso
      style={{
        height: "90vh",
        width: "90vw",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
      totalCount={200}
      itemContent={(index) => (
        <div style={{ flexGrow: 1 }}>
          <VideoRenderer
            video_src={getRandomVideo(index)}
            image_src={getRandomImage(index)}
          />
        </div>
      )}
    />
  );
};

export default MediaRenderer;

const useAutoPlayOnVisible = (videoRef: any, image_src: string) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            videoRef.current.play().catch((error: any) => {
              console.warn("Autoplay prevented:", error);
            });
          }, 100);
        } else {
          videoRef.current.poster = image_src;
          videoRef.current.pause();
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoRef]);
};

const VideoRenderer = ({
  video_src,
  image_src,
}: {
  video_src: string;
  image_src: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useAutoPlayOnVisible(videoRef, image_src);

  return (
    <video
      ref={videoRef}
      src={video_src}
      style={{ height: "800px", width: "800px", objectFit: "cover" }}
      loop
      muted
    ></video>
  );
};
