import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3045, () => {
    console.log('Server started at port: ', 3045);
  });
}
bootstrap();
