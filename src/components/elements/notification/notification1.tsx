"use client";

import { useState } from "react";
import Link from "next/link";

// icons
import { X } from "lucide-react";

// lib
import { cn } from "@/lib/utils";
import { markdownify } from "@/lib/helper/convert";

// types
import { ActionBtnType } from "@/types";

type Props = {
  notification: {
    data: {
      text: string;
      action_btn: ActionBtnType;
    };
  };
};

const Notification1 = ({ notification }: Props) => {
  const { text, action_btn } = notification.data;

  const [isCLose, setIsClose] = useState<boolean>(false);

  return (
    <div
      className={cn(
        isCLose ? "hidden" : "hidden md:block bg-theme relative p-[15px]"
      )}
    >
      <div className="flex justify-center items-center gap-[10px]">
        <p
          className="text-white text-[16px] font-bold text-center [&>span]:bg-[#ffffff21] [&>span]:px-[10px] [&>span]:py-[4px] [&>span]:rounded-full [&>span]:mx-[3px] [&>span]:border [&>span]:border-[#ffffff14]"
          dangerouslySetInnerHTML={markdownify(text)}
        ></p>
        {action_btn && action_btn.enable && (
          <Link
            href={action_btn.link}
            className="text-white text-[16px] font-bold text-center bg-[#ffffff21] px-[10px] py-[4px] rounded-full mx-[3px] border border-[#ffffff14]"
          >
            {action_btn.label}
          </Link>
        )}
      </div>
      <button
        className="absolute top-[50%] right-[25px] p-[5px] -translate-y-[50%]"
        onClick={() => setIsClose(true)}
      >
        <X color="white" />
      </button>
    </div>
  );
};

export default Notification1;
