/* eslint-disable max-classes-per-file */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
} from 'bun:test';
import { TypeormTestFixtures as TestFixtures } from './fixture';

describe('тесты проверяющие работу транзакции бд typeorm', async () => {
  let globalUnitOfWorkId: string;
  const sut = new TestFixtures.TestDatabase();
  await sut.init();

  beforeEach(async () => {
    globalUnitOfWorkId = await sut.startTransaction();
  });

  afterEach(async () => {
    await sut.rollback(globalUnitOfWorkId);
  });

  describe('проверка работы вложенных транзакции', () => {
    test('успех, запись в одной таблице', async () => {
      const unitOfWorkId = await sut.startTransaction();
      const model = new TestFixtures.ModelEntity();
      model.modelName = 'Стол 90х100';
      model.category = 'Кухонная утварь';
      model.workshopId = 'a46f5705-2d5e-4de0-bf9d-fa573444100c';
      await sut.getEntityManager(unitOfWorkId).save(model);
      await sut.commit(unitOfWorkId);

      const expectModels = await sut.createEntityManager().find(TestFixtures.ModelEntity);
      expect(expectModels.length).toBe(1);
      expect(expectModels[0].modelName).toBe('Стол 90х100');
      expect(expectModels[0].category).toBe('Кухонная утварь');
      expect(expectModels[0].workshopId).toBe('a46f5705-2d5e-4de0-bf9d-fa573444100c');
    });

    test('успех, запись в двух таблицах', async () => {
      const unitOfWorkId = await sut.startTransaction();
      const entityManager = sut.getEntityManager(unitOfWorkId);

      const model = new TestFixtures.ModelEntity();
      model.modelName = 'Стол 90х100';
      model.category = 'Кухонная утварь';
      model.workshopId = 'a46f5705-2d5e-4de0-bf9d-fa573444100c';
      await entityManager.save(model);

      const event = new TestFixtures.Event();
      event.attrs = JSON.stringify({ modelName: 'Стол 90х100', category: 'Кухонная утварь', workshopId: 'a46f5705-2d5e-4de0-bf9d-fa573444100c' });
      await entityManager.save(event);

      await sut.commit(unitOfWorkId);

      const expectModels = await sut.createEntityManager().find(TestFixtures.ModelEntity);
      expect(expectModels.length).toBe(1);
      expect(expectModels[0].modelName).toBe('Стол 90х100');
      expect(expectModels[0].category).toBe('Кухонная утварь');
      expect(expectModels[0].workshopId).toBe('a46f5705-2d5e-4de0-bf9d-fa573444100c');

      const expectEvent = await sut.createEntityManager().find(TestFixtures.Event);
      expect(expectEvent.length).toBe(1);
      expect(typeof expectEvent[0].id).toBe('string');
      expect(expectEvent[0].attrs).toEqual(JSON.stringify(
        { modelName: 'Стол 90х100', category: 'Кухонная утварь', workshopId: 'a46f5705-2d5e-4de0-bf9d-fa573444100c' },
      ));
    });

    test('провал, первый записался, второй вызвал исключение, в итоге ничего не записалось', async () => {
      const unitOfWorkId = await sut.startTransaction();
      const entityManager = sut.getEntityManager(unitOfWorkId);

      const model = new TestFixtures.ModelEntity();
      model.modelName = 'Стол 90х100';
      model.category = 'Кухонная утварь';
      model.workshopId = 'a46f5705-2d5e-4de0-bf9d-fa573444100c';
      await entityManager.save(model);

      const expectModels = await sut.createEntityManager().find(TestFixtures.ModelEntity);
      expect(expectModels.length).toBe(1);

      const event = new TestFixtures.Event();
      try {
        await entityManager.save(event);
        expect(true).toBe(false);
      } catch (e) {
        await sut.rollback(unitOfWorkId);
        expect(String(e)).toBe(
          'QueryFailedError: SQLITE_CONSTRAINT: NOT NULL constraint failed: event.attrs',
        );
        expect(sut.errToExceptionDescription(e as Error)).toEqual({
          type: 'not null',
          table: 'event',
          column: 'attrs',
        });
      }

      const expectEmptyModels = await sut.createEntityManager().find(TestFixtures.ModelEntity);
      expect(expectEmptyModels.length).toBe(0);

      const expectEvent = await sut.createEntityManager().find(TestFixtures.Event);
      expect(expectEvent.length).toBe(0);
    });
  });

  describe('проверка получения объектов ошибок', () => {
    test('ошибка нарушения уникальности поля', async () => {
      const unitOfWorkId = await sut.startTransaction();
      const entityManager = sut.getEntityManager(unitOfWorkId);

      const model = new TestFixtures.ModelEntity();
      model.modelName = 'Стол 90х100';
      model.category = 'Кухонная утварь';
      model.workshopId = 'a46f5705-2d5e-4de0-bf9d-fa573444100c';
      await entityManager.save(model);

      const model2 = new TestFixtures.ModelEntity();
      model2.modelName = 'Стол 90х100';
      model2.category = 'Для детской комнаты';
      model2.workshopId = 'a46f5705-2d5e-4de0-bf9d-fa573444100c';

      try {
        await entityManager.save(model2);
        expect(true).toBe(false);
      } catch (e) {
        await sut.rollback(unitOfWorkId);
        expect(String(e)).toBe(
          'QueryFailedError: SQLITE_CONSTRAINT: UNIQUE constraint failed: model_entity.modelName',
        );
        expect(sut.errToExceptionDescription(e as Error)).toEqual({
          type: 'unique',
          table: 'model_entity',
          column: 'modelName',
        });
      }
    });
  });
});
