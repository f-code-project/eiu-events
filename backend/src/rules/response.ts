export class ResponseClient {
  status: boolean;
  message: string;
  [key: string]: any;

  constructor({
    status = true,
    message = 'Thao tác thành công!',
    ...rest
  }: {
    status?: boolean;
    message?: string;
    [key: string]: any;
  }) {
    this.status = status;
    this.message = message;
    Object.assign(this, rest);
  }
}
