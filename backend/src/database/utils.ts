export const generateSearch = (country: string, topic: string) => {
  let str = [];

  if (country) {
    str.push(`countries.id=${country}`);
  }

  if (topic) {
    str.push(`topics.id=${topic}`);
  }

  return str.length ? `WHERE ${str.join(" AND ")}` : "";
};

export const basePodcastsRequest = `
SELECT podcasts.id, podcasts.name, podcasts.imageKey,topics.name as topic, countries.name as country
FROM podcasts
INNER JOIN topics ON podcasts.topicId=topics.id
INNER JOIN countries ON podcasts.countryId=countries.id`;
