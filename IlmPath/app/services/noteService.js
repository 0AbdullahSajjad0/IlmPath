import config from "../../config";

// Function to get a note
export const fetchNote = async (user, surahId, ayahNumber) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getNote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          user_role: user.role,
          note_surrah: surahId,
          note_ayah: ayahNumber,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Fetched note successfully:", result.note);
        return result.note;
      } else {
        // Log only non-critical information, not errors
        if (result.message === 'Note not found.') {
          console.log("No note found for this Ayah.");
        } else {
          console.error("Error fetching note:", result.message);
        }
        return ''; // Return empty string if no note found
      }
    } catch (error) {
      console.error("Error fetching note:", error);
      return ''; // Return empty string in case of an error
    }
  };
  
  // Function to save a note
export const saveNote = async (user, surahId, ayahNumber, noteText) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/saveNote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          user_role: user.role,
          note_text: noteText,
          note_surrah: surahId,
          note_ayah: ayahNumber,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Saved note successfully:", result.message);
        return true; // Return success
      } else {
        console.error("Error saving note:", result.message);
        return false; // Return failure
      }
    } catch (error) {
      console.error("Error saving note:", error);
      return false; // Return failure
    }
  };