import config from '../../config';

export const searchChatbot = async (query) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/chatbot-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.log("Failed to fetch chatbot response:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return [];
  }
};
