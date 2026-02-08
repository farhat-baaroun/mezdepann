import type { APIRoute } from 'astro';
import { emailService } from '../../lib/email';
import ContactEmail from '../../emails/ContactEmail';
import { render } from '@react-email/render';
import { SITE } from '../../config/site';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    console.log("woooooook 3la zokou jdid ");

    const { nom, telephone, email, vehicule, etat } = data;

    if (!nom || !telephone || !email || !vehicule || !etat) {
      return new Response(
        JSON.stringify({ error: 'Tous les champs obligatoires doivent être remplis' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Format d\'email invalide' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Validate phone format (basic French phone validation)
    const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[.\s-]?[0-9]{2}){4}$/;
    const cleanPhone = telephone.replace(/[\s.-]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return new Response(JSON.stringify({ error: 'Format de téléphone invalide' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Generate email content using React Email template
    const emailContent = ContactEmail({
      nom,
      telephone,
      email,
      vehicule,
      etat,
      message: data.message || '',
    });

    const html = await render(emailContent);
    const text = await render(emailContent, { plainText: true });

    // Send email
    const recipientEmail = import.meta.env.EMAIL_TO || SITE.email;
    const result = await emailService.send({
      to: recipientEmail,
      subject: `Nouvelle demande de contact - ${nom}`,
      html,
      text,
    });

    if (!result.success) {
      console.error('Failed to send email:', result.error);
      return new Response(
        JSON.stringify({
          error: 'Une erreur est survenue lors de l\'envoi de votre demande',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Log for development
    console.log('Form submission received and email sent:', {
      nom,
      telephone,
      email,
      vehicule,
      etat,
      message: data.message || '',
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Votre demande a été envoyée avec succès',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing form submission:', error);
    return new Response(
      JSON.stringify({
        error: 'Une erreur est survenue lors de l\'envoi de votre demande',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

