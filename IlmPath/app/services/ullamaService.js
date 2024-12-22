import config from "../../config";

export const fetchAllUlama = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAllUlama`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        console.log("Failed to fetch Ulama:", response.statusText);
        return [];
      }
  
      const data = await response.json();
      return data.ulama || []; // Return the list of Ulama or an empty array
    } catch (error) {
      console.error("Error fetching Ulama list:", error);
      return [];
    }
  };

export const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 5000 }), // Amount in cents
      });
  
      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Error fetching client secret:', error.message);
      return null;
    }
  };