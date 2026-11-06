"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// gsap
import { useGSAP } from "@gsap/react";
import hasFadeAnim from "@/lib/animation/hasFadeAnim";

// types
import { ActionBtnType } from "@/types";

// components
import Title1 from "@/components/shared/title/title1";

type Props = {
  integration: {
    data: {
      title: string;
      image: string;
      text: string;
      action_btn: ActionBtnType;
    };
  };
};

const ChatbotIntegration = ({ integration }: Props) => {
  const { title, image, text, action_btn } = integration.data;

  const containerRef = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      hasFadeAnim();
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-[52px] md:pt-[72px] xl:pt-[92px] 2xl:pt-[122px] sec_space_bottom2">
      <div className="container" ref={containerRef}>
        <Title1
          text={title}
          className="max-w-[510px] mx-auto has_fade_anim text-center"
        />
        <div className="mt-[55px] flex justify-center">
          {image && (
            <Image width={820} height={339} src={image} alt="gallery thumb" />
          )}
        </div>
        <div className="mt-[70px] text-center">
          <p className="inline-block rounded-[9px] px-[20px] py-[11px] border border-border has_fade_anim">
            {text}{" "}
            {action_btn && action_btn.enable && (
              <Link
                href={action_btn.link}
                className="underline underline-offset-2"
                style={{ textDecorationSkipInk: "none" }}
              >
                {action_btn.label}
              </Link>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChatbotIntegration;
