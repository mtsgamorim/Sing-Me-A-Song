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
