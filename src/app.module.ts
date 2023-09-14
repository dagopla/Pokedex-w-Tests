import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV||''}.env`,
      isGlobal: true,
      load:[EnvConfiguration]
    }),
    MongooseModule.forRoot(process.env.MONGO_URI,{
      dbName:'PkedexDb'
    }),

    PokemonModule,

    CommonModule,

    SeedModule,

  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {
}
