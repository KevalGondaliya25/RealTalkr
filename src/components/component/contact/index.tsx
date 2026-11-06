"use client";

import Image from "next/image";

// shadcn components
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContactForm from "@/components/elements/contact/contact-form";

type Props = {
  isOpen: boolean;
  close: () => void;
  className?: string;
};

const Contact = ({ isOpen, close, className }: Props) => {
  return (
    <Dialog onOpenChange={close} open={isOpen} modal>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="px-[5px] md:px-[25px] pb-[60px] md:pb-[80px] pt-[50px] md:pt-[70px] max-w-[calc(100%-20px)] md:max-w-[550px] max-h-[90vh] border-[0px] !rounded-[30px] bg-white z-[999] [&>button]:border [&>button]:border-border [&>button]:rounded-full [&>button]:p-3 [&>button]:top-2 [&>button]:right-2 [&>button]:text-primary"
      >
        <ScrollArea className="h-[75vh] w-full px-[20px]">
          <DialogHeader className="pb-[40px]">
            <h2 className="text-[30px] text-center text-primary font-colasta font-bold leading-none">
              Let’s connect with us.
            </h2>
          </DialogHeader>
          <div>
            <ContactForm className={className} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Contact;
