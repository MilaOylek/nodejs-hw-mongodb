import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';
import createHttpError from 'http-errors';

const transport = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: getEnvVar(SMTP.SMTP_PORT),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
});

await transport.verify();

export const sendMail = async ({ to, subject, html }) => {
  try {
    await transport.sendMail({
      subject,
      to,
      html,
      from: getEnvVar(SMTP.SMTP_FROM),
    });
  } catch (err) {
    console.log(err);
    throw createHttpError(500, 'Failed to sent email');
  }
};
