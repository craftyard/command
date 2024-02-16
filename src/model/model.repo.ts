import { Logger } from 'rilata/src/common/logger/logger';
import { ModelCmdRepository } from 'cy-domain/src/model/cmd-repository';
import { ModelNameAlreadyExistsError } from 'cy-domain/src/model/domain-data/a-params';
import { ModelAR } from 'cy-domain/src/model/domain-object/a-root';
import { Result } from 'rilata/src/common/result/types';
import { ModelAttrs } from 'cy-domain/src/model/domain-data/params';
import { AssertionException } from 'rilata/src/common/exeptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { success } from 'rilata/src/common/result/success';
import { Model } from './model.entity';

// type ModelRecord = ModelAttrs & { version: number };
// private modelRecords: ModelRecord[];

export class ModelCMDRepository implements ModelCmdRepository {
  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    private logger: Logger,
  ) {}

  async addModel(model: ModelAR): Promise<Result<ModelNameAlreadyExistsError, undefined>> {
    const models = model.getAttrs();
    const nameExists = await this.modelRepository.findOne({ where: { modelName: models.name } });

    if (nameExists) {
      const errStr = `Имя модели ${models.name} уже существует в вашей мастерской`;
      this.logger.error(errStr);
      throw new AssertionException(errStr);
    }
    const newModel = new Model();
    newModel.modelId = models.modelId;
    newModel.workshopId = models.workshopId;
    newModel.modelName = models.name;
    newModel.category = models.category;

    await this.modelRepository.save(newModel);

    return success(undefined);
  }
}
