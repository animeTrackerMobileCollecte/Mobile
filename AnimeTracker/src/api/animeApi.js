import client from "./client"; // ton axios configuré

export async function fetchAnimeList(page = 1) {
  try {
    const response = await client.get(`/animeList?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Erreur fetchAnimeList :", error);
    return null;
  }
}
