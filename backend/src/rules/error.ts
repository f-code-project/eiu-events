export class ErrorWithStatus extends Error {
  status: number;
  [key: string]: any;

  constructor({ message, status, ...rest }: { message: string; status: number; [key: string]: any }) {
    super(message);
    this.status = status;
    Object.assign(this, rest);
  }
}
