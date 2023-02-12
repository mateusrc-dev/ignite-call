import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username) // query trás dados pelos parâmetros e pelas routes

  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date not provided.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const referenceDate = dayjs(String(date)) // date pode ser um array, por isso definimos como string
  const isPastDate = referenceDate.endOf('day').isBefore(new Date()) // é importante fazer a validação se o dia já passou no backend também

  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] }) // se tiver passado o dia não haverá nenhuma disponibilidade
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    // buscando o intervalo de tempo que o usuário vai estar disponível onde o dia da semana bate com a data que estou chamando a rota de disponibildiade
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    // testando se não houver horário disponível para esse usuário
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const { time_end_in_minutes, time_start_in_minutes } = userAvailability

  const endHour = time_end_in_minutes / 60 // retorna o horário inicial - um número inteiro
  const startHour = time_start_in_minutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  ) // vamos criar um array com todos os horários disponíveis entre os intervalo disponível no dia

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      // selecionando informações que vamos querer
      date: true,
    },
    where: {
      // procurar todos os agendamentos que tem o determinado usuário entre os determinados horários
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time, // validando se não existe nenhum agendamento no horário
    )

    const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date()) // validando se a hora está no passado

    return !isTimeBlocked && !isTimeInPast // pegando todos os horários disponíveis
  })

  return res.json({ possibleTimes, availableTimes })
}
