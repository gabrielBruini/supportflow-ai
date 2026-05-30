import * as Joi from 'joi';

export interface TicketServiceEnv {
  port: number;
  database: {
    url: string;
  };
  rabbitmq: {
    url: string;
  };
}

export const configuration = (): TicketServiceEnv => ({
  port: parseInt(process.env.TICKET_SERVICE_PORT!),
  database: {
    url: process.env.DATABASE_URL!,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL!,
  },
});

export const validationSchema = Joi.object({
  TICKET_SERVICE_PORT: Joi.number().required(),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
  RABBITMQ_URL: Joi.string()
    .uri({ scheme: ['amqp', 'amqps'] })
    .required(),
});
