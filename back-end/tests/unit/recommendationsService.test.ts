import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationsFactory } from "../factory/recommendationFactory.js";
import { conflictError } from "../../src/utils/errorUtils.js";

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
