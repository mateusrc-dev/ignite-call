import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight, Check } from 'phosphor-react'
import { Container, Header } from '../styles'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import {
  signIn,
  useSession,
} from 'next-auth/react' /* vamos especificar na função qual é o provider */
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
// import { api } from '../../lib/axios'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error // as duas exclamações é para retornar true ou false dependendo se error existir ou não
  const isSignedIn = session.status === 'authenticated'

  async function handleSignIn() {
    await signIn('google')
  }

  async function handleNavigateToNextStep() {
    await router.push('/register/time-intervals')
  }

  return (
    <>
      <NextSeo title="Conecte sua agenda do Google | Ignite Call" noindex />
      {/* para o google não indexar essa página - ela vai ser acessível apenas ao fluxo de cadastro */}
      <Container>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>
          <MultiStep size={4} currentStep={2} />
        </Header>

        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>
            {isSignedIn ? (
              <Button size="sm" disabled>
                Conectado
                <Check />
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={handleSignIn}>
                Conectar <ArrowRight />
              </Button>
            )}
          </ConnectItem>

          {hasAuthError && (
            <AuthError size="sm">
              Falha ao se conectar ao Google, verifique e você habilitou as
              permissões de acesso ao Google Calendar.
            </AuthError>
          )}

          <Button
            onClick={handleNavigateToNextStep}
            type="submit"
            disabled={!isSignedIn}
          >
            Próximo passo <ArrowRight />
          </Button>
        </ConnectBox>
      </Container>
    </>
  )
}
