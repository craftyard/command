import { Logger } from '@nestjs/common';
import { ModelActionDOD } from 'cy-domain/src/model/domain-data/model/add-model/s-params';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { StorePayload } from 'rilata/src/app/async-store/types';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { TypeormDatabase } from 'src/infra/typeorm/database';
import { ModuleResolverMock, typeormDatabase } from 'src/model/fixtures';
import { ModelEntity } from 'src/model/model.entity';
import { ModelCMDRepository } from 'src/model/model.repo';
import { DataSource, Repository } from 'typeorm';

let eventRepo: ModelCMDRepository;
let globalUnitOfWorkId: any;

beforeAll(async () => {
  await typeormDatabase.init();
  eventRepo = new ModelCMDRepository(typeormDatabase, new ConsoleLogger());
});

beforeEach(async () => {
  globalUnitOfWorkId = await typeormDatabase.startTransaction();
  const alsMock = {
    run<F, Fargs extends unknown[]>(store: T, fn: (...args: Fargs) => F, ...args: Fargs): F {
      throw new Error();
    },
    getStore(): StorePayload {
      return {
        actionId: crypto.randomUUID(),
        moduleResolver: new ModuleResolverMock(),
        caller: {
          type: 'ModuleCaller',
          name: 'ModelModule',
          user: {
            type: 'AnonymousUser',
          },
        },
        unitOfWorkId: globalUnitOfWorkId,
      };
    },
  };
  storeDispatcher.setThreadStore(alsMock);
});

afterEach(async () => {
  await typeormDatabase.rollback(globalUnitOfWorkId);
  globalUnitOfWorkId = undefined;
});

export const model = {
  modelId: '977e597e-bce9-4b6e-b804-1f627da539f7',
  workshopId: 'a46f5705-2d5e-4de0-bf9d-fa573444100c',
  name: 'Стол ЛИННМОН/АДИЛЬС 60х100 белый',
  category: 'Мебель',
  images: [],
};

export const inputOptions : ModelActionDOD = {
  meta: {
    name: 'addModel',
    actionId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d4444',
    domainType: 'action',
  },
  attrs: {
    name: 'Стол 60х100 белый',
    category: 'Мебель',
    workshopId: 'a46f5705-2d5e-4de0-bf9d-fa573444100c',
  },
};

const logger = new ConsoleLogger();

const sut = new ModelCMDRepository(, logger);
sut.addModel(inputOptions);

describe('ModelCMDRepository tests', () => {
  describe('Тесты при добавлении модели', () => {
    test('success, модель успешно добавлен', async () => {

    });
  });
});
