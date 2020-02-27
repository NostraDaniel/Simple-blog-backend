import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as nodemailer from 'nodemailer';
import { IMailerTransporter } from '../core/interfaces/mailer-transporter.interface';

@Injectable()
export class FeedbackService {

  private readonly transporterConf: IMailerTransporter;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.transporterConf = {
      host: this.configService.mailHost,
      port: this.configService.mailPort,
      secure: this.configService.mailSecure,
      auth: {
        user: this.configService.mailUser,
        pass: this.configService.mailPass
      }
    };
  }

  async sendMail(feedback) {
    // create reusable transporter object using the default SMTP transport
    const { name, email, topic, message } = feedback;
    const transporter = nodemailer.createTransport(this.transporterConf);

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `${name} <${email}>`, // sender address
      to: "danieltv@abv.bg",
      subject: topic, // Subject line
      text: message, // plain text body
    });

    return { success: true };
  }
}
