import { db } from "./connector";
import { basePodcastsRequest, generateSearch } from "./utils";

export const getAllTopics = () => {
  try {
    const query = `SELECT * FROM topics`;
    const readQuery = db.prepare(query);
    const rowList = readQuery.all();
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllCountries = () => {
  try {
    const query = `SELECT * FROM countries`;
    const readQuery = db.prepare(query);
    const rowList = readQuery.all();
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getFavoritePodcasts = () => {
  try {
    const query = `
${basePodcastsRequest}
LIMIT 4
`;
    const readQuery = db.prepare(query);
    const rowList = readQuery.all();
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getPodcastsByName = (name: string) => {
  try {
    const query = `
${basePodcastsRequest}
WHERE  podcasts.name LIKE '%${name}%'
  `;
    const readQuery = db.prepare(query);
    const rowList = readQuery.all();
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getPodcasts = (country: string, topic: string) => {
  try {
    const query = `
${basePodcastsRequest}
${generateSearch(country, topic)}
`;
    const readQuery = db.prepare(query);
    const rowList = readQuery.all();
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
