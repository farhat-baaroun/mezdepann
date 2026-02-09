import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { emailService } from './lib/email';
import ContactEmail from './emails/ContactEmail';
import ClientConfirmationEmail from './emails/ClientConfirmationEmail';
import { render } from '@react-email/render';
import { SITE } from './config/site';

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      nom: z.string().min(1, 'Le nom est requis'),
      telephone: z.string()
        .min(1, 'Le téléphone est requis')
        .refine(
          (val) => {
            const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[.\s-]?[0-9]{2}){4}$/;
            const cleanPhone = val.replace(/[\s.-]/g, '');
            return phoneRegex.test(cleanPhone);
          },
          {
            message: 'Format de téléphone invalide au format français (ex: 06 12 34 56 78) ou international (ex: +33 6 12 34 56 78)',
          }
        ),
      email: z.string().email('Format d\'email invalide'),
      vehicule: z.string().min(1, 'Le type de véhicule est requis'),
      etat: z.string().min(1, 'L\'état du véhicule est requis'),
      message: z.string().optional(),
    }),
    handler: async ({ nom, telephone, email, vehicule, etat, message }) => {
      try {
        // Phone validation is now handled by Zod schema above
        // Generate admin email content
        const adminEmailContent = ContactEmail({
          nom,
          telephone,
          email,
          vehicule,
          etat,
          message: message || '',
        });

        const adminHtml = await render(adminEmailContent);
        const adminText = await render(adminEmailContent, { plainText: true });

        // Generate client confirmation email content
        const clientEmailContent = ClientConfirmationEmail({
          nom,
        });

        const clientHtml = await render(clientEmailContent);
        const clientText = await render(clientEmailContent, { plainText: true });

        // Send admin email
        const recipientEmail = import.meta.env.EMAIL_TO || SITE.email;
        const adminResult = await emailService.send({
          to: recipientEmail,
          subject: `Nouvelle demande de contact - ${nom}`,
          html: adminHtml,
          text: adminText,
        });

        if (!adminResult.success) {
          console.error('Failed to send admin email:', adminResult.error);
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Une erreur est survenue lors de l\'envoi de votre demande',
          });
        }

        // Send client confirmation email
        const clientResult = await emailService.send({
          to: email,
          subject: 'Confirmation de réception - MezDepann',
          html: clientHtml,
          text: clientText,
        });

        if (!clientResult.success) {
          console.error('Failed to send client confirmation email:', clientResult.error);
          // Don't throw error here - admin email was sent successfully
          // Just log the issue
        }

        // Log for development
        console.log('Form submission received and email sent:', {
          nom,
          telephone,
          email,
          vehicule,
          etat,
          message: message || '',
        });

        return {
          success: true,
          message: 'Votre demande a été envoyée avec succès',
        };
      } catch (error) {
        console.error('Error processing form submission:', error);
        
        // Always create a new ActionError with a plain string message
        // This ensures proper serialization without instanceof issues
        let errorMessage = 'Une erreur est survenue lors de l\'envoi de votre demande';
        
        // Safely extract error message without any instanceof checks
        if (error) {
          if (typeof error === 'string') {
            errorMessage = error;
          } else if (typeof error === 'object' && error !== null) {
            // Check for message property directly
            if ('message' in error) {
              const msg = error.message;
              if (typeof msg === 'string') {
                errorMessage = msg;
              } else {
                errorMessage = String(msg);
              }
            } else {
              // Fallback to string conversion
              errorMessage = String(error);
            }
          } else {
            errorMessage = String(error);
          }
        }
        
        // Always create a fresh ActionError to avoid serialization issues
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
        });
      }
    },
  }),
};

