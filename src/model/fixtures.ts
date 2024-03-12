/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { Database } from 'rilata/src/app/database/database';
import { Module } from 'rilata/src/app/module/module';
import { RunMode } from 'rilata/src/app/types';
import { Logger } from 'rilata/src/common/logger/logger';
import { TypeormDatabase } from 'src/typeorm/database';
import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DTO } from 'rilata/src/domain/dto';
import { ConsoleLogger } from '@nestjs/common';
import { TokenVerifier } from 'rilata/src/app/jwt/token-verifier.interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ModelTypeormTestFixtures {
  export class ResolverMock implements ModuleResolver {
    getRealisation(...args: unknown[]): unknown {
      throw new Error('Method not implemented.');
    }

    getRunMode(): RunMode {
      return 'test';
    }

    init(module: Module): void {
      throw new Error('Method not implemented.');
    }

    getTokenVerifier(): TokenVerifier<DTO> {
      throw new Error('Method not implemented.');
    }

    getModule(): Module {
      throw new Error('Method not implemented.');
    }

    getLogger(): Logger {
      return new ConsoleLogger();
    }

    getRepository(...args: unknown[]): unknown {
      throw new Error('Method not implemented.');
    }

    getDatabase(): Database {
      throw new Error('Method not implemented.');
    }
  }

  @Entity()
  export class ModelEntity {
    @PrimaryColumn('uuid')
      modelId: string;

    @Column('uuid')
      workshopId: string;

    @Column({ unique: true })
      modelName: string;

    @Column()
      category: string;

    @Column()
      images: string;
  }

    const dataSourceOptions: SqliteConnectionOptions = {
      type: 'sqlite',
      database: ':memory:',
      entities: [ModelEntity],
    };

    const createModelTableSql = `CREATE TABLE IF NOT EXISTS model_entity (
      modelId UUID PRIMARY KEY,
      workshopId UUID,
      modelName TEXT UNIQUE,
      category TEXT NOT NULL,
      images TEXT UNIQUE
  );`;

    export class TestDatabase extends TypeormDatabase {
      constructor() {
        super(dataSourceOptions, new ResolverMock());
      }

      async init(): Promise<void> {
        await super.init();
        const queryRunner = this.createQueryRunner();
        await queryRunner.startTransaction();
        await queryRunner.manager.query(createModelTableSql);
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }
    }
}
