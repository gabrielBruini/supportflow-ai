export const TICKET_PATTERNS = {
  CREATE: 'ticket.create',
  LIST: 'ticket.list',
  GET_BY_ID: 'ticket.getById',
  UPDATE_STATUS: 'ticket.updateStatus',
  ADD_MESSAGE: 'ticket.addMessage',
  GET_CONVERSATION: 'ticket.getConversation',
} as const;

export const TICKET_EVENTS = {
  CREATED: 'ticket.created',
  MESSAGE_CREATED: 'ticket.message.created',
  STATUS_UPDATED: 'ticket.status.updated',
} as const;
