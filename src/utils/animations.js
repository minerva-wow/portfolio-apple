import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const animateWithGsap = (target,animationProps,scrollProps) => {
  gsap.to(target,{...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%",
      ...scrollProps,
    }
  })
};

export const animateWithGsapTimeline = (
  timeline,
  rotationRef,
  targetRotation, 
  firstTarget,
  secondTarget,
  animationProps
) => {
  timeline.to(rotationRef.current.rotation, {
    y: targetRotation,
    duration: 1,
    ease: "power2.inOut",
  });
  timeline.to([firstTarget, secondTarget], {...animationProps, ease: "power2.inOut"}, '<');
};
