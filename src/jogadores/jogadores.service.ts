import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './intefaces/jogador.interface';
import { v1 as uuid }  from 'uuid';

@Injectable()
export class JogadoresService {

    private jogadores: Jogador[] = []

    private readonly logger = new Logger(JogadoresService.name)

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
        const { email } = criarJogadorDto

        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email)

        if (jogadorEncontrado) {
            await this.atualizar(jogadorEncontrado, criarJogadorDto)
        } else {
            await this.criar(criarJogadorDto)
        }
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return this.jogadores
    }

    async consultarJogadorPeloEmail(email:string): Promise<Jogador> {
        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email)
        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com o e-mail ${email} não encontrato`)
        }
        return jogadorEncontrado
    }

    async deletarJogador(email: string): Promise<void> {
        const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email)
        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com o e-mail ${email} não encontrato`)
        }
        this.jogadores = this.jogadores.filter(jogador => jogador.email !== jogadorEncontrado.email)
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

    private atualizar(jogadorEncontrado: Jogador, criarJogadorDto: CriarJogadorDto): void {
        const { nome } = criarJogadorDto

        jogadorEncontrado.nome = nome
    }
}
