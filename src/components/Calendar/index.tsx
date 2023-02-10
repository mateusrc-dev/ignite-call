import { getWeekDays } from '@/utils/get-week-days'
import dayjs from 'dayjs'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useMemo, useState } from 'react'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1) // para pegar o mês atual
  })

  console.log(currentDate)
  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month') // subtraindo 1 mês da data atual

    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month') // adicionando 1 mês na data atual

    setCurrentDate(nextMonthDate)
  }

  const shortWeekDays = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM') // fazendo formatação
  const currentYear = currentDate.format('YYYY')

  const calendarWeeks = useMemo(() => {
    // useMemo é para a função não ser ativada sempre que o componente pai renderizar
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      // no map não retorna nenhum conteúdo porque estamos criando um array
      return currentDate.set('date', i + 1)
    }) // retornando os dias do mês em currentDate

    const firstWeekDay = currentDate.get('day') // pegando qual é o primeiro dia da semana do mês

    const previousMonthFillArray = Array.from({
      length: firstWeekDay, // criando um array com os dias que estão faltando
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day') // pegando a data no dia 1 e retornando subtraindo de acordo com o valor de length
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )

    const lastWeekDay = lastDayInCurrentMonth.get('day') // pegando o útimo dia da semana do mês

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1), // criando um array com os dias que estão faltando posteriormente ao último dia do mês
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day')
    }) // pegando a data no último dia do mês e retornando adicionando de acordo com o valor de length

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return { date, disabled: false }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        // weeks é o CalendarWeeks que é o array que vamos manipular para ser retornado no final, '_' é o calendarDays que não será retornado nenhum conteúdo, 'i' é a quantidade de elementos (datas) dentro de calendarDays, 'original' retorna o array original que é o calendarDays
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate])

  console.log(calendarWeeks)

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={String(weekDay)}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay disabled={disabled}>
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
