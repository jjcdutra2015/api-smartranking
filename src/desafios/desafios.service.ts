import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarDesafioDto } from './dto/atualizar-desafio.dto';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { DesafioStatus } from './interface/desafio-status.enum';
import { Desafio } from './interface/desafio.interface';

@Injectable()
export class DesafiosService {
    
    constructor(@InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
                private readonly jogadoresService: JogadoresService,
                private readonly categoriasService: CategoriasService) {}

    private readonly logger = new Logger(DesafiosService.name)

    async criar(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        const jogadores = await this.jogadoresService.consultarTodosJogadores()

        criarDesafioDto.jogadores.map(jogadorDto => {
            const jogadorFilter = jogadores.filter(jogador => jogador._id == jogadorDto._id)

            if (jogadorFilter.length == 0) {
                throw new BadRequestException(`O id ${jogadorDto._id} não é um jogador`)
            }
        })

        const solicitanteEhJogadorDaPartida = await criarDesafioDto.jogadores.filter(jogador => jogador._id == criarDesafioDto.solicitante)

        this.logger.log(`solicitanteEhJogadorDaPartida: ${JSON.stringify(solicitanteEhJogadorDaPartida)}`)

        if (solicitanteEhJogadorDaPartida.length == 0) {
            throw new BadRequestException('O solicitante deve ser um jogador da partida')
        }

        const categoriaDoJogador = await this.categoriasService.consultarCategoriaDoJogador(criarDesafioDto.solicitante)

        if (!categoriaDoJogador) {
            throw new BadRequestException('O solicitante precisa estar cadastrado em uma categoria')
        }

        const desafio = new this.desafioModel(criarDesafioDto)
        desafio.categoria = categoriaDoJogador.categoria
        desafio.dataHoraSolicitacao = new Date()
        desafio.status = DesafioStatus.PENDENTE
        this.logger.log(`desafioCriado: ${JSON.stringify(desafio)}`)
        return await desafio.save()
    }

    async consultarTodosDesafios(): Promise<Desafio[]> {
        return await this.desafioModel.find()
            .populate('jogadores')    
            .populate('solicitante')    
            .exec() 
    }

    async consultarDesafiosDeUmJogador(_id: any): Promise<Array<Desafio>> {
        const jogadores = await this.jogadoresService.consultarTodosJogadores()

        const jogador = jogadores.filter(jogador => jogador._id == _id)

        if (jogador.length == 0) {
            throw new BadRequestException(`Id ${_id} não é um jogador.`)
        }
        
        return await this.desafioModel.find().where('jogadores').in(_id)
                                             .populate('jogadores')
                                             .populate('solicitante')
                                             .exec()
    }

    async atualizarDesafio(_id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {
        const desafio = await this.desafioModel.findById(_id).exec()

        if (!desafio) {
            throw new NotFoundException(`Desafio id ${_id} não encontrado`)
        }

        if (atualizarDesafioDto.status) {
            desafio.dataHoraResposta = new Date()
        }

        desafio.status = atualizarDesafioDto.status
        desafio.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio

        await this.desafioModel.findOneAndUpdate({_id}, {$set: desafio}).exec()
    }

}
