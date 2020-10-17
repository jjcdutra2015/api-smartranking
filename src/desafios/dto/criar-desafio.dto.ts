import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from "class-validator";
import { Jogador } from "src/jogadores/intefaces/jogador.interface";

export class CriarDesafioDto {

    @IsNotEmpty()
    @IsDateString()
    dataHoraDesafio: Date;

    @IsNotEmpty()
    solicitante: Jogador;

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    jogadores: Array<Jogador>;
}