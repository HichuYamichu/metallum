import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { BandModule } from './band/band.module';
import { AlbumModule } from './album/album.module';
import { SongModule } from './song/song.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres' as 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'postgres'),
        password: configService.get('DATABASE_PASS', 'postgres'),
        database: configService.get('DATABASE_NAME', 'metallum'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: false
      })
    }),
    GraphQLModule.forRoot({
      playground: true,
      autoSchemaFile: true,
      debug: true
    }),
    BandModule,
    AlbumModule,
    SongModule,
    TasksModule
  ]
})
export class AppModule {}
