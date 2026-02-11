import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { emailService } from './lib/email';
import ContactEmail from './emails/ContactEmail';
import ClientConfirmationEmail from './emails/ClientConfirmationEmail';
import { render } from '@react-email/render';
import { SITE } from './config/site';

// Phone regex for French format - validation moved to handler to avoid ZodEffects/formDataToObject issues
const PHONE_REGEX = /^(?:(?:\+|00)33|0)[1-9](?:[.\s-]?[0-9]{2}){4}$/;
function isValidFrenchPhone(val: string): boolean {
  const clean = val.replace(/[\s.-]/g, '');
  return PHONE_REGEX.test(clean);
}

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
      try {
        // Phone validation in handler (Zod .refine() can cause formDataToObject instanceof issues)
        if (!isValidFrenchPhone(telephone)) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'Format de téléphone invalide (ex: 06 12 34 56 78 ou +33 6 12 34 56 78)',
          });
        }
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
        // Re-throw ActionError as-is (e.g. from validation) - avoids double-wrap
        if (error && typeof error === 'object' && 'type' in error && (error as { type: string }).type === 'AstroActionError') {
          throw error;
        }
        // Debug: log full error structure when ACTIONS_DEBUG is set
        if (import.meta.env.ACTIONS_DEBUG) {
          console.error('[Contact Action] Error details:', {
            name: error && typeof error === 'object' && 'name' in error ? (error as Error).name : undefined,
            message: error && typeof error === 'object' && 'message' in error ? (error as Error).message : undefined,
            constructor: error && typeof error === 'object' ? (error as object).constructor?.name : undefined,
            keys: error && typeof error === 'object' ? Object.keys(error as object) : [],
          });
        }
        console.error('Error processing form submission:', error);
        
        // Safely extract error message without any instanceof checks
        let errorMessage = 'Une erreur est survenue lors de l\'envoi de votre demande';
        if (error) {
          if (typeof error === 'string') {
            errorMessage = error;
          } else if (typeof error === 'object' && error !== null && 'message' in error) {
            const msg = (error as { message: unknown }).message;
            errorMessage = typeof msg === 'string' ? msg : String(msg ?? error);
          } else {
            errorMessage = String(error);
          }
        }
        
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
        });
      }
    },
  }),
};

