import * as Joi from 'joi';

export interface GatewayEnv {
  port: number;
  rabbitmq: { url: string };
  jwt: { secret: string };
}

export const configuration = (): GatewayEnv => ({
  port: Number(process.env.PORT),
  rabbitmq: { url: process.env.RABBITMQ_URL! },
  jwt: { secret: process.env.JWT_SECRET! },
});

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  RABBITMQ_URL: Joi.string()
    .uri({ scheme: ['amqp', 'amqps'] })
    .required(),
  JWT_SECRET: Joi.string().min(32).required(),
});
