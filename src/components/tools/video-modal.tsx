"use client";

import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

// lib
import { cn } from "@/lib/utils";

// shadcn components
import { Dialog, DialogContent } from "../ui/dialog";

type Props = {
  link: string;
  isOpen: boolean;
  close: () => void;
};

const VideoModal = ({ link, isOpen, close }: Props) => {
  const [deviceWidth, setDeviceWidth] = useState(0);

  useEffect(() => {
    let device_width = window.innerWidth;
    setDeviceWidth(device_width);
  }, []);

  const findVideoWidth = (data: number): string => {
    if (data <= 425) {
      return "max-w-[90vw]";
    } else if (data > 425 && data <= 820) {
      return "max-w-[520px]";
    } else {
      return "max-w-[640px]";
    }
  };
  return (
    <Dialog onOpenChange={close} open={isOpen} modal>
      <DialogContent
        className={cn(
          findVideoWidth(deviceWidth),
          "px-0 pb-0 pt-[40px] border-[0px] flex justify-center shadow-none [&>button]:right-0 [&>button]:top-0"
        )}
      >
        <ReactPlayer
          url={link}
          width={findVideoWidth(deviceWidth)}
          height="auto"
          controls
        />
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
