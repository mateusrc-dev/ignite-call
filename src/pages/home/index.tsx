import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image' // esse componente do next faz uma otimização automatizada nas imagens
import { Container, Hero, Preview } from './styles'
import imageHome from '../../assets/imageHome.png'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />

      <Container>
        <Hero>
          <Heading as="h1" size="4xl">
            Agendamento descomplicado
          </Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            o seu tempo livre.
          </Text>
          <ClaimUsernameForm />
        </Hero>
        <Preview>
          <Image
            src={imageHome}
            height={400}
            quality={100}
            priority
            alt="Calendário simbolizando aplicação em funcionamento"
          />
          {/* precisamos colocar uma altura ou largura máxima - quality 100 porque o Image do next baixa a qualidade por padrão da imagem - priority para o carregamento da imagem ser priorizado (por padrão o next carrega as imagens depois) */}
        </Preview>
      </Container>
    </>
  )
}
