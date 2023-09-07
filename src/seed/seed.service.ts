import { Injectable } from '@nestjs/common';
import {  PokemonesResponse } from './pokemon-response.interface';


@Injectable()
export class SeedService {

  async executeSeed() {
    const pokemons = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const responsePoke:PokemonesResponse= await pokemons.json();

    responsePoke.results.forEach( ({name, url}) => {
      const segments = url.split('/');
      const no= +segments[segments.length - 2];
      const pokemon = {
        name,
        no,
      };
      console.log(pokemon);
    });	
    return responsePoke.results;
  }
}
