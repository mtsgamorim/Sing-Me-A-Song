import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import {
  recommendationsBadScore,
  recommendationsFactory,
  recommendationsGoodScore,
} from "../factory/recommendationFactory.js";
import { conflictError, notFoundError } from "../../src/utils/errorUtils.js";
import { recommendationFactoryData } from "../factory/recommendationFactory.js";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("Testes da função insert", () => {
  it("Teste sucesso", async () => {
    const recommendation = recommendationsFactory();
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});
    await recommendationService.insert(recommendation);
    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  it("Teste erro, nome ja existente no banco", async () => {
    const recommendation = recommendationsFactory();
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => recommendation);
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    const result = recommendationService.insert(recommendation);
    expect(result).rejects.toEqual(
      conflictError("Recommendations names must be unique")
    );
  });
});

describe("Testes da função getById", () => {
  it("Teste sucesso", async () => {
    const recommendation = recommendationFactoryData();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => recommendation);
    const result = await recommendationService.getById(recommendation.id);
    expect(result).toEqual(recommendation);
  });

  it("Teste erro, não encontrou o id", async () => {
    const recommendation = recommendationFactoryData();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});
    const result = recommendationService.getById(recommendation.id);
    expect(result).rejects.toEqual(notFoundError());
  });
});

describe("Testes da função upvote", () => {
  it("Teste sucesso", async () => {
    const recommendation = recommendationFactoryData();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => recommendation);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => recommendation);
    await recommendationService.upvote(recommendation.id);
    expect(recommendationRepository.updateScore).toBeCalled();
  });
});

describe("Testes da função downvote", () => {
  it("Teste sucesso", async () => {
    const recommendation = recommendationFactoryData();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => recommendation);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => recommendation);
    await recommendationService.downvote(recommendation.id);
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Teste sucesso, porém score menor que -5", async () => {
    const recommendation = recommendationFactoryData();
    const recommendationUpdated = {
      id: recommendation.id,
      name: recommendation.name,
      youtubeLink: recommendation.youtubeLink,
      score: -6,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => recommendation);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => recommendationUpdated);
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(recommendation.id);
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe("Testes da função get", () => {
  it("Teste sucesso", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {});
    const result = await recommendationService.get();
    expect(recommendationRepository.findAll).toBeCalled();
  });
});

describe("Testes da função getTop", () => {
  it("Teste sucesso", async () => {
    const amount = 1;
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {});
    const result = await recommendationService.getTop(amount);
    expect(recommendationRepository.getAmountByScore).toBeCalled();
  });
});

describe("Testes da função getRandom", () => {
  it("Teste sucesso: Retornar scores altos", async () => {
    const recommendations = recommendationsGoodScore();
    const random = 0.5;

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => recommendations);
    jest.spyOn(global.Math, "random").mockImplementationOnce((): any => random);

    const result = await recommendationService.getRandom();
    expect(result).not.toBe(null);
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
  });

  it("Teste sucesso, Retornar scores baixos", async () => {
    const recommendation = recommendationsBadScore();
    const random = 0.8;

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => recommendation);
    jest.spyOn(global.Math, "random").mockImplementationOnce((): any => random);

    const result = await recommendationService.getRandom();
    expect(result).not.toBe(null);
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
  });

  it("Teste sucoess, Retornar recomendação qualquer", async () => {
    const recommendation = recommendationsBadScore();
    const random = 0.5;
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => []);

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => recommendation);

    jest.spyOn(global.Math, "random").mockImplementationOnce((): any => random);

    const result = await recommendationService.getRandom();

    expect(result).not.toBe(null);
    expect(recommendationRepository.findAll).toBeCalledTimes(2);
  });

  it("Caso erro, não existe recomendações", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => []);
    const result = recommendationService.getRandom();

    await expect(result).rejects.toEqual(notFoundError());
    expect(recommendationRepository.findAll).toBeCalledTimes(2);
  });
});
