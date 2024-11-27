import { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import gsap from 'gsap';
import { pauseImg, playImg, replayImg } from '../utils'
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册插件
gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to('#slider', {
      transform: `translateX(-${videoId * 100}%)`,
      duration: 2,
      ease: 'power2.inOut'
    });

    ScrollTrigger.create({
      trigger: '#video',
      start: "top center",
      onEnter: () => {
        handleProcess('scroll-play');
      },
      onEnterBack: () => {
        handleProcess('scroll-play');
      },
      onLeave: () => {
        handleProcess('scroll-pause');
      },
      onLeaveBack: () => {
        handleProcess('scroll-pause');
      }
    });
  }, [isEnd, videoId]);

  const handleProcess = (type, i) => {
    switch (type) {
      case 'video-end':
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 })); break;
      case 'video-last':
        setVideo((pre) => ({ ...pre, isLastVideo: true })); break;
      case 'video-reset':
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false })); break;
      case 'play':
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying })); break;
      case 'scroll-play':  // Add new case for scroll triggered play
        setVideo((pre) => ({ ...pre, startPlay: true, isPlaying: true }));
        break;
      case 'scroll-pause':  // Add new case for scroll triggered pause
        setVideo((pre) => ({ ...pre, isPlaying: false, }));
        break;
      case 'play-selected':
         // 快速跳转所有视频到新的位置
         for(let j = videoId; j < i; j++) {
          handleProcess('video-end', j);
        }
        break;
      default:
        return video;
    }
  };

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }

    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetaData = (i, e) => setLoadedData(
    (pre) => [...pre, e]
  )

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // animate the progress of the video
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100)
          if (progress !== currentProgress) {
            currentProgress = progress;
            gsap.to(videoDivRef.current[videoId], {
              width: window.innerWidth < 1200 ? '10vw' : '4vw',
            })

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: 'white',
            })
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px',
            })
            gsap.to(span[videoId], {
              backgroundColor: '#afafaf',
            })
          }
        }
      });

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration);
      }

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div id="slider" key={list.id} className='sm:pr-20 pr-10'>
            <div className="video-carousel_container">
              <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                <video id="video" muted playsInline={true} preload='auto'
                  className='pointer-events-none'
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() => { i !== 3 ? handleProcess('video-end', i) : handleProcess('video-last') }}
                  onPlay={(pre) => ({ ...pre, isPlaying: true })}
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type='video/mp4' />
                </video>
              </div>

              <div className='absolute top-12 left-[5%] z-10'>
                {list.textLists.map((text) => (
                  <p key={text} className='md:text-2xl text-xl font-medium'>
                    {text}
                  </p>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      <div className='relative flex-center mt-10'>
        <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
          {videoRef.current.map((_, i) => (
            <span key={i} className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
              ref={(el) => (videoDivRef.current[i] = el)}
              onClick={() => handleProcess('play-selected', i)}
            >
              <span className='absolute w-full h-full rounded-full'
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button className='control-btn'>
          <img src={isLastVideo ? replayImg : isPlaying ? pauseImg : playImg}
            alt={isLastVideo ? 'replay' : isPlaying ? 'pause' : 'play'}
            onClick={isLastVideo ? () => handleProcess('video-reset')
              : () => handleProcess('play')}
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel