"use client";

import {
  ChangeEventHandler,
  DetailedHTMLProps,
  FC,
  SelectHTMLAttributes,
  useId,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Option } from "./Option";
import { Dictonary } from "@/types";
import styles from "./styles.module.css";

type SelectProps = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  searchParam: string;
  elements: Dictonary[];
  placeholder: string;
};

export const Select: FC<SelectProps> = ({
  searchParam,
  elements,
  placeholder,
}) => {
  const router = useRouter();
  const readSearchParams = useSearchParams();
  const id = useId();

  const searchValue = readSearchParams.get(searchParam) || "";

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const urlSearchParams = new URLSearchParams(readSearchParams);

    const eventValue = event.target.value;

    if (eventValue) {
      urlSearchParams.set(searchParam, eventValue);
    } else {
      urlSearchParams.delete(searchParam);
    }

    router.replace(`?${urlSearchParams.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.selectWrapper}>
      <label htmlFor={`${id}-${searchParam}`}>{placeholder}</label>
      <select
        id={`${id}-${searchParam}`}
        onChange={handleChange}
        defaultValue={searchValue}
        className={styles.select}
      >
        <Option value="" />

        {elements.map((element) => {
          return (
            <Option value={element.id} key={element.id} text={element.name} />
          );
        })}
      </select>
    </div>
  );
};
