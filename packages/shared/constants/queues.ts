export const EXCHANGES = {
  TICKET_EVENTS: 'ticket.events',
  AUTH_EVENTS: 'auth.events',
} as const;

export const QUEUES = {
  AUTH: 'auth_queue',
  TICKET: 'ticket_queue',
  AI: 'ai_queue',
  NOTIFICATION: 'notification_queue',
  NOTIFICATION_AUTH: 'notification_auth_queue',
} as const;
