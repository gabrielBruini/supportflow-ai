import * as Joi from 'joi';

export interface AuthServiceEnv {
  port: number;
  database: { url: string };
  jwt: { secret: string; expiresIn: string };
  redis: { host: string; port: number };
  rabbitmq: { url: string };
}

export const configuration = (): AuthServiceEnv => ({
  port: parseInt(process.env.AUTH_SERVICE_PORT!),
  database: { url: process.env.DATABASE_URL! },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN!,
  },
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
  },
  rabbitmq: { url: process.env.RABBITMQ_URL! },
});

export const validationSchema = Joi.object({
  AUTH_SERVICE_PORT: Joi.number().required(),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  RABBITMQ_URL: Joi.string()
    .uri({ scheme: ['amqp', 'amqps'] })
    .required(),
});
