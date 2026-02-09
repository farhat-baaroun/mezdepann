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
      telephone: z.string().min(1, 'Le téléphone est requis'),
      email: z.string().email('Format d\'email invalide'),
      vehicule: z.string().min(1, 'Le type de véhicule est requis'),
      etat: z.string().min(1, 'L\'état du véhicule est requis'),
      message: z.string().optional(),
    }),
    handler: async ({ nom, telephone, email, vehicule, etat, message }) => {
      // Validate phone format (basic French phone validation)
      const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[.\s-]?[0-9]{2}){4}$/;
      const cleanPhone = telephone.replace(/[\s.-]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Format de téléphone invalide au format français (ex: 06 12 34 56 78) ou international (ex: +33 6 12 34 56 78)',
        });
      }

      try {
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
        // If it's already an ActionError, re-throw it
        if (error instanceof ActionError) {
          throw error;
        }
        // Otherwise, wrap it in an ActionError
        // Safely extract message without using instanceof Error
        const errorMessage = error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Une erreur est survenue lors de l\'envoi de votre demande';
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
        });
      }
    },
  }),
};

