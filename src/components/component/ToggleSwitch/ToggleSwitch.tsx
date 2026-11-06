"use client";
import { Switch } from "@/components/ui/switch";
interface ToggleSwitchProps {
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ToggleSwitch = ({
  title,
  description,
  checked,
  onCheckedChange,
}: ToggleSwitchProps) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <h4 className="text-sm text-charcoal">{title}</h4>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-theme"
      />
    </div>
  );
};