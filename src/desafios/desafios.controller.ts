import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { AtualizarDesafioDto } from './dto/atualizar-desafio.dto';
import { Desafio } from './interface/desafio.interface';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validacao.pipe';
import { AtribuirDesafioPartidaDto } from './dto/atribuir-desafio-partida.dto';

@Controller('api/v1/desafios')
export class DesafiosController {

    constructor(private readonly desafiosService: DesafiosService) {}

    private readonly logger = new Logger(DesafiosController.name)

    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        this.logger.log(`criarDesafioDto: ${JSON.stringify(criarDesafioDto)}`)
        return await this.desafiosService.criar(criarDesafioDto)
    }

    @Get()
    async consultarTodosDesafios(@Query('idJogador') _id: string): Promise<Array<Desafio>> {
        return _id ? await this.desafiosService.consultarDesafiosDeUmJogador(_id) : await this.desafiosService.consultarTodosDesafios()
    }

    @Put('/:idDesafio')
    async atualizarDesafio(@Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto, @Param('idDesafio') _id: string): Promise<void> {
        await this.desafiosService.atualizarDesafio(_id, atualizarDesafioDto)
    }

    @Post('/:idDesafio/partida')
    async atribuirDesafioPartida(@Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto, @Param('idDesafio') _id: string): Promise<void> {
        await this.desafiosService.atribuirDesafioPartida(_id, atribuirDesafioPartidaDto)
    }

    @Delete('/:idDesafio')
    async deletarDesafio(@Param('idDesafio') _id: string): Promise<void> {
        await this.desafiosService.deletarDesafio(_id)
    }
}
