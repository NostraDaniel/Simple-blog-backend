export interface IMailerTransporter {
  host: string,
  port: number,
  secure: boolean,
  auth: {
    user: string,
    pass: string
  }
}
