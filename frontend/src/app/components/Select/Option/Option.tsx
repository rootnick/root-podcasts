"use client";

import { DetailedHTMLProps, FC } from "react";
export type OptionProps = DetailedHTMLProps<
  React.OptionHTMLAttributes<HTMLOptionElement>,
  HTMLOptionElement
> & {
  text?: string;
};

export const Option: FC<OptionProps> = ({ value, selected, text = "" }) => {
  return (
    <option value={value} selected={selected}>
      {text}
    </option>
  );
};
