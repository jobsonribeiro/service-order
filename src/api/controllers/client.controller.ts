import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ClientService } from 'src/domain/use-cases/client.service';
import { Client } from 'src/domain/entities/client.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Post()
    create(@Body() client: Client): Promise<Client> {
        return this.clientService.create(client);
    }

    @Get()
    findAll(): Promise<Client[]> {
        return this.clientService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Client> {
        return this.clientService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() client: Client): Promise<void> {
        return this.clientService.update(id, client);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.clientService.remove(id);
    }
}
