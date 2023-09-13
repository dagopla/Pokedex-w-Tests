import { Injectable } from '@nestjs/common';
import {  PokemonesResponse } from './pokemon-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { FetchAdapter } from './../common/adapters/fetch.adapter';


@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>,
    private readonly http: FetchAdapter,
  ) {}
  async executeSeed() {
    await this.pokemonModel.deleteMany({}); // delete all documents delete * from pokemon
    const responsePoke = await this.http.get<PokemonesResponse>('https://pokeapi.co/api/v2/pokemon?limit=700');
    // const newPokemons = [];
    // responsePoke.results.forEach( ({name, url}) => {
    //   const segments = url.split('/');
    //   const no= +segments[segments.length - 2];
    //   const pokemon = {
    //     name,
    //     no,
    //   };
    //   newPokemons.push(
    //     this.pokemonModel.create(pokemon),
    //   );

    //   console.log(pokemon);
    // });	
    // await Promise.all(newPokemons);
    const pokemonToInsert:{name:string,no:number}[] = responsePoke.results.map(({name, url}) => {
      const segments = url.split('/');
      const no= +segments[segments.length - 2];
      const pokemon = {
        name,
        no,
      };
      return pokemon;
    });
    await this.pokemonModel.insertMany(pokemonToInsert);

    return responsePoke.results;
  }
}
