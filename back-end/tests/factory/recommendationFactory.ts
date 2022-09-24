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

export async function create15RecommendationsInDB() {
  for (let i = 0; i < 15; i++) {
    const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
    const recommendation = {
      name: faker.lorem.words(3),
      youtubeLink: youtube,
    };
    await prisma.recommendation.create({ data: recommendation });
  }
}

export async function create3RecommendationsInDB() {
  for (let i = 0; i < 3; i++) {
    const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
    const recommendation = {
      name: faker.lorem.words(3),
      youtubeLink: youtube,
    };
    await prisma.recommendation.create({ data: recommendation });
  }
}

export async function create2RecommendationsInDBWithScore() {
  const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
  const recommendation = {
    name: "Recomendação score alto",
    youtubeLink: youtube,
    score: 11,
  };
  const recommendation2 = {
    name: "Recomendação score baixo",
    youtubeLink: youtube,
    score: 10,
  };
  await prisma.recommendation.create({ data: recommendation });
  await prisma.recommendation.create({ data: recommendation2 });
}

export async function create10RecommendationsInDBWithScore() {
  for (let i = 0; i < 10; i++) {
    const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
    const recommendation = {
      name: faker.lorem.words(3),
      youtubeLink: youtube,
      score: faker.datatype.number({ min: -5, max: 100 }),
    };
    await prisma.recommendation.create({ data: recommendation });
  }
}

export function recommendationFactoryData() {
  const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
  const recommendation = {
    id: faker.datatype.number(100),
    name: faker.lorem.words(3),
    youtubeLink: youtube,
    score: 0,
  };
  return recommendation;
}

export function recommendationsGoodScore() {
  const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
  const result = [];
  for (let i = 0; i < 5; i++) {
    const recommendation = {
      id: faker.datatype.number(100),
      name: faker.lorem.words(3),
      youtubeLink: youtube,
      score: faker.datatype.number({ min: 11, max: 100 }),
    };
    result.push(recommendation);
  }
  return result;
}

export function recommendationsBadScore() {
  const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
  const result = [];
  for (let i = 0; i < 5; i++) {
    const recommendation = {
      id: faker.datatype.number(100),
      name: faker.lorem.words(3),
      youtubeLink: youtube,
      score: faker.datatype.number({ min: -5, max: 10 }),
    };
    result.push(recommendation);
  }
  return result;
}
