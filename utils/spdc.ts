export const useSPDCAccessToken = async () => {
  const url =
    'https://open.spotify.com/get_access_token?reason=transport&productType=web_player'
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36',
    'App-platform': 'WebPlayer',
    'Content-Type': 'text/html; charset=utf-8',
    cookie: `sp_dc=${process.env.SPOTIFY_SP_DC}`,
  }
  const response = await fetch(url, { headers })
  const data = await response.json()
  return data?.accessToken || null
}
