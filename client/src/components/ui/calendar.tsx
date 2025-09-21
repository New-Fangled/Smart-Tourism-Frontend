"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DayPickerSingleProps, DayPickerRangeProps, DayPickerMultipleProps } from "react-day-picker";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

type CalendarProps = {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  mode?: "single" | "range" | "multiple";
} & (
  | ({ mode: "single" } & Omit<DayPickerSingleProps, "mode">)
  | ({ mode: "range" } & Omit<DayPickerRangeProps, "mode">)
  | ({ mode: "multiple" } & Omit<DayPickerMultipleProps, "mode">)
);

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  mode = "single",
  ...props
}: CalendarProps) {
  let dayPickerProps: any = {
    showOutsideDays,
    className: cn("p-3", className),
    classNames: {
      months: "flex flex-col sm:flex-row gap-2",
      month: "flex flex-col gap-4",
      caption: "flex justify-center pt-1 relative items-center w-full",
      caption_label: "text-sm font-medium",
      nav: "flex items-center gap-1",
      nav_button: cn(
        buttonVariants({ variant: "outline" }),
        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
      ),
      nav_button_previous: "absolute left-1",
      nav_button_next: "absolute right-1",
      table: "w-full border-collapse space-x-1",
      head_row: "flex",
      head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
      row: "flex w-full mt-2",
      cell: cn(
        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
        mode === "range"
          ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
          : "[&:has([aria-selected])]:rounded-md"
      ),
      day: cn(
        buttonVariants({ variant: "ghost" }),
        "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
      ),
      day_range_start: "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
      day_range_end: "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
      day_today: "bg-accent text-accent-foreground",
      day_outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
      day_disabled: "text-muted-foreground opacity-50",
      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
      day_hidden: "invisible",
      ...classNames,
    }
  };

  if (mode === "single") {
    dayPickerProps = { ...dayPickerProps, mode: "single", ...(props as Omit<DayPickerSingleProps, "mode">) };
  } else if (mode === "range") {
    dayPickerProps = { ...dayPickerProps, mode: "range", ...(props as Omit<DayPickerRangeProps, "mode">) };
  } else if (mode === "multiple") {
    dayPickerProps = { ...dayPickerProps, mode: "multiple", ...(props as Omit<DayPickerMultipleProps, "mode">) };
  }

  return (
    <DayPicker
      {...dayPickerProps}
      // Remove iconLeft and iconRight, as DayPicker does not support these props
    />
  );
}

export { Calendar };
