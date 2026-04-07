import { Injectable } from '@nestjs/common';
import { resetPasswordTemplate } from './templates/reset-password.template';
import sgMail from '@sendgrid/mail';
import globalEnv from '@repo/env';
import { from } from 'rxjs';
import { defaultPasswordTemplate } from './templates/default-password.template';

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(globalEnv.SGMAIL_TOKEN);
  }

  async sendResetPassword(email: string, name: string, code: string) {
    const msg = {
      to: email,
      from: 'equipo14webapp@gmail.com',
      subject: 'CMS - EdTech | Password Reset Verification Code',
      html: resetPasswordTemplate(name, code),
    };

    await sgMail.send(msg);
  }

  async sendNewPassword(email: string, newPassword) {
    const msg = {
      to: email,
      from: 'equipo14webapp@gmail.com',
      subject: 'CMS - EdTech | New password Assigned',
      html: defaultPasswordTemplate(newPassword),
    };

    await sgMail.send(msg);
  }
}
