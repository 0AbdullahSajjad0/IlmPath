import config from "../../config";

export const getUserDetails = async (userId, userRole) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getUserDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          user_role: userRole,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to fetch user details:', error.message);
        return null;
      }
  
      const result = await response.json();
      console.log('User details fetched:', result.user);
      return result.user;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };