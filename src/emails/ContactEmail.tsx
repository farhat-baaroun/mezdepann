import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from '@react-email/components';

interface ContactEmailProps {
  nom: string;
  telephone: string;
  email: string;
  vehicule: string;
  etat: string;
  message?: string;
}

const baseUrl = 'https://mezdepann.fr';

export const ContactEmail = ({
  nom,
  telephone,
  email,
  vehicule,
  etat,
  message,
}: ContactEmailProps) => (
  <Html lang="fr">
    <Head />
    <Preview>Nouvelle demande de contact depuis le site web</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Accent bar */}
        <div style={accentBar}></div>
        
        {/* Header with logos */}
        <Section style={headerSection}>
          <Text style={title}>Nouvelle demande de contact</Text>
          <Row>
            <Column style={logoColumn}>
              <Img
                src={`${baseUrl}/images/centre%20vhu.png`}
                width="120"
                height="auto"
                alt="Centre VHU Agréé"
                style={logo}
              />
            </Column>
            <Column style={logoColumn}>
              <Img
                src={`${baseUrl}/images/republique%20francaise.png`}
                width="120"
                height="auto"
                alt="République Française"
                style={logo}
              />
            </Column>
          </Row>
        </Section>

        <Section style={contentSection}>
          <Text style={text}>
            Vous avez reçu une nouvelle demande de contact depuis le site web MezDepann.
          </Text>

          <Hr style={divider} />

          <Section style={infoSection}>
            <Text style={label}>Nom:</Text>
            <Text style={value}>{nom}</Text>
          </Section>

          <Section style={infoSection}>
            <Text style={label}>Téléphone:</Text>
            <Text style={value}>{telephone}</Text>
          </Section>

          <Section style={infoSection}>
            <Text style={label}>Email:</Text>
            <Text style={value}>{email}</Text>
          </Section>

          <Section style={infoSection}>
            <Text style={label}>Type de véhicule:</Text>
            <Text style={value}>{vehicule}</Text>
          </Section>

          <Section style={infoSection}>
            <Text style={label}>État du véhicule:</Text>
            <Text style={value}>{etat}</Text>
          </Section>

          {message && (
            <>
              <Hr style={divider} />
              <Section style={infoSection}>
                <Text style={label}>Message:</Text>
                <Text style={value}>{message}</Text>
              </Section>
            </>
          )}
        </Section>

        <Hr style={divider} />

        <Section style={footerSection}>
          <Text style={footerText}>
            <strong>MezDepann</strong>
            <br />
            Épaviste Agréé Île-de-France
            <br />
            Téléphone: 07 66 46 33 92
            <br />
            Email: contact@mezdepann.fr
            <br />
            Site web: {baseUrl}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

ContactEmail.PreviewProps = {
  nom: 'Jean Dupont',
  telephone: '06 12 34 56 78',
  email: 'jean.dupont@example.fr',
  vehicule: 'Voiture',
  etat: 'Accidenté',
  message: 'Bonjour, j\'aimerais obtenir plus d\'informations sur vos services.',
} as ContactEmailProps;

export default ContactEmail;

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
  padding: '30px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#141414',
  borderBottom: '1px solid #262626',
};

const logoColumn = {
  width: '50%',
  textAlign: 'center' as const,
  padding: '0 10px',
};

const logo = {
  maxWidth: '120px',
  height: 'auto',
};

const contentSection = {
  padding: '40px 30px',
  backgroundColor: '#141414',
};

const title = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2563eb',
  marginBottom: '20px',
  textAlign: 'center' as const,
  letterSpacing: '-0.5px',
};

const text = {
  fontSize: '16px',
  lineHeight: '1.7',
  color: '#e5e5e5',
  marginBottom: '20px',
};

const divider = {
  borderColor: '#262626',
  margin: '20px 0',
};

const infoSection = {
  marginBottom: '20px',
  backgroundColor: '#1a1a1a',
  border: '1px solid #262626',
  borderRadius: '6px',
  padding: '16px',
};

const label = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#2563eb',
  marginBottom: '6px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const value = {
  fontSize: '16px',
  color: '#ffffff',
  marginTop: '4px',
  fontWeight: '500',
};

const footerSection = {
  padding: '30px',
  textAlign: 'center' as const,
  backgroundColor: '#0a0a0a',
  borderTop: '1px solid #262626',
};

const footerText = {
  fontSize: '13px',
  color: '#737373',
  lineHeight: '1.6',
};
