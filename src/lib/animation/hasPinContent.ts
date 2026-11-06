import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function hasPinContent(
  element: any,
  area: any,
  start?: string,
  dWidth: number = 991
) {
  let device_width = window.innerWidth;
  let startFrom = start || "top top";

  if (element && device_width > dWidth) {
    return gsap.to(element, {
      scrollTrigger: {
        trigger: area,
        pin: element,
        start: startFrom,
        end: "bottom bottom",
        pinSpacing: false,
      },
    });
  }
}
