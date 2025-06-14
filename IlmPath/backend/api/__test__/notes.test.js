const request = require("supertest");
const app = require("../index");
const pool = require("../db");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

describe("Notes API Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should save a new note", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const response = await request(app)
      .post("/saveNote")
      .send({
        user_id: 1,
        user_role: "student",
        note_text: "This is a test note.",
        note_surrah: 2,
        note_ayah: 255,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Note added successfully");
    expect(response.body).toHaveProperty("noteId");
  });

  it("should update an existing note", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const response = await request(app)
      .post("/saveNote")
      .send({
        user_id: 1,
        user_role: "student",
        note_text: "Updated note text.",
        note_surrah: 2,
        note_ayah: 255,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Note updated successfully");
  });

  it("should retrieve a note", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ note_text: "Saved note text" }] });

    const response = await request(app)
      .post("/getNote")
      .send({ user_id: 1, user_role: "student", note_surrah: 2, note_ayah: 255 });

    expect(response.status).toBe(200);
    expect(response.body.note).toBe("Saved note text");
  });

  it("should return an error if the note is not found", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .post("/getNote")
      .send({ user_id: 1, user_role: "student", note_surrah: 2, note_ayah: 255 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Note not found.");
  });
});
