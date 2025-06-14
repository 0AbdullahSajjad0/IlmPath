const request = require("supertest");
const app = require("../index");
const pool = require("../db");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

describe("Appointments API Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully book an appointment", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, chat_id: "test-chat-id" }] });

    const response = await request(app)
      .post("/bookAppointment")
      .send({
        student_id: 1,
        ulama_id: 2,
        appointment_date: "2025-03-20",
        appointment_time: "10:00 AM",
        appointment_details: "Test appointment",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Appointment booked successfully");
    expect(response.body.appointment.chat_id).toBe("test-chat-id");
  });

  it("should return an error for missing fields in appointment booking", async () => {
    const response = await request(app)
      .post("/bookAppointment")
      .send({
        student_id: 1,
        appointment_date: "2025-03-20",
        appointment_time: "10:00 AM",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Missing required fields");
  });

  it("should fetch student appointments", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, ulama_name: "Sheikh Ahmad", expertise: "Tajweed", profileImage: "image.jpg" }],
    });

    const response = await request(app)
      .post("/getStudentAppointments")
      .send({ student_id: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Appointments retrieved successfully");
    expect(response.body.appointments.length).toBe(1);
  });

  it("should return an error when fetching student appointments with missing ID", async () => {
    const response = await request(app)
      .post("/getStudentAppointments")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Student ID is required.");
  });
});
