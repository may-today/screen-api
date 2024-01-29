import { trad2simple } from '../utils/chinese'

interface RequestResult {
  error?: {
    status: number
    message: string
  }
  tracks?: {
    items: {
      id: string
      name: string
      uri: string
      duration_ms: number
      album: {
        id: string
        name: string
        release_date: string
        uri: string
        images: {
          url: string
          height: number
          width: number
        }[]
      }
      artists: {
        id: string
        name: string
        uri: string
      }[]
    }[]
  }
}

export default eventHandler(async (event) => {
  const { q } = getQuery(event)
  console.log(`search: ${q}`)
  const url = 'https://api.spotify.com/v1/search'
  const token = await useToken()
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const params = {
    q: q as string,
    type: 'track',
  }
  const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
    headers,
  })
  const rawData = await response.json()
  return parseRawData(rawData)
})

const parseRawData = (data: RequestResult) => {
  if (data.error) {
    return { error: data.error }
  }
  const tracks = data.tracks?.items.map((track) => {
    const { id, name, uri, album, artists } = track
    return {
      id,
      name: trad2simple(name),
      uri,
      duration: Math.floor(track.duration_ms / 1000),
      album: {
        id: album.id,
        name: trad2simple(album.name),
        release_date: album.release_date,
        uri: album.uri,
        image: album.images[0].url,
      },
      artists: artists.map((artist) => {
        const { id, name, uri } = artist
        return {
          id,
          name: trad2simple(name),
          uri
        }
      }),
      artists_str: artists.map((artist) => trad2simple(artist.name)).join(', '),
    };
  });
  return { tracks };
};
