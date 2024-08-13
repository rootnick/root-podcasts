"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Podcast } from "@/types";
import { Card } from "@/shared";
import styles from "./styles.module.css";

export const CardBlock = () => {
  const searchParams = useSearchParams();

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/podcasts?${searchParams}`
      );
      const data = await res.json();
      setPodcasts(data);
    };
    load();
  }, [searchParams]);

  return (
    <div className={styles.cards}>
      {podcasts.map((podcast) => {
        return (
          <Card
            key={podcast.id}
            imageKey={podcast.imageKey}
            topic={podcast.topic}
            name={podcast.name}
            country={podcast.country}
          />
        );
      })}
    </div>
  );
};
