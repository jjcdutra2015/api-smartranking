import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { Jogador } from './intefaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    private readonly logger = new Logger(JogadoresService.name)

    async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const { email } = criarJogadorDto

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec()

        if (jogadorEncontrado) {
            throw new BadRequestException(`Jogador com e-mail ${email} já cadastrado`)
        }

        const jogador = new this.jogadorModel(criarJogadorDto)
        return await jogador.save()
    }

    async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {
        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec()

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`)
        }
        // this.jogadorEncontrado(_id)

        await this.jogadorModel.findOneAndUpdate({_id}, {$set: atualizarJogadorDto}).exec()
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec()
    }

    async consultarJogadorPeloId(_id: string): Promise<Jogador> {
        const jogador = await this.jogadorModel.findOne({ _id }).exec()
        if (!jogador) {
            throw new NotFoundException(`Jogador com o id ${_id} não encontrato`)
        }

        // this.jogadorEncontrado(_id)

        return jogador
    }

    async deletarJogador(_id: string): Promise<any> {
        // const jogadorEncontrado = await this.jogadorModel.findById({ _id })
        // if (!jogadorEncontrado) {
        //     throw new NotFoundException(`Jogador com o id ${_id} não encontrato`)
        // }

        this.jogadorEncontrado(_id)

        return await this.jogadorModel.deleteOne({ _id }).exec()
    }

    private async jogadorEncontrado(_id: string) {
        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec()
        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com o id ${_id} não encontrato`)
        }
    }
}
