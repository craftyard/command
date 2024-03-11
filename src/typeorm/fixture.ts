/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import {
  Column, Entity, PrimaryColumn, PrimaryGeneratedColumn,
} from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { Database } from 'rilata/src/app/database/database';
import { TokenVerifier } from 'rilata/src/app/jwt/token-verifier.interface';
import { Module } from 'rilata/src/app/module/module';
import { Logger } from 'rilata/src/common/logger/logger';
import { DTO } from 'rilata/src/domain/dto';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { RunMode } from 'rilata/src/app/types';
// eslint-disable-next-line import/extensions
import { TypeormDatabase } from './database';

export namespace TypeormTestFixtures {
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

    @Entity()
    export class Event {
      @PrimaryGeneratedColumn('uuid')
        id!: string;

      @Column('simple-json')
        attrs!: string;
    }

    const dataSourceOptions: SqliteConnectionOptions = {
      type: 'sqlite',
      database: ':memory:',
      entities: [ModelEntity, Event],
    };

    const createModelTableSql = `CREATE TABLE IF NOT EXISTS model_entity (
      modelId UUID PRIMARY KEY,
      workshopId UUID,
      modelName TEXT UNIQUE,
      category TEXT NOT NULL,
      images TEXT UNIQUE
  );`;
    const createEventTableSql = `CREATE TABLE IF NOT EXISTS event (
      id TEXT PRIMARY KEY,
      attrs TEXT NOT NULL
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
        await queryRunner.manager.query(createEventTableSql);
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }
    }
  }
