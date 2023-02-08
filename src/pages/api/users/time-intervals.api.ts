// essa rota vai ser responsável por receber o nosso formulário da page time-intervals e salvar essas informações dentro do registro do usuário -  dados do usuário logado através do google estão dentro dos cookies da aplicação

import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // essa rota vai ser chamada para cadastrar os intervalos de tempo disponíveis pelo usuário
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res), // devolve nossas opções de autenticação
  ) // usamos o getServerSession em serverSide para acessar os dados da sessão - dados do usuário logado - vamos precisar do id para colocar os intervalos disponíveis de determinado usuário

  if (!session) {
    return res.status(401).end() // erro de não autenticado
  }

  const { intervals } = timeIntervalsBodySchema.parse(req.body) // para retornar os dados tipados do body - parse retorna um erro

  await Promise.all(
    // para executar várias promises em concorrencia, uma junto com as outras - vamos colocar cada interval no banco de dados
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      })
    }),
  )

  // await prisma.userTimeInterval.createMany // createMany é para fazer várias inserções de uma vez - não funciona com banco de dados SQLite

  return res.status(201).end()
}
