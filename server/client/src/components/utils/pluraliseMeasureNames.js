// This function pluralises measure names
// Takes two arguments - first is the measure name
// Second is the number of measures so that measure name is retained if there is only 1 measure remaining
export const pluraliseMeasureNames = (measureName, noMeasures) => {
  if(measureName === 'half pint' && noMeasures > 1) return 'half pints'
  if(measureName === 'glass' && noMeasures > 1) return 'glasses'
  if(measureName === 'shot' && noMeasures > 1) return 'shots'
  return measureName
}