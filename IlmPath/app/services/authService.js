import config from '../../config';

export const signInUser = async (email, password) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
        console.log('Sign in failed:', result.message);
        return { success: false, message: result.message || 'Sign In Failed' };
    }

    return result;
  } catch (error) {
    console.error('Error during sign in:', error.message);
    throw error; // Re-throw the error to handle it in the component
  }
};

export const signUpStudent = async (studentData) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.log('Sign Up failed:', result.message);
        return { success: false, message: result.message || 'Sign Up Failed' };
      }
  
      return result;
    } catch (error) {
      console.error('Error during sign up:', error.message);
      throw error; // Re-throw the error to handle it in the component
    }
  };

export const signUpUllama = async (ullamaData) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/signup`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: ullamaData,
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.log('Sign Up failed:', result.message);
        return { success: false, message: result.message || 'Sign Up Failed' };
      }
  
      return result;
    } catch (error) {
      console.error('Error during Ullama signup:', error.message);
      throw error; // Re-throw the error to handle it in the component
    }
  };