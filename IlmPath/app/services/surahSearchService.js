import config from "../../config";

export const searchAudio = async (audioUri) => {
  try {
    const formData = new FormData();
    formData.append("audio", {
      uri: audioUri,
      name: "recorded_audio.wav", // Adjust name & format based on your app
      type: "audio/wav", // Change if recording in different format
    });

    const response = await fetch(`${config.apiBaseUrl}/audio-search-proxy`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Failed to process audio:", errorText);
      return null;
    }

    const data = await response.json();
    console.log("Audio Search Response:", data);
    return data;
  } catch (error) {
    console.error("Error in searchAudio service:", error);
    return null;
  }
};
