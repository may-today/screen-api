import { trad2simple } from '../utils/chinese'

interface RequestResult {
  lyrics?: {
    syncType: 'LINE_SYNCED' | 'UNSYNCED'
    lines?: {
      startTimeMs: string
      words: string
    }[]
  }
  error?: boolean
  message?: string
}

export default eventHandler(async (event) => {
  const { trackid } = getQuery(event)
  const url = `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackid}`
  const token = await useSPDCAccessToken()
  const params = {
    format: 'json',
    market: 'from_token',
  }
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36',
    'App-platform': 'WebPlayer',
    cookie: `sp_dc=${process.env.SPOTIFY_SP_DC}`,
    Authorization: `Bearer ${token}`,
  }
  const response = await fetch(`${url}?${new URLSearchParams(params)}`, { headers })
  if (!response.ok) {
    return new Response(JSON.stringify({ error: true, message: 'lyrics for this track is not available on spotify!' }), {
      status: 404,
    })
  }
  const rawData = await response.json()
  return parseRawData(rawData)
})

const parseRawData = (data: RequestResult) => {
  if (!data.lyrics) {
    return data
  }
  if (data.error) {
    return data
  }
  const lines = data.lyrics.lines?.map((line) => {
    const { startTimeMs, words } = line
    return {
      time:
        data.lyrics.syncType === 'UNSYNCED'
          ? -1
          : Math.floor(parseInt(startTimeMs) / 1000),
      text: trad2simple(words),
    }
  })
  return {
    syncType: data.lyrics.syncType,
    lines,
  }
}
