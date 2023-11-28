import { Module } from '@nestjs/common';
import { UserHttpModule } from './users-http.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesHttpModule } from './movies-http.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserHttpModule,
    DatabaseModule,
    MoviesHttpModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
