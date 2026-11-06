"use client";
import React from "react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  label: string;
  leftLabel?: string;
  rightLabel?: string;
  valueDisplay?: string | number;
  leftLabelInfo?: string | null;
  rightLabelInfo?: string | null;
  onChange: (value: number) => void;
}

export const CustomSlider = ({
  value,
  min,
  max,
  label,
  leftLabel,
  rightLabel,
  valueDisplay,
  onChange,
  step = 0.1,
  leftLabelInfo = null,
  rightLabelInfo = null,
}: CustomSliderProps) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm text-charcoal">{label}</label>
        {valueDisplay !== undefined && (
          <span className="text-sm font-medium text-primary">
            {valueDisplay}
          </span>
        )}
      </div>
      <div className="pt-2">
        <Slider
          className="relative flex w-full touch-none select-none items-center cursor-pointer"
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={(values) => onChange(values[0])}
        >
          <Slider className="slider-track relative h-1 w-full grow rounded-full">
            <Slider className="slider-track-active absolute h-full" />
          </Slider>
          <Slider className="slider-thumb" aria-label={label} />
        </Slider>

        {(leftLabel || rightLabel) && (
          <div className="flex justify-between mt-2">
            {leftLabel && (
              <div className="flex items-center gap-1 text-[12px] text-charcoal">
                <span>{leftLabel}</span>
                {leftLabelInfo && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info
                        size={12}
                        className="text-gray-400 cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="w-52 bg-white text-charcoal text-xs rounded shadow"
                    >
                      {leftLabelInfo}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}

            {rightLabel && (
              <div className="flex items-center gap-1 text-[12px] text-charcoal">
                <span>{rightLabel}</span>
                {rightLabelInfo && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info
                        size={12}
                        className="text-gray-400 cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="end"
                      className="w-52 bg-white text-charcoal text-xs rounded shadow"
                    >
                      {rightLabelInfo}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
