import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 자바스크립트 css 파일 서빙
  app.useStaticAssets(join(__dirname, '..', 'public')); // src의 상위폴더의 public 폴더
  // 템플릿 엔진을 어디 폴더에 둘 것인지
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // 어떤 템플릿 엔진을 사용할 것인지
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
