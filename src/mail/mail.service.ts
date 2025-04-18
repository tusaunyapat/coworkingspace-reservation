import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'; // Import Nodemailer
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService, // Inject ConfigService to get JWT_SECRET and email settings
  ) {
    // Initialize the transporter with Gmail SMTP settings
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'), // Gmail email address
        pass: this.configService.get<string>('PASSWORD'), // Gmail app password or regular password
      },
    });
  }

  

  // Method to send reservation confirmation email
  async sendReservationConfirmationEmail(
    email: string,
    reservationDetails: {
      date: string;
      time: string;
      location: string;
      reservedAt: string;
    }, // Reservation details
  ) {
    const from = this.configService.get<string>('EMAIL_FROM'); // Sender email address

    // Email content
    const htmlContent = `
      <h1>Reservation Confirmation</h1>
      <p>Thank you for your reservation!</p>
      <p><strong>Date:</strong> ${reservationDetails.date}</p>
      <p><strong>Time:</strong> ${reservationDetails.time}</p>
      <p><strong>Location:</strong> ${reservationDetails.location}</p>
      <br>
      <p>You reserved at ${reservationDetails.reservedAt}</p>
      <p>If you have any questions, feel free to contact us.</p>
      <p>Best regards,</p>
      <p>We look forward to seeing you!</p>
    `;

    // Send the email
    await this.transporter.sendMail({
      from, // Sender's email
      to: email, // Recipient's email
      subject: 'Your Reservation is Confirmed', // Subject of the email
      html: htmlContent, // HTML content of the email
    });
  }
}
