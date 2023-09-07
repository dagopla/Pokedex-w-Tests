import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    // isString, Minlenth 1
    @IsString()
    @MinLength(1)
    name: string;

}
