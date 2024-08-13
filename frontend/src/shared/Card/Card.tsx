import { FC } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { getCardImage } from "./utils";

type CardProps = {
  imageKey: string;
  name: string;
  topic: string;
  country: string;
};

export const Card: FC<CardProps> = ({ imageKey, name, topic, country }) => {
  return (
    <div className={styles.card}>
      <Image src={getCardImage(imageKey)} alt={name} className={styles.image} />
      <div className={styles.content}>
        <p className={styles.name}>{name.split("_").join(" ")}</p>
        <div className={styles.info}>
          <p>#{topic}</p>
          <p>{country}</p>
        </div>
      </div>
    </div>
  );
};
