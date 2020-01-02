import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmConfigService } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    GraphQLModule.forRoot({
      playground: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
    }),
  ],
})
export class AppModule {}
