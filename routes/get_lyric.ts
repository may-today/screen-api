import { trad2simple } from '../utils/chinese'

interface RequestResult {
  error: boolean
  message?: string
  syncType: 'LINE_SYNCED' | 'UNSYNCED'
  lines?: {
    startTimeMs: string
    words: string
  }[]
}

export default eventHandler(async (event) => {
  const { trackid } = getQuery(event)
  const url = process.env.LYRIC_API_HOST
  const params = {
    trackid: trackid as string,
  }
  const response = await fetch(`${url}?${new URLSearchParams(params)}`)
  const rawData = await response.json()
  return parseRawData(rawData)
})

const parseRawData = (data: RequestResult) => {
  if (data.error) {
    return data
  }
  const lines = data.lines?.map((line) => {
    const { startTimeMs, words } = line
    return {
      time:
        data.syncType === 'UNSYNCED'
          ? -1
          : Math.floor(parseInt(startTimeMs) / 1000),
      text: trad2simple(words),
    }
  })
  return {
    syncType: data.syncType,
    lines,
  }
}
