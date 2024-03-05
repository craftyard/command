import { InjectRepository } from '@nestjs/typeorm';
import { ModelNameAlreadyExistsError } from 'cy-domain/src/model/domain-data/model/add-model/s-params';
import { ModelAR } from 'cy-domain/src/model/domain-object/model/a-root';
import { ModelCmdRepository } from 'cy-domain/src/model/domain-object/model/cmd-repository';
import { Result } from 'rilata/src/common/result/types';
import { success } from 'rilata/src/common/result/success';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Repository } from 'typeorm';
import { failure } from 'rilata/src/common/result/failure';
import { Logger } from 'rilata/src/common/logger/logger';
import { ModelEntity } from './model.entity';

export class ModelCMDRepository implements ModelCmdRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(
        @InjectRepository(ModelEntity)
        private modelRepository: Repository<ModelEntity>,
        private logger: Logger,
  // eslint-disable-next-line no-empty-function
  ) {}

  async addModel(model: ModelAR): Promise<Result<ModelNameAlreadyExistsError, undefined>> {
    const models = model.getAttrs();
    const nameExist = await this.modelRepository.findOne(
      { where: { modelName: models.name } && { workshopId: models.workshopId } },
    );

    if (nameExist) {
      const err = `Имя модели ${models.name} уже существует в вашей мастерской`;
      this.logger.error(err);
      return failure({
        locale: {
          text: 'Имя модели {{modelName}} уже существует в вашей мастерской',
          hint: { modelName: models.name },
        },
        name: 'ModelNameAlreadyExistsError',
        meta: {
          domainType: 'error',
          errorType: 'domain-error',
        },
      });
    }

    const newModel = new ModelEntity();
    newModel.modelId = models.modelId;
    newModel.modelName = models.name;
    newModel.workshopId = models.workshopId;
    newModel.category = models.category;
    newModel.images = models.images;

    await this.modelRepository.save(newModel);

    return success(undefined);
  }
}
