import { PrismaClient } from '@generated/client/client';
import { Injectable, OnModuleInit } from '@nestjs/common';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    // Metodo que se ejecuta cuando el módulo se inicializa
    async onModuleInit() {
        await this.$connect();
    }

    // Metodo que se ejecuta cuando el módulo se destruye
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
