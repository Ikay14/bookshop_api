import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { client, initializeDatabase,  } from './config/db.config'
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/global-interceptor';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs'; 

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    bufferLogs: true,
    logger: new ConsoleLogger({
    prefix: 'BookShop_API',
    logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
  }),
  })

  // Serve Swagger
  const config = new DocumentBuilder()
   .setTitle('Book API')
   .setDescription('The API documentation')
   .setVersion('1.0')   
   .addBearerAuth()
   .build();  

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2)); 


  // Initialize the database connection
  try {
  await initializeDatabase()
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1); 
  }

  try {
    await client.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }


  app.useGlobalPipes(new ValidationPipe({transform: true}))

  app.enable('trust proxy');

  app.setGlobalPrefix('api/v1', { exclude : ['api', 'api/v1', 'api/docs'] });

  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = app.get<ConfigService>(ConfigService).get<number>('server.port') ?? 3002;

  await app.listen(port); 
  console.log(`Swagger is running at http://localhost:${port}/api/docs`);
  console.log({ message: 'server started!', port, url: `http://localhost:${port}/api/v1` });


}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1); 
});
