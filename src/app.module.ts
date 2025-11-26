import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { FormsModule } from './forms/forms.module';
import { AuthModule } from './auth/auth.module';
import { envs } from './config/configuration';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.database.host,
      port: envs.database.port,
      username: envs.database.username,
      password: envs.database.password,
      database: envs.database.name,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: envs.nodeEnv === 'development',
      maxQueryExecutionTime: 5000, // 5 segundos timeout
      extra: {
        max: 10, // connection pool limit
        ssl: envs.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: envs.rateLimit.ttl,
        limit: envs.rateLimit.limit,
      },
    ]),
    FormsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
