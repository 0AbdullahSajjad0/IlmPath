import config from "../../config";

export const getProgress = async ({ user_id, role }) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getProgress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, role }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch progress.');
      }
  
      const data = await response.json();
      return data.progress; // Return progress value
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  };

export const trackProgress = async ({ user_id, role }) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/trackProgress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, role }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to track progress.');
      }
  
      const data = await response.json();
      return data.progress; // Return the updated progress
    } catch (error) {
      console.error('Error tracking progress:', error);
      throw error;
    }
  };