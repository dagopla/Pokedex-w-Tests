import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from './../common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>) { }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      
      createPokemonDto.name=createPokemonDto.name.toLowerCase();
      const pokemon =await this.pokemonModel.create(createPokemonDto);
      return pokemon ;
    } catch (error) {
      this.handleErrors(error);

    }
  }

  async findAll(pagination:PaginationDto) {
    const {limit=12,offset=0}=pagination;
    return await this.pokemonModel.find()
    .limit(limit)
    .skip(offset);
  }

  async findOne(id: string) {
    let pokemon:Pokemon;
    if (!isNaN(+id)) {
      pokemon=await this.pokemonModel.findOne({no:+id})
    }
    if(isValidObjectId(id)){
      pokemon= await this.pokemonModel.findById(id)
    }
    if(!pokemon){
      pokemon=await this.pokemonModel.findOne({name:id.toLowerCase().trim()})
    }
    if (!pokemon) {
      throw new NotFoundException(`Pokemon not found`);
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon =await this.findOne(term);
    if (!pokemon) {
      throw new NotFoundException(`Pokemon not found`);
    }
    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(),...updatePokemonDto}
    }
    catch (error) {
      this.handleErrors(error);
    }
  }

  async remove(id: string) {
    const {deletedCount}= await this.pokemonModel.deleteOne({_id:id});
    if(!deletedCount){
      throw new BadRequestException(`Pokemon not found`); 
    }
    return {deletedCount};
  }
  handleErrors(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException();
  }
}
