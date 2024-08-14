import { FirtersResponse, Podcast } from "@/types";
import styles from "./styles.module.css";
import { Card } from "@/shared";
import { CardBlock, Search, Select } from "./components";
import { Suspense } from "react";

async function getFavorite() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/podcasts/favorite`
  );
  const { data }: { data: Podcast[] } = await res.json();

  return (
    <div className={styles.cards}>
      {data.map((podcast) => {
        return (
          <Card
            key={podcast.id}
            imageKey={podcast.imageKey}
            name={podcast.name}
            topic={podcast.topic}
            country={podcast.country}
          />
        );
      })}
    </div>
  );
}

async function getFilters() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/podcasts/filters`
  );
  const { countries, topics } = (await res.json()) satisfies FirtersResponse;

  return (
    <div className={styles.filters}>
      <Suspense>
        <Search />
        <div className={styles.selects}>
          <Select searchParam="topic" elements={topics} placeholder="Тема" />
          <Select
            searchParam="country"
            elements={countries}
            placeholder="Страна"
          />
        </div>
      </Suspense>
    </div>
  );
}

export default async function MainPage() {
  return (
    <main>
      <p>Выбор редакции:</p>
      {await getFavorite()}
      {await getFilters()}
      <Suspense>
        <CardBlock />
      </Suspense>
    </main>
  );
}
