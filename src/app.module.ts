import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmConfigService } from './config/typeorm.config';
import { BandModule } from './band/band.module';
import { AlbumModule } from './album/album.module';
import { SongModule } from './song/song.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    GraphQLModule.forRoot({
      playground: true,
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
    }),
    BandModule,
    AlbumModule,
    SongModule,
  ],
})
export class AppModule {}
