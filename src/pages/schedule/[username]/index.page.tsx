import { prisma } from '@/lib/prisma'
import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { ScheduleForm } from '../ScheduleForm'
import { Container, UserHeader } from './styles'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <>
      <NextSeo title={`Agendar com ${user.name} | Ignite Call`} />
      <Container>
        <UserHeader>
          <Avatar src={user.avatarUrl} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>

        <ScheduleForm />
      </Container>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // nenhuma página vai ser gerada no momento da build - somente quando a página for acessada
    fallback: 'blocking',
  }
} // essa função diz para quais usuário vamos gerar a página estática no momento da build - vamos usar esse método porque vamos receber parâmetros, no momento da build o next precisa saber quais parâmetros vão ser usados

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // vamos criar essa página de forma estática, essa função é executada no momento da build e é executada do lado serverSide - por isso não temos como receber req/res
  const username = String(params?.username) // pegando o nome do usuário

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true, // erro 404
    }
  }

  return {
    props: {
      // propriedades que vão ser retornadas para o componente Schedule
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // de quanto em quanto tempo a página será recriada - 1 day
  }
}
