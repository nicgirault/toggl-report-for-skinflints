import moment from 'moment'

export const parse = (timeEntries) => {
  const tags = getTags(timeEntries)

  const data = timeEntries.reduce((data, timeEntry) => {
    const start = new moment(timeEntry.start)
    const stop = new moment(timeEntry.stop)

    timeEntry.tags && timeEntry.tags.forEach(tag => {
      data.push({
        x: tags.indexOf(tag),
        y: moment.duration(stop.diff(start)).as('hours'),
        duration: moment.duration(stop.diff(start)),
        name: timeEntry.description,
        color: colors[tags.indexOf(tag)],
      })
    })
    return data
  }, [])

  return { data: data.sort((a, b) => a.x - b.x), tags }
}

const colors = ['#4CAF50', '#f44336', '#3f51b5', '#2196f3', '#009688',
'#ff9800', '#607d8b', '#673ab7', '#00bcd4', '#e91e63']

const getTags = (entries) => {
  return Object.keys(entries.reduce((hash, entry) => {
    entry.tags && entry.tags.forEach(tag => hash[tag] = true)
    return hash
  }, {}))
}
