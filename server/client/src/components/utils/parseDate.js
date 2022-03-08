// This function converts the time difference for drink expiry dates
export const parseDate = (date) => {
  const currentTime = Math.round(Date.now() / 1000) // Unix time in seconds
  const expiryDate = Date.parse(date) / 1000 // Unix time in seconds
  
  const tdDays = ( expiryDate - currentTime ) / (60 * 60 * 24) // Days remaining
  const tdDaysWhole = Math.floor(tdDays) // Whole days remaining
  const tdDaysPart = tdDays % 1 // Part days remaining
  
  const tdHours = tdDays * 24
  const tdHoursWhole = Math.floor(tdDaysPart * 24)
  const tdHoursPart = tdHours % 1

  const tdMins = tdHours * 60
  const tdMinsWhole = Math.floor(tdHoursPart * 60)
  const tdMinsPart = tdMins % 1

  const tdSecsWhole = Math.floor(tdMinsPart * 60)

  return ({
    days: tdDaysWhole,
    hours: tdHoursWhole,
    minutes: tdMinsWhole,
    seconds: tdSecsWhole
  })
}