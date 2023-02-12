import dayjs from 'dayjs'
import { google } from 'googleapis'
import { prisma } from './prisma'

export async function getGoogleOAuthToken(userId: string) {
  // função vai ser chamada quando formos nos comunicar com a api do google, vai automatizar o processo de verificar se o token do banco de dados está expirado e vai atualizar o token com o refresh_token
  const account = await prisma.account.findFirstOrThrow({
    where: {
      // procurar registro na tabela account onde...
      provider: 'google',
      user_id: userId,
    },
  })

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )

  auth.setCredentials({
    // vamos passar as credenciais de autenticação com a api
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : null, // temos que multiplicar por 1000 porque vem do banco de dados
  })

  if (!account.expires_at) {
    return auth
  }

  const isTokenExpired = dayjs(account.expires_at * 1000).isBefore(new Date()) // dayjs precisa ler isso em milissegundos, por isso a multiplicação - vamos validar se expires_at é anterior a data atual

  if (isTokenExpired) {
    // se a data de expiração do token for anterior a data atual...
    const { credentials } = await auth.refreshAccessToken() // atualizando token
    const {
      access_token,
      expiry_date,
      id_token,
      refresh_token,
      scope,
      token_type,
    } = credentials // vamos ter acesso as informações do token novamente

    await prisma.account.update({
      // vamos salvar esses dados no prisma
      where: {
        id: account.id,
      },
      data: {
        access_token,
        expires_at: expiry_date ? Math.floor(expiry_date / 1000) : null, // precisamos salvar em segundos - por isso a divisão por 1000
        id_token,
        refresh_token,
        scope,
        token_type,
      },
    })

    auth.setCredentials({
      // vamos passar as credenciais de autenticação com a api
      access_token,
      refresh_token,
      expiry_date,
    })
  }

  return auth // retornando objeto de autenticação
}
