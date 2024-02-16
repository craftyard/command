import { Module } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'sqlite',
      database: 'path/to/database.sqlite',
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    },
  )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
