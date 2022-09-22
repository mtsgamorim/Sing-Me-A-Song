import { faker } from "@faker-js/faker";

export default function recommendationsFactory() {
  const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
  const recommendation = {
    name: faker.lorem.words(3),
    youtubeLink: youtube,
  };
  return recommendation;
}
