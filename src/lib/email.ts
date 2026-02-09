import { Resend } from 'resend';
interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private resend: Resend | null = null;
  private fromEmail: string;

  constructor() {
    this.fromEmail = import.meta.env.EMAIL_FROM ;
      const apiKey = import.meta.env.RESEND_API_KEY;
      if (!apiKey) {
        console.warn('RESEND_API_KEY not found, email sending will fail');
      } else {
        this.resend = new Resend(apiKey);
      }
  }

  async send(data: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
        if (!this.resend) {
          return {
            success: false,
            error: 'Resend client not initialized. Check RESEND_API_KEY.',
          };
        }

        const result = await this.resend.emails.send({
          from: this.fromEmail,
          to: [data.to],
          subject: data.subject,
          html: data.html,
          text: data.text,
        });

        if (result.error) {
          return {
            success: false,
            error: result.error.message || 'Failed to send email via Resend',
          };
        }

        return { success: true };
    } catch (error) {
      console.error('Email sending error:', error);
      // Safely extract error message without using instanceof Error
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : 'Unknown error occurred';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export const emailService = new EmailService();
