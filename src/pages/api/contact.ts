import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validate required fields
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

    // TODO: Send email using a service like Resend, SendGrid, or Formspree
    // For now, we'll just log the data and return success
    // In production, replace this with actual email sending logic:
    /*
    const emailService = new EmailService();
    await emailService.send({
      to: 'contact@mezdepann.fr',
      subject: `Nouvelle demande de devis - ${nom}`,
      html: `
        <h2>Nouvelle demande de devis</h2>
        <p><strong>Nom:</strong> ${nom}</p>
        <p><strong>Téléphone:</strong> ${telephone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Type de véhicule:</strong> ${vehicule}</p>
        <p><strong>État:</strong> ${etat}</p>
        ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
      `,
    });
    */

    // Log for development (remove in production)
    console.log('Form submission received:', {
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

