import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Model {
  @PrimaryColumn('uuid')
    modelId: string;

  @Column('uuid')
    workshopId: string;

  @Column({ length: 100 })
    modelName: string;

  @Column({ length: 50 })
    category: string;
}
