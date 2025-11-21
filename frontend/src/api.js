const API_URL = "http://127.0.0.1:7860";

export async function getAnalysisAndRecommendations(movie_name, review_text) {
  const response = await fetch(`${API_URL}/predict_locale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movie_name, review_text })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchSecureMovies(endpoint, params = {}) {
  try {
    const urlParams = new URLSearchParams(params);
    const url = `${API_URL}${endpoint}?${urlParams}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    return [];
  }
}