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
