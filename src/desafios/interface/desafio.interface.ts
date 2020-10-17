import { Document } from "mongoose";
import { Jogador } from "src/jogadores/intefaces/jogador.interface";
import { DesafioStatus } from './desafio-status.enum';

export interface Desafio extends Document {
    dataHoraDesafio: Date;
    status: DesafioStatus;
    dataHoraSolicitacao: Date;
    dataHoraResposta: Date;
    solicitante: Jogador;
    categoria: string;
    jogadores: Array<Jogador>
    partida: Partida;
}

export interface Partida extends Document {
    categoria: string;
    def: Jogador;
    resultado: Array<Resultado>;
    jogadores: Array<Jogador>;
}

export interface Resultado {
    set: string;
}