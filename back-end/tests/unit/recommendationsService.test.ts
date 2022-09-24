import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationsFactory } from "../factory/recommendationFactory.js";
import { conflictError, notFoundError } from "../../src/utils/errorUtils.js";
import { recommendationFactoryData } from "../factory/recommendationFactory.js";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("Teste da função insert", () => {
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

describe("Teste da função getById", () => {
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

describe("Teste da função upvote", () => {
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

describe("Teste da função downvote", () => {
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
