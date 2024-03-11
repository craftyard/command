import {
  Column, Entity, PrimaryColumn,
} from 'typeorm';

@Entity()
export class ModelEntity {
  @PrimaryColumn('uuid')
    modelId!: string;

  @Column('uuid')
    workshopId!: string;

  @Column({ length: 100 })
    modelName!: string;

  @Column({ length: 100 })
    category!: string;
}
