import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

export function recommendationsFactory() {
  const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
  const recommendation = {
    name: faker.lorem.words(3),
    youtubeLink: youtube,
  };
  return recommendation;
}

export async function create15recommendationsInBD() {
  for (let i = 0; i < 15; i++) {
    const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
    const recommendation = {
      name: faker.lorem.words(3),
      youtubeLink: youtube,
    };
    await prisma.recommendation.create({ data: recommendation });
  }
}

export async function create3recommendationsInBD() {
  for (let i = 0; i < 3; i++) {
    const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
    const recommendation = {
      name: faker.lorem.words(3),
      youtubeLink: youtube,
    };
    await prisma.recommendation.create({ data: recommendation });
  }
}
