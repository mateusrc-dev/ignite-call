import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const username = String(req.query.username) // query trás dados pelos parâmetros e pelas routes

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const createSchedulingBody = z.object({
    // para fazer uma dupla verificação e um parse
    name: z.string(),
    email: z.string().email(),
    observations: z.string(),
    date: z.string().datetime(), // fazer conversão para objeto date JS
  })

  const { name, email, observations, date } = createSchedulingBody.parse(
    req.body,
  ) // dessa vez vamos pegar a informação do body, e não dos parâmetros - vamos colocar uma tipagem nos dados

  const schedulingDate = dayjs(date).startOf('hour') // novamente vamos forçar no backend que toda hora esteja no exato começo da hora - fica mais fácil fazer validação

  if (schedulingDate.isBefore(new Date())) {
    // temos que fazer a verificação novamente no backend
    return res.status(400).json({
      message: 'Date is in the past!',
    })
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    // verificando se existe agendamento no determinado horário
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(), // convertendo a data para objeto JS que é o que o prisma aceita
    },
  })

  if (conflictingScheduling) {
    return res.status(400).json({
      message: 'There is another scheduling at the same time.',
    })
  }

  await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  })

  return res.status(201).end() // status 201 pra indicar criação bem sucedida
}
