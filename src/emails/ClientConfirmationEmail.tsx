import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Button,
} from '@react-email/components';

interface ClientConfirmationEmailProps {
  nom: string;
}

const baseUrl = 'https://mezdepann.fr';

export const ClientConfirmationEmail = ({ nom }: ClientConfirmationEmailProps) => (
  <Html lang="fr">
    <Head />
    <Preview>Confirmation de réception de votre demande</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with accent bar */}
        <Section style={headerSection}>
          <div style={accentBar}></div>
          <Text style={headerTitle}>MezDepann</Text>
          <Text style={headerSubtitle}>Épaviste Agréé Île-de-France</Text>
        </Section>

        {/* Main Content */}
        <Section style={contentSection}>
          <Text style={greeting}>Bonjour {nom},</Text>
          
          <Text style={paragraph}>
            Nous avons bien reçu votre demande de contact et nous vous en remercions.
          </Text>

          <Section style={highlightBox}>
            <Text style={highlightText}>
              ✓ Votre demande a été transmise avec succès à notre équipe.
            </Text>
          </Section>

          <Text style={paragraph}>
            Notre équipe d'experts examine actuellement votre demande et vous contactera dans les plus brefs délais pour vous proposer une solution adaptée à vos besoins.
          </Text>

          <Text style={paragraph}>
            En attendant, n'hésitez pas à nous contacter directement si vous avez des questions urgentes.
          </Text>

          {/* Contact Info Box */}
          <Section style={contactBox}>
            <Text style={contactTitle}>Nos coordonnées</Text>
            <Text style={contactItem}>📞 Téléphone: 07 66 46 33 92</Text>
            <Text style={contactItem}>📧 Email: contact@mezdepann.fr</Text>
            <Text style={contactItem}>🌐 Site web: {baseUrl}</Text>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href={baseUrl}>
              Visiter notre site
            </Button>
          </Section>
        </Section>

        {/* Footer */}
        <Hr style={divider} />
        <Section style={footerSection}>
          <Text style={footerText}>
            <strong>MezDepann</strong>
            <br />
            Épaviste Agréé Île-de-France
            <br />
            Disponible 24h/24, 7j/7
          </Text>
          <Text style={footerNote}>
            Cet email a été envoyé automatiquement suite à votre demande de contact sur notre site web.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

ClientConfirmationEmail.PreviewProps = {
  nom: 'Jean Dupont',
} as ClientConfirmationEmailProps;

export default ClientConfirmationEmail;

// Styles with black, grey, and blue color scheme
const main = {
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#141414',
  borderRadius: '8px',
  overflow: 'hidden',
};

const accentBar = {
  height: '4px',
  backgroundColor: '#2563eb',
  width: '100%',
};

const headerSection = {
  padding: '40px 30px 30px',
  textAlign: 'center' as const,
  backgroundColor: '#141414',
};

const headerTitle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '20px 0 8px',
  letterSpacing: '-0.5px',
};

const headerSubtitle = {
  fontSize: '14px',
  color: '#a3a3a3',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const contentSection = {
  padding: '40px 30px',
  backgroundColor: '#141414',
};

const greeting = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#ffffff',
  marginBottom: '20px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.7',
  color: '#e5e5e5',
  marginBottom: '20px',
};

const highlightBox = {
  backgroundColor: '#1a1a1a',
  borderLeft: '4px solid #2563eb',
  padding: '20px',
  margin: '30px 0',
  borderRadius: '4px',
};

const highlightText = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2563eb',
  margin: '0',
};

const contactBox = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #262626',
  borderRadius: '8px',
  padding: '24px',
  margin: '30px 0',
};

const contactTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#ffffff',
  marginBottom: '16px',
};

const contactItem = {
  fontSize: '15px',
  color: '#d4d4d4',
  marginBottom: '8px',
  lineHeight: '1.6',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '14px 32px',
  borderRadius: '6px',
  display: 'inline-block',
  border: 'none',
};

const divider = {
  borderColor: '#262626',
  margin: '0',
};

const footerSection = {
  padding: '30px',
  textAlign: 'center' as const,
  backgroundColor: '#0a0a0a',
};

const footerText = {
  fontSize: '13px',
  color: '#737373',
  lineHeight: '1.6',
  marginBottom: '12px',
};

const footerNote = {
  fontSize: '11px',
  color: '#525252',
  lineHeight: '1.5',
  marginTop: '12px',
  fontStyle: 'italic' as const,
};

