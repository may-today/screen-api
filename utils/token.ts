export const useToken = async () => {
  const url = "https://accounts.spotify.com/api/token";
  const headers = {
    Authorization:
      "Basic " +
      Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET,
      ).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const body = "grant_type=client_credentials";
  const response = await fetch(url, { method: "POST", headers, body });
  const data = await response.json();
  return data?.access_token || null;
};
