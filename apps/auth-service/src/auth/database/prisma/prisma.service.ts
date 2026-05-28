import { PrismaClient } from '@auth-service/generated/prisma';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(config: ConfigService) {
    const pool = new Pool({
      connectionString: config.get<string>('database.url'),
    });
    const adapter = new PrismaPg(pool);
    super({ adapter, log: ['query', 'error', 'info', 'warn'] });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
