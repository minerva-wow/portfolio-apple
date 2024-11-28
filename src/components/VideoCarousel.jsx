import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const progressRef = useRef([]);
  const progressBarRef = useRef([]);
  
  const [state, setState] = useState({
    videoId: 0,
    isPlaying: false,
    startPlay: false,
    isLastVideo: false,
    loadedVideos: []
  });
  
  const { videoId, isPlaying, startPlay, isLastVideo, loadedVideos } = state;

  const updateProgress = () => {
    const video = videoRef.current[videoId];
    const progressBar = progressRef.current[videoId];
    const progressBarContainer = progressBarRef.current[videoId];
    
    if (video && progressBar && progressBarContainer && isPlaying) {
      const progress = (video.currentTime / video.duration) * 100;
      
      gsap.to(progressBarContainer, {
        width: window.innerWidth < 760 ? "10vw" : window.innerWidth < 1200 ? "10vw" : "4vw"
      });
      
      gsap.to(progressBar, {
        width: `${progress}%`,
        backgroundColor: "white"
      });
    }
  };

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setState(prev => ({...prev, startPlay: true, isPlaying: true}));
      }
    });
  }, [videoId]);

  useEffect(() => {
    if (isPlaying) {
      const updateTicker = () => updateProgress();
      gsap.ticker.add(updateTicker);
      return () => gsap.ticker.remove(updateTicker);
    }
  }, [videoId, isPlaying]);

  const resetProgressBar = (index) => {
    if (progressRef.current[index] && progressBarRef.current[index]) {
      gsap.to(progressBarRef.current[index], {
        width: "12px"
      });
      gsap.to(progressRef.current[index], {
        width: "100%",
        backgroundColor: "#afafaf"
      });
    }
  };

  useEffect(() => {
    if (loadedVideos.length >= videoRef.current.length) {
      videoRef.current.forEach((video, i) => {
        if (i === videoId && startPlay) {
          if (isPlaying) {
            video.play();
          } else {
            video.pause();
          }
        } else {
          video.pause();
          video.currentTime = 0;
          resetProgressBar(i);
        }
      });
    }
  }, [startPlay, videoId, isPlaying, loadedVideos]);

  const handleVideo = (type, i) => {
    switch (type) {
      case "select":
        setState(prev => ({...prev, videoId: i, isPlaying: true, isLastVideo: false}));
        break;
      case "toggle":
        setState(prev => ({...prev, isPlaying: !prev.isPlaying}));
        break;
      case "reset":
        videoRef.current[videoId].currentTime = 0;
        setState(prev => ({...prev, videoId: 0, isLastVideo: false, isPlaying: true}));
        break;
      case "end":
        if (i === hightlightsSlides.length - 1) {
          setState(prev => ({...prev, isLastVideo: true, isPlaying: false}));
          resetProgressBar(i);  // 使用统一的 resetProgressBar 处理
        } else {
          setState(prev => ({...prev, videoId: i + 1}));
        }
        break;
    }
  };

  const handleLoadedMetaData = (i) => {
    setState(prev => ({
      ...prev,
      loadedVideos: [...prev.loadedVideos, i]
    }));
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((slide, i) => (
          <div key={slide.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  ref={el => videoRef.current[i] = el}
                  className={`${slide.id === 2 && "translate-x-44"} pointer-events-none`}
                  playsInline
                  muted
                  preload="auto"
                  onEnded={() => handleVideo("end", i)}
                  onLoadedMetadata={() => handleLoadedMetaData(i)}
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {slide.textLists.map((text, i) => (
                  <p key={i} className="md:text-2xl text-xl font-medium">{text}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={el => progressBarRef.current[i] = el}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              onClick={() => handleVideo("select", i)}
            >
              <span
                ref={el => progressRef.current[i] = el}
                className="absolute h-full w-full rounded-full"
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={() => handleVideo(isLastVideo ? "reset" : "toggle")}
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;