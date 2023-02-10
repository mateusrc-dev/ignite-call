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
        return currentDate.subtract(i + 1, 'day') // pegando a data no dia 1 e retornando de acordo com o valor de length
      })
      .reverse()

    return [...previousMonthFillArray, ...daysInMonthArray]
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
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay disabled>2</CalendarDay>
            </td>
            <td>
              <CalendarDay>3</CalendarDay>
            </td>
          </tr>
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
