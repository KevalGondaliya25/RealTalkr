import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimationSetting = {
  opacity: string | number;
  ease: string;
  duration: string | number;
  delay: string | number;
  y?: string | number;
  x?: string | number;
  scrollTrigger?: {
    trigger: any;
    start: string;
  };
};

export default function hasFadeAnim() {
  const fadeArray = gsap.utils.toArray(".has_fade_anim");
  fadeArray.forEach((item: any) => {
    let fade_direction = "bottom";
    let onscroll_value = 1;
    let duration_value = 0.5;
    let fade_offset = 40;
    let delay_value = 0.15;
    let ease_value = "power2.out";

    if (item.getAttribute("data-fade-offset")) {
      fade_offset = item.getAttribute("data-fade-offset");
    }
    if (item.getAttribute("data-duration")) {
      duration_value = item.getAttribute("data-duration");
    }

    if (item.getAttribute("data-fade-from")) {
      fade_direction = item.getAttribute("data-fade-from");
    }
    if (item.getAttribute("data-on-scroll")) {
      onscroll_value = item.getAttribute("data-on-scroll");
    }
    if (item.getAttribute("data-delay")) {
      delay_value = item.getAttribute("data-delay");
    }
    if (item.getAttribute("data-ease")) {
      ease_value = item.getAttribute("data-ease");
    }

    let animation_settings: AnimationSetting = {
      opacity: 0,
      ease: ease_value,
      duration: duration_value,
      delay: delay_value,
    };

    if (fade_direction == "top") {
      animation_settings["y"] = -fade_offset;
    }
    if (fade_direction == "left") {
      animation_settings["x"] = -fade_offset;
    }

    if (fade_direction == "bottom") {
      animation_settings["y"] = fade_offset;
    }

    if (fade_direction == "right") {
      animation_settings["x"] = fade_offset;
    }

    if (onscroll_value == 1) {
      animation_settings["scrollTrigger"] = {
        trigger: item,
        start: "top 100%",
      };
    }
    return gsap.from(item, animation_settings);
  });
}
