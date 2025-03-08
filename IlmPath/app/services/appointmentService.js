import config from "../../config";

export const bookAppointment = async ({ student_id, ulama_id, appointment_date, appointment_time, appointment_details  }) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/bookAppointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id, ulama_id, appointment_date, appointment_time, appointment_details }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Failed to book appointment:", errorText);
      return null;
    }

    const data = await response.json();
    return data.appointment; // adjust according to your backend's response
  } catch (error) {
    console.error("Error booking appointment", error);
    return null;
  }
};



export const fetchStudentAppointments = async (studentId) => {
  console.log("I am inside service");
  try {
    console.log("Fetching appointments for student:", studentId);
    console.log("I am inside service");
    const response = await fetch(`${config.apiBaseUrl}/getStudentAppointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_id: studentId }),
    });
    console.log('Response:', response);

    if (!response.ok) {
      console.log("Failed to fetch appointments:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.appointments || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

export const fetchUllamaAppointments = async (ullamaId) => {
  console.log("I am inside service");
  try {
    console.log("Fetching appointments for Ulama:", ullamaId);
    console.log("I am inside service");
    const response = await fetch(`${config.apiBaseUrl}/getUlamaAppointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ulama_id: ullamaId }),
    });
    console.log('Response:', response);

    if (!response.ok) {
      console.log("Failed to fetch appointments:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.appointments || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

export const fetchAvailableTimes = async (ulamaId, appointmentDate) => {
  console.log("Fetching available times for Ulama:", ulamaId, "on", appointmentDate);

  try {
    const response = await fetch(
      `${config.apiBaseUrl}/getAvailableTimes?ulama_id=${ulamaId}&appointment_date=${appointmentDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response);

    if (!response.ok) {
      console.log("Failed to fetch available times:", response.statusText);
      return [];
    }

    const data = await response.json();
    console.log("Available Times:", data.availableTimes);
    return data.availableTimes || [];
  } catch (error) {
    console.error("Error fetching available times:", error);
    return [];
  }
};

export const checkExistingAppointment = async (student_id, ulama_id) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/checkExistingAppointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id, ulama_id }),
    });

    if (!response.ok) {
      console.error("Failed to check existing appointment:", await response.text());
      return { exists: false };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking existing appointment:", error);
    return { exists: false };
  }
};

export const checkAndEndAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/checkAndEndAppointment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appointment_id: appointmentId }),
    });

    if (!response.ok) {
      console.log("Failed to check appointment:", response.statusText);
      return { expired: false, notStarted: false, message: 'Error checking appointment.' };
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking appointment:", error);
    return { expired: false, notStarted: false, message: 'Error checking appointment.' };
  }
};




export const endAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/endAppointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointment_id: appointmentId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Failed to end appointment:", errorText);
      return false;
    }

    console.log("Appointment ended successfully");
    return true;
  } catch (error) {
    console.error("Error ending appointment:", error);
    return false;
  }
};
