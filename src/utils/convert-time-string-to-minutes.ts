export function convertTimeStringToMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(':').map((item) => Number(item)) // split retorna um array

  return hours * 60 + minutes // vamos retornar em formato em minutos
}
