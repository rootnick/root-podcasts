"use client";

import { ChangeEventHandler } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import GlassIcon from "@/image/glass.svg";
import Image from "next/image";

export const Search = () => {
  const router = useRouter();
  const readSearchParams = useSearchParams();
  const value = readSearchParams.get("s") || "";

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const urlSearchParams = new URLSearchParams(readSearchParams);
    const eventValue = event.target.value;

    if (eventValue) {
      urlSearchParams.set("s", eventValue);
    } else {
      urlSearchParams.delete("s");
    }

    router.replace(`?${urlSearchParams.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.search}>
      <Image src={GlassIcon} alt="glass" />
      <input
        type="search"
        defaultValue={value}
        onChange={handleChange}
        className={styles.input}
      />
    </div>
  );
};
