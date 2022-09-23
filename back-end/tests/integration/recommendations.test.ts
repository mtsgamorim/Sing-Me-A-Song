import supertest from "supertest";
import { prisma } from "../../src/database.js";
import { faker } from "@faker-js/faker";
import app from "../../src/app.js";
import {
  recommendationsFactory,
  create15recommendationsInBD,
  create3recommendationsInBD,
} from "../factory/recommendationFactory.js";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

afterAll(() => {
  prisma.$disconnect;
});

describe("Testes na rota Post: /recommendations", () => {
  it("Caso sucesso: deve retornar 201 e adicionar a recomendação no banco", async () => {
    const recommendation = recommendationsFactory();
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
    const recommendation = recommendationsFactory();
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
    const recommendation = recommendationsFactory();
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
    const recommendation = recommendationsFactory();
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

describe("Testes na rota Post:/recommendations/:id/downvote", () => {
  it("Caso sucesso: retornar 200 e diminuir 1 ao score a cada requisição", async () => {
    const recommendation = recommendationsFactory();
    const { id, score } = await prisma.recommendation.create({
      data: recommendation,
    });
    const result = await supertest(app)
      .post(`/recommendations/${id}/downvote`)
      .send();
    const recommendationInDb = await prisma.recommendation.findFirst({
      where: {
        id,
      },
    });
    expect(result.status).toEqual(200);
    expect(recommendationInDb.score).toEqual(score - 1);
  });

  it("Caso sucesso: excluir recomendação quando ela for menor que -5", async () => {
    const recommendation = recommendationsFactory();
    const { id } = await prisma.recommendation.create({
      data: recommendation,
    });
    for (let i = 0; i < 5; i++) {
      await supertest(app).post(`/recommendations/${id}/downvote`).send();
    }
    const result = await supertest(app)
      .post(`/recommendations/${id}/downvote`)
      .send();
    const recommendationInDb = await prisma.recommendation.findFirst({
      where: {
        id,
      },
    });
    expect(result.status).toEqual(200);
    expect(recommendationInDb).toBeFalsy();
  });

  it("Caso erro: id inválido, retornar 404", async () => {
    const result = await supertest(app)
      .post("/recommendations/1/downvote")
      .send();
    expect(result.status).toEqual(404);
  });
});

describe("Testes na rota GET /recommendations", () => {
  it("Teste sucesso: Retornar status 200 e 10 recomendações", async () => {
    await create15recommendationsInBD();
    const result = await supertest(app).get("/recommendations").send();
    expect(result.status).toEqual(200);
    expect(result.body.length).toEqual(10);
    expect(result.body[0].id).toBeTruthy();
    expect(result.body[0].name).toBeTruthy();
    expect(result.body[0].youtubeLink).toBeTruthy();
    expect(result.body[0].score).toEqual(0);
  });

  it("Teste sucesso: Retornar status 200 e apenas as recomendaçoes criadas menores que 10", async () => {
    await create3recommendationsInBD();
    const result = await supertest(app).get("/recommendations").send();
    expect(result.status).toEqual(200);
    expect(result.body.length).toEqual(3);
  });

  it("Teste sucesso: Retornar status 200 e nenhuma recomendação pois banco esta vazio", async () => {
    const result = await supertest(app).get("/recommendations").send();
    expect(result.status).toEqual(200);
    expect(result.body.length).toEqual(0);
  });
});

describe("Testes na rota GET /recommendations/:id", () => {
  it("Teste sucesso: Retornar status 200 e o objeto com mesmo id", async () => {
    const recommendation = recommendationsFactory();
    const { id } = await prisma.recommendation.create({
      data: recommendation,
    });
    const result = await supertest(app).get(`/recommendations/${id}`).send();
    expect(result.status).toEqual(200);
    expect(result.body.id).toEqual(id);
    expect(result.body.name).toEqual(recommendation.name);
    expect(result.body.youtubeLink).toEqual(recommendation.youtubeLink);
  });
  it("Teste erro: Retornar status 404", async () => {
    const id = 1;
    const result = await supertest(app).get(`/recommendations/${id}`).send();
    expect(result.status).toEqual(404);
    expect(result.body).toEqual({});
  });
});
