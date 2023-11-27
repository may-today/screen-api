interface RequestResult {
  error: boolean;
  message?: string;
  syncType: "LINE_SYNCED" | "UNSYNCED";
  lines?: {
    startTimeMs: string;
    words: string;
  }[];
}

export default eventHandler(async (event) => {
  const { trackid } = getQuery(event);
  const url = "https://spotify-lyric-api-984e7b4face0.herokuapp.com/";
  const params = {
    trackid: trackid as string,
  };
  const response = await fetch(url + "?" + new URLSearchParams(params));
  const rawData = await response.json();
  return rawData;
});
