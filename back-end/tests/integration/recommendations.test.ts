import supertest from "supertest";
import { prisma } from "../../src/database.js";
import { faker } from "@faker-js/faker";
import app from "../../src/app.js";
import recommendationFactory from "../factory/recommendationFactory.js";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

afterAll(() => {
  prisma.$disconnect;
});

describe("Testes na rota Post: /recommendations", () => {
  it("Caso sucesso: deve retornar 201 e adicionar a recomendação no banco", async () => {
    const recommendation = recommendationFactory();
    const result = await supertest(app)
      .post("/recommendations")
      .send(recommendation);
    const recommendationInBD = await prisma.recommendation.findFirst({
      where: {
        id: result.body.id,
      },
    });
    expect(result.status).toEqual(201);
    expect(recommendation.name).toEqual(recommendationInBD.name);
    expect(recommendation.youtubeLink).toEqual(recommendation.youtubeLink);
  });

  it("Caso erro: link enviado não pertence ao youtube, deve retornar status 422", async () => {
    const recommendation = recommendationFactory();
    recommendation.youtubeLink = faker.internet.url();
    const result = await supertest(app)
      .post("/recommendations")
      .send(recommendation);
    expect(result.status).toEqual(422);
  });

  it("Caso erro: name não é uma string, deve retornar status 422", async () => {
    const youtube = `https://www.youtube.com/watch?v=${faker.lorem.word()}`;
    const recommendation = {
      name: 511515,
      youtubeLink: youtube,
    };
    const result = await supertest(app)
      .post("/recommendations")
      .send(recommendation);
    expect(result.status).toEqual(422);
  });

  it("Caso erro: duas recomendações com mesmo nome criadas, deve retornar status 409", async () => {
    const recommendation = recommendationFactory();
    await prisma.recommendation.create({ data: recommendation });
    const result = await supertest(app)
      .post("/recommendations")
      .send(recommendation);
    const recommendationInBD = await prisma.recommendation.findMany({
      where: {
        name: recommendation.name,
      },
    });
    expect(result.status).toEqual(409);
    expect(recommendationInBD.length).toEqual(1);
  });
});

describe("Testes na rota Post:/recommendations/:id/upvote", () => {
  it("Caso sucesso: retornar 200 e acrescentar 1 ao score a cada requisição", async () => {
    const recommendation = recommendationFactory();
    const { id, score } = await prisma.recommendation.create({
      data: recommendation,
    });
    const result = await supertest(app)
      .post(`/recommendations/${id}/upvote`)
      .send();
    const recommendationInDb = await prisma.recommendation.findFirst({
      where: {
        id,
      },
    });
    expect(result.status).toEqual(200);
    expect(recommendationInDb.score).toEqual(score + 1);
  });

  it("Caso erro: id inválido, retornar 404", async () => {
    const result = await supertest(app)
      .post("/recommendations/1/upvote")
      .send();
    expect(result.status).toEqual(404);
  });
});
