export class UserCreatedEvent {
  readonly eventType = 'user.created';
  readonly occurredAt: Date;

  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly email: string,
  ) {
    this.occurredAt = new Date();
  }
}
