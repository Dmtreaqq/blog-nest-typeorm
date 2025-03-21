import { configDynamicModule } from './config-dynamic-module';
import { DynamicModule, Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { CommonConfig } from './common/common.config';
import { TestingModule } from './features/testing/testing.module';
import { UserPlatformModule } from './features/user-platform/user-platform.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPlatformConfig } from './features/user-platform/config/user-platform.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BlogPlatformModule } from './features/blog-platform/blog-platform.module';

// TODO: ADD HUSKY WITH ESLINT !

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (commonConfig: CommonConfig) => {
        console.log('Connecting to DB: ' + commonConfig.dbName);
        return {
          type: 'postgres',
          host: commonConfig.dbHost,
          port: commonConfig.dbPort,
          username: commonConfig.dbUser,
          password: commonConfig.dbPass,
          database: commonConfig.dbName,
          autoLoadEntities: true,
          synchronize: true,
          ssl: commonConfig.isDbSsl,
          logging: true,
        };
      },
      inject: [CommonConfig],
    }),
    UserPlatformModule,
    BlogPlatformModule,
    ThrottlerModule.forRootAsync({
      imports: [UserPlatformModule],
      inject: [UserPlatformConfig],
      useFactory: (userPlatformConfig: UserPlatformConfig) => {
        return [
          {
            ttl: userPlatformConfig.throttleTtl,
            limit: userPlatformConfig.throttleLimit,
          },
        ];
      },
    }),
    CommonModule,
    configDynamicModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static async forRoot(commonConfig: CommonConfig): Promise<DynamicModule> {
    const additionalModules: any[] = [];

    if (commonConfig.includeTestingModule) {
      console.log('Testing Module Included');
      additionalModules.push(TestingModule);
    }

    return {
      module: AppModule,
      imports: additionalModules,
    };
  }
}
