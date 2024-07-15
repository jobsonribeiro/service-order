import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private clientRepository: Repository<Client>,
    ) { }

    create(client: Client): Promise<Client> {
        return this.clientRepository.save(client);
    }

    findAll(): Promise<Client[]> {
        return this.clientRepository.find();
    }

    findOne(id: number): Promise<Client> {
        return this.clientRepository.findOneBy({ id: id });
    }

    async update(id: number, client: Client): Promise<void> {
        await this.clientRepository.update(id, client);
    }

    async remove(id: number): Promise<void> {
        await this.clientRepository.delete(id);
    }
}
