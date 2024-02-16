import { ModelCmdRepository } from 'cy-domain/src/model/cmd-repository';
import { ModelNameAlreadyExistsError } from 'cy-domain/src/model/domain-data/a-params';
import { ModelAR } from 'cy-domain/src/model/domain-object/a-root';
import { Result } from 'rilata/src/common/result/types';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { TestResolverMock } from 'rilata/tests/fixtures/test-resolver-mock';
import { Mock, spyOn } from 'bun:test';
import { ModelAttrs } from 'cy-domain/src/model/domain-data/params';

export class ModelRepoMock implements ModelCmdRepository {
  addModel(model: ModelAR): Promise<Result<ModelNameAlreadyExistsError, undefined>> {
    throw new Error('Method not implemented.');
  }
}

export const resolver: ModuleResolver = new TestResolverMock();

export const resolverGetRepoMock = spyOn(
  resolver,
  'commandRepository',
).mockReturnValue(new ModelRepoMock()) as Mock<(...args: unknown[]) => ModelRepoMock>;

export const model: (ModelAttrs) = {
  modelId: '977e597e-bce9-4b6e-b804-1f627da539f7',
  workshopId: 'a46f5705-2d5e-4de0-bf9d-fa573444100c',
  name: 'Мастерская у Набережной Чагана',
  category: 'Мебель',
};
