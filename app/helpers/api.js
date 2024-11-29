import config from "../../config"; // Adjust the path based on where your config.js is located

export const apiPost = async (endpoint, body) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
