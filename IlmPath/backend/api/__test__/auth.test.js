const request = require("supertest");
const app = require("../index"); // Your main Express app
const pool = require("../db");
const bcrypt = require("bcryptjs");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

describe("Authentication API Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sign up a new student successfully", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, name: "Test User", email: "test@example.com", role: "student" }],
    });

    const response = await request(app)
      .post("/signup")
      .send({
        email: "test@example.com",
        password: "password123",
        role: "student",
        name: "Test User",
        dob: "2000-01-01",
        phoneNo: "1234567890",
        gender: "Male",
        nickName: "Tester",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Sign Up Successful");
    expect(pool.query).toHaveBeenCalled();
  });

  it("should not allow duplicate email registration", async () => {
    pool.query.mockRejectedValueOnce({ code: "23505" });

    const response = await request(app)
      .post("/signup")
      .send({
        email: "existing@example.com",
        password: "password123",
        role: "student",
        name: "Existing User",
        dob: "2000-01-01",
        phoneNo: "1234567890",
        gender: "Male",
        nickName: "Existing",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email already registered in the system.");
  });

  it("should sign in a user with correct credentials", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, email: "test@example.com", password: hashedPassword, role: "student" }] });

    const response = await request(app)
      .post("/signin")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Sign In Successful");
    expect(response.body).toHaveProperty("token");
  });

  it("should not allow sign-in with incorrect password", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, email: "test@example.com", password: hashedPassword, role: "student" }] });

    const response = await request(app)
      .post("/signin")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password.");
  });

  it("should return an error for non-existent user", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .post("/signin")
      .send({ email: "unknown@example.com", password: "password123" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password.");
  });
});
