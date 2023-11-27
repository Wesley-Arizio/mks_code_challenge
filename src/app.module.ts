import { Module } from '@nestjs/common';
import { UserHttpModule } from './users-http.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), UserHttpModule, DatabaseModule],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
