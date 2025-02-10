import { Input } from "@/components/ui/input";
import { ChangeEvent, KeyboardEvent } from "react";

interface NumericInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const NumericInput = ({
  value,
  onChange,
  placeholder,
  className,
}: NumericInputProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentValue = value === "" ? 0 : parseInt(value);
      const newValue =
        e.key === "ArrowUp" ? currentValue + 1 : currentValue - 1;
      onChange(newValue.toString());
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Allow empty string or numbers only
    if (newValue === "" || /^\d+$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default NumericInput;
