import { Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './intefaces/jogador.interface';
import { v1 as uuid }  from 'uuid';

@Injectable()
export class JogadoresService {

    private jogadores: Jogador[] = []

    private readonly logger = new Logger(JogadoresService.name)

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
        this.criar(criarJogadorDto)
    }

    private criar(criarJogadorDto: CriarJogadorDto): void {
        const { nome, email, telefoneCelular } = criarJogadorDto

        const jogador: Jogador = {
            _id: uuid(),
            nome,
            email,
            telefoneCelular,
            ranking: 'A',
            posicaoRanking: 1,
            urlFotoJogador: 'www.google.com/foto123.jpg'
        }
        this.logger.log(`criarJogadorDto: ${JSON.stringify(jogador)}`)

        this.jogadores.push(jogador)
    }
}
