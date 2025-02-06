import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { appSetup } from '../../src/setup/app.setup';
import { deleteAllData } from './delete-all-data';
import { CommonConfig } from '../../src/common/common.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { UsersTestManager } from './users-test-manager';
import * as cookieParser from 'cookie-parser';
import { EmailService } from '../../src/features/communication/email.service';
import { EmailServiceMock } from '../mock/email-service.mock';
import { BlogsTestManager } from './blogs-test-manager';
import { PostsTestManager } from './posts-test-manager';

export const initSettings = async (
  //передаем callback, который получает ModuleBuilder, если хотим изменить настройку тестового модуля
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const commonConfig = appContext.get<CommonConfig>(CommonConfig);
  await appContext.close();
  const dynamicAppModule = await AppModule.forRoot(commonConfig);
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [dynamicAppModule],
  })
    .overrideProvider(EmailService)
    .useClass(EmailServiceMock);

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder);
  }

  const testingAppModule = await testingModuleBuilder.compile();

  const app = testingAppModule.createNestApplication();
  await appSetup(app, commonConfig);

  app.use(cookieParser());

  await app.init();

  const blogsTestManager = new BlogsTestManager(app);
  const postsTestManager = new PostsTestManager(app);
  const usersTestManager = new UsersTestManager(app);
  // const commentsTestManager = new CommentsTestManager(app);

  await deleteAllData(app);

  return {
    app,
    blogsTestManager,
    postsTestManager,
    usersTestManager,
    // commentsTestManager,
  };
};
