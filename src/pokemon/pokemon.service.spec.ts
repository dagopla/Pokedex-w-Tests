import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { Connection, Model } from 'mongoose';
import { PaginationDto } from './../common/dto/pagination.dto';
import exp from 'constants';


describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let mockPokemonModel: Model<Pokemon>;
  let selectQb;
  let limitQb;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: getModelToken(Pokemon.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockReturnValue(selectQb),

          },
        },
      ],
    }).compile();

    pokemonService = module.get<PokemonService>(PokemonService);
    mockPokemonModel = module.get<Model<Pokemon>>(getModelToken(Pokemon.name));

    selectQb = {
      limit: jest.fn().mockReturnValue(limitQb),
      skip: jest.fn(),
      exec: jest.fn(),
    };
    limitQb = {
      skip: jest.fn(),
      exec: jest.fn(),
    };
  });

  describe('create', () => {
    it('should create a new pokemon', async () => {
      const createPokemonDto: CreatePokemonDto = {
        name: 'Pikachu',
        no: 25,
      };

      const createdPokemon = {
        _id: 'some-id',
        __v: 'some-value',
        ...createPokemonDto,
      };

      mockPokemonModel.create = jest.fn().mockResolvedValue(createdPokemon);

      const result = await pokemonService.create(createPokemonDto);

      expect(result).toEqual(createdPokemon);
    });

    it('should handle errors and throw exceptions', async () => {
      const createPokemonDto: CreatePokemonDto = {
        name: 'Pikachu',
        no: 25,
      };

      const mockError = new Error('Some error message');
      mockPokemonModel.create = jest.fn().mockRejectedValue(mockError);

      try {
        await pokemonService.create(createPokemonDto);
        // The line above should throw an error and not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Internal Server Error');
      }
    });
  });
  describe('findAll', () => {
    it('should return an array of pokemon', async () => {
      const pokemons = [
        {
          _id: 'some-id',
          __v: 'some-value',
          name: 'Pikachu',
          no: 25,
        },
      ];

      const pagination: PaginationDto = {
        limit: 10,
        offset: 0,
      }

      mockPokemonModel.find = jest.fn().mockReturnValue(selectQb);
      selectQb.limit = jest.fn().mockReturnValue(limitQb);
      limitQb.skip = jest.fn().mockResolvedValue(pokemons);
      const result=pokemonService.findAll(pagination);
      expect(result).resolves.toEqual(pokemons);
      expect(mockPokemonModel.find).toBeCalledTimes(1); 
      expect(selectQb.limit).toBeCalledTimes(1);
      expect(limitQb.skip).toBeCalledTimes(1);
      expect(limitQb.skip).toBeCalledWith(0);
      expect(selectQb.limit).toBeCalledWith(10);
 
    });
  });
  describe('findOne', () => {
    it('should return a pokemon', async () => {
      const pokemon = {
        _id: 'some-id',
        __v: 'some-value',
        name: 'Pikachu',
        no: 25,
      };

      const id = 'some-id';

      mockPokemonModel.findOne = jest.fn().mockResolvedValue(pokemon);

      const result =  pokemonService.findOne(id);

      expect(result).resolves.toEqual(pokemon);
    });
    it('should return a throwError not found', async () => {
      const pokemon = {
        _id: 'some-id',
        __v: 'some-value',
        name: 'Pikachu',
        no: 25,
      };
      mockPokemonModel.findOne = jest.fn().mockResolvedValue(null);
      try {
        await pokemonService.findOne('2');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Pokemon not found'); 
      }
    });

  });
});
