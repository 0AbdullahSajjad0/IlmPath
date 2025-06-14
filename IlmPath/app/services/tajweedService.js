import config from "../../config";

export const sendAudioForTajweedAnalysis = async (audioUri) => {
  try {
    const formData = new FormData();
    formData.append("audio", {
      uri: audioUri,
      type: "audio/wav", // ✅ Ensure correct MIME type
      name: "recording.wav",
    });

    const response = await fetch(`${config.apiBaseUrl}/tajweed-proxy`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      console.log("Failed to fetch Tajweed analysis response:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error("Error sending audio for Tajweed analysis:", error);
    return null;
  }
};

// Function to fetch Tajweed analysis for a specific Ayah
export const fetchTajweedAnalysis = async (surahNumber, ayahNumber) => {
  try {
    const response = await fetch(
      `${config.apiBaseUrl}/getTajweedAnalysis?surah_number=${surahNumber}&ayah_number=${ayahNumber}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log("Fetched Tajweed analysis successfully:", result);
      return result;
    } else {
      console.error("Error fetching Tajweed analysis:", result.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching Tajweed analysis:", error);
    return null;
  }
};