import { Injectable } from '@nestjs/common';
import { resetPasswordTemplate } from './templates/reset-password.template';
import sgMail from "@sendgrid/mail"
import globalEnv from '@repo/env';

@Injectable()
export class MailService {

    constructor(){
        sgMail.setApiKey(globalEnv.SGMAIL_TOKEN)
    }

    async sendResetPassword(email: string, name: string, code: string) {
        const msg = {
            to: email,
            from: "equipo14webapp@gmail.com",
            subject: "CMS - EdTech | Password Reset Verification Code",
            html: resetPasswordTemplate(name, code),
        };

        await sgMail.send(msg);
    }

}
