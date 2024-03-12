import {
  describe,
  expect,
  test,
} from 'bun:test';
import { AddModelDomainCommand } from 'cy-domain/src/model/domain-data/model/add-model/a-params';
import { DomainUser } from 'rilata/src/app/caller';
import { ModelFactory } from 'cy-domain/src/model/domain-object/model/factory';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { ModelCMDRepository } from '../../src/model/model.repo';
import { ModelEntity } from '../../src/model/model.entity';
import { ModelTypeormTestFixtures as fixtures } from '../model/fixtures';

const modelCmdRepo = new ModelCMDRepository(fixtures.typeormDatabase, new ConsoleLogger());
// let globalUnitOfWorkId: string;
// modelCmdRepo = new ModelCMDRepository(typeormDatabase, new ConsoleLogger());

// beforeAll(async () => {
//   await typeormDatabase.init();
//   modelCmdRepo = new ModelCMDRepository(typeormDatabase, new ConsoleLogger());
// });

// beforeEach(async () => {
//   globalUnitOfWorkId = await typeormDatabase.startTransaction();
//   const alsMock = {
//     run<F, Fargs extends unknown[]>(store: T, fn: (...args: Fargs) => F, ...args: Fargs): F {
//       throw new Error();
//     },
//     getStore(): StorePayload {
//       return {
//         actionId: crypto.randomUUID(),
//         moduleResolver: new ModuleResolverMock(),
//         caller: {
//           type: 'ModuleCaller',
//           name: 'SubjectModule',
//           user: {
//             type: 'AnonymousUser',
//           },
//         },
//         unitOfWorkId: globalUnitOfWorkId,
//       };
//     },
//   };
//   storeDispatcher.setThreadStore(alsMock);
// });

// afterEach(async () => {
//   await typeormDatabase.rollback(globalUnitOfWorkId);
//   globalUnitOfWorkId = undefined;
// });
console.log('Hello');

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

const modelAr = new ModelFactory(new ConsoleLogger()).create(user, modelCmd, actionid);

describe('ModelCMDRepository tests', () => {
  console.log('Hello1');
  describe('Тесты при добавлении модели', () => {
    console.log('Hello2');
    test('success, модель успешно добавлен', async () => {
      console.log('Hello3');
      await modelCmdRepo.addModel(modelAr);
      const modelEntity = await fixtures.typeormDatabase.createEntityManager()
        .find(ModelEntity, { where: { modelName: 'Стол ЛИННМОН/АДИЛЬС 60х100 белый' } && { workshopId: 'a46f5705-2d5e-4de0-bf9d-fa573444100c' } });
      expect(modelEntity.length).toBe(1);
    });
  });
});
