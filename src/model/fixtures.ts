import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { Database } from 'rilata/src/app/database/database';
import { Module } from 'rilata/src/app/module/module';
import { RunMode } from 'rilata/src/app/types';
import { Logger } from 'rilata/src/common/logger/logger';
import { ModelActionDOD } from 'cy-domain/src/model/domain-data/model/add-model/s-params';
import { TypeormTestFixtures } from 'src/typeorm/fixture';
import { TypeormDatabase } from 'src/typeorm/database';
import { ModelEntity } from './model.entity';

const dataSourceOptions: SqliteConnectionOptions = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [ModelEntity],
};

export const typeormDatabase = new TypeormDatabase(
  dataSourceOptions,
  new TypeormTestFixtures.ResolverMock(),
);

export const Model: ModelActionDOD = {
  meta: {
    name: 'addModel',
    actionId: '',
    domainType: 'action',
  },
  attrs: {
    name: 'Стол ЛИННМОН/АДИЛЬС 60х100 белый',
    category: 'Мебель',
    workshopId: 'a46f5705-2d5e-4de0-bf9d-fa573444100c',
  },
};

export const model = {
  modelId: '977e597e-bce9-4b6e-b804-1f627da539f7',
  workshopId: 'a46f5705-2d5e-4de0-bf9d-fa573444100c',
  name: 'Стол ЛИННМОН/АДИЛЬС 60х100 белый',
  category: 'Мебель',
  images: [],
};

export class ModuleResolverMock implements ModuleResolver {
  init(module: Module): void {
    throw new Error('Method not implemented.');
  }

  getRunMode(): RunMode {
    throw new Error('Method not implemented.');
  }

  getModule(): Module {
    throw new Error('Method not implemented.');
  }

  getLogger(): Logger {
    throw new Error('Method not implemented.');
  }

  getRepository(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }

  getDatabase(): Database {
    throw new Error('Method not implemented.');
  }

  getRealisation(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }
}
