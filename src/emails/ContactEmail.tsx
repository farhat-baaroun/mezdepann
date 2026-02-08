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
        {/* Header with logos */}
        <Section style={headerSection}>
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
          <Text style={title}>Nouvelle demande de contact</Text>
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
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#1a1a1a',
};

const headerSection = {
  padding: '20px 0',
  textAlign: 'center' as const,
  borderBottom: '2px solid #22c55e',
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
  padding: '30px 20px',
};

const title = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#22c55e',
  marginBottom: '20px',
  textAlign: 'center' as const,
};

const text = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#e5e5e5',
  marginBottom: '15px',
};

const divider = {
  borderColor: '#333333',
  margin: '20px 0',
};

const infoSection = {
  marginBottom: '15px',
};

const label = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#22c55e',
  marginBottom: '5px',
};

const value = {
  fontSize: '16px',
  color: '#ffffff',
  marginTop: '5px',
  paddingLeft: '10px',
};

const footerSection = {
  padding: '20px',
  textAlign: 'center' as const,
  backgroundColor: '#0a0a0a',
};

const footerText = {
  fontSize: '12px',
  color: '#888888',
  lineHeight: '1.6',
};
