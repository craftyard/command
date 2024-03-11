import { InjectRepository } from '@nestjs/typeorm';
import { ModelNameAlreadyExistsError } from 'cy-domain/src/model/domain-data/model/add-model/s-params';
import { ModelAR } from 'cy-domain/src/model/domain-object/model/a-root';
import { ModelCmdRepository } from 'cy-domain/src/model/domain-object/model/cmd-repository';
import { Result } from 'rilata/src/common/result/types';
import { success } from 'rilata/src/common/result/success';
import { failure } from 'rilata/src/common/result/failure';
import { Logger } from 'rilata/src/common/logger/logger';
import { TypeormDatabase } from 'src/typeorm/database';
import { ModelEntity } from './model.entity';

export class ModelCMDRepository implements ModelCmdRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(
      @InjectRepository(ModelEntity)
      private typeormDatabase: TypeormDatabase,
      private logger: Logger,
  // eslint-disable-next-line no-empty-function
  ) {}

  async addModel(model: ModelAR): Promise<Result<ModelNameAlreadyExistsError, undefined>> {
    const models = model.getAttrs();
    const modelRepository = this.typeormDatabase.createEntityManager().getRepository(ModelEntity);

    const nameExist = await modelRepository.findOne({
      where: { workshopId: models.workshopId, modelName: models.name },
    });

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
    newModel.workshopId = models.workshopId;
    newModel.modelName = models.name;
    newModel.category = models.category;

    await modelRepository.save(newModel);

    return success(undefined);
  }
}
