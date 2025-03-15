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
