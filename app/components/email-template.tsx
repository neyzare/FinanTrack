
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
    username: string;
    resetUrl: string;
}

export default function ResetPasswordEmail({
                                               username,
                                               resetUrl,
                                           }: ResetPasswordEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Réinitialise ton mot de passe Finantrack</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Réinitialisation de mot de passe</Heading>

                    <Text style={text}>Salut {username},</Text>

                    <Text style={text}>
                        Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous pour en choisir un nouveau :
                    </Text>

                    <Section style={buttonContainer}>
                        <Button style={button} href={resetUrl}>
                            Réinitialiser mon mot de passe
                        </Button>
                    </Section>

                    <Text style={text}>
                        Ce lien expire dans <strong>30 minutes</strong>. Si tu n'as pas demandé cette réinitialisation, ignore simplement cet email.
                    </Text>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :
                        <br />
                        <span style={link}>{resetUrl}</span>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '40px auto',
    padding: '32px',
    borderRadius: '8px',
    maxWidth: '480px',
};

const h1 = {
    color: '#1a1a1a',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
};

const text = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '24px',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
};

const hr = {
    borderColor: '#e5e7eb',
    margin: '32px 0',
};

const footer = {
    color: '#6b7280',
    fontSize: '13px',
};

const link = {
    color: '#3b82f6',
    wordBreak: 'break-all' as const,
};