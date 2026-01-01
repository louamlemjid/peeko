"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type TailwindComboboxProps = {
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
};

export function DataList({
  options,
  value = "",
  onValueChange,
  placeholder = "Select or type...",
  emptyMessage = "No options found.",
  className,
  disabled = false,
}: TailwindComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Display current value (from options or custom)
  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || value || "";

  // Filter options based on input
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Check if input matches an existing option
  const isCustomValue =
    inputValue.trim() &&
    !options.some(
      (opt) => opt.label.toLowerCase() === inputValue.trim().toLowerCase()
    );

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    setInputValue(selectedValue);
    setOpen(false);
  };

  const handleCustomSubmit = () => {
    if (isCustomValue && inputValue.trim()) {
      onValueChange?.(inputValue.trim());
      setInputValue(inputValue.trim());
      setOpen(false);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        // setOpen(false);
        // setInputValue(""); // Clear input on close
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && open) {
      e.preventDefault();
      // If input matches an existing option exactly, select it
      const matchingOption = filteredOptions.find(
        (opt) => opt.label.toLowerCase() === inputValue.trim().toLowerCase()
      );
      if (matchingOption) {
        handleSelect(matchingOption.value);
      } else if (isCustomValue) {
        handleCustomSubmit();
      }
    } else if (e.key === "Escape") {
    //   setOpen(false);
      setInputValue("");
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center justify-between w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-foreground ring-offset-background",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          "cursor-pointer"
        )}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={open ? inputValue : selectedLabel}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedLabel ? "" : placeholder}
          disabled={disabled}
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-foreground border rounded-md shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length === 0 && !isCustomValue && (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                {emptyMessage}
              </div>
            )}

            {/* Custom value option */}
            {isCustomValue && (
              <button
                onClick={handleCustomSubmit}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
              >
                <span>Create "{inputValue}"</span>
                <span className="text-xs text-muted-foreground">Press Enter ↵</span>
              </button>
            )}

            {/* Predefined options */}
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-between",
                  value === option.value && "bg-accent text-accent-foreground"
                )}
              >
                <span>{option.label}</span>
                {value === option.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}