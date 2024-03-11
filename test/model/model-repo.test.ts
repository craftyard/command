import { AddModelDomainCommand } from 'cy-domain/src/model/domain-data/model/add-model/a-params';
import { ModelFactory } from 'cy-domain/src/model/domain-object/model/factory';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { StorePayload } from 'rilata/src/app/async-store/types';
import { DomainUser } from 'rilata/src/app/caller';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { ModuleResolverMock, typeormDatabase } from 'src/model/fixtures';
import { ModelEntity } from 'src/model/model.entity';
import { ModelCMDRepository } from 'src/model/model.repo';

let modelCmdRepo: ModelCMDRepository;
let globalUnitOfWorkId: string;
const logger = new ConsoleLogger();

beforeAll(async () => {
  await typeormDatabase.init();
  modelCmdRepo = new ModelCMDRepository(typeormDatabase, logger);
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

const user: DomainUser = {
  type: 'DomainUser',
  userId: 'user5705-2d5e-4de0-bf9d-fa573444100c',
};

const modelCmd: AddModelDomainCommand = {
  name: 'Стол ЛИННМОН/АДИЛЬС 60х100 белый',
  category: 'Мебель',
  workshopId: 'a46f5705-2d5e-4de0-bf9d-fa573444100c',
  images: [],
};

const actionid = '977e597e-bce9-4b6e-b804-1f627da539f7';

const modelFactory = new ModelFactory(logger);
const modelAr = modelFactory.create(user, modelCmd, actionid);

describe('ModelCMDRepository tests', () => {
  describe('Тесты при добавлении модели', () => {
    test('success, модель успешно добавлен', async () => {
      await modelCmdRepo.addModel(modelAr);
      const modelEntity = await typeormDatabase.createEntityManager()
        .find(ModelEntity, { where: { modelName: 'Стол ЛИННМОН/АДИЛЬС 60х100 белый' } && { workshopId: 'a46f5705-2d5e-4de0-bf9d-fa573444100c' } });
      expect(modelEntity.length).toBe(1);
    });
  });
});
