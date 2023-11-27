import { Module } from '@nestjs/common';
import { UserHttpModule } from './users-http.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UserHttpModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
