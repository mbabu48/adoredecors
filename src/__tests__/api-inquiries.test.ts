import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    inquiry: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

// Mock next-auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

// Mock auth module
vi.mock("@/lib/auth", () => ({
  authOptions: {},
  isAdminEmail: vi.fn().mockReturnValue(true),
}));

import { POST, GET } from "@/app/api/inquiries/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

const mockPrisma = prisma as unknown as {
  inquiry: { create: ReturnType<typeof vi.fn>; findMany: ReturnType<typeof vi.fn> };
};
const mockGetSession = getServerSession as ReturnType<typeof vi.fn>;

function makeRequest(method: string, body?: unknown) {
  return new Request("http://localhost/api/inquiries", {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/inquiries", () => {
  const validBody = {
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 99999 00000",
    eventType: "wedding",
    message: "I need decoration for my wedding.",
    source: "contact",
  };

  it("creates an inquiry with valid data", async () => {
    const fakeInquiry = { id: "cltest123", ...validBody };
    mockPrisma.inquiry.create.mockResolvedValue(fakeInquiry);

    const req = makeRequest("POST", validBody);
    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.id).toBe("cltest123");
    expect(mockPrisma.inquiry.create).toHaveBeenCalledOnce();
  });

  it("rejects missing required fields with 400", async () => {
    const req = makeRequest("POST", { name: "Only Name" }); // missing email, phone, etc.
    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid input");
    expect(mockPrisma.inquiry.create).not.toHaveBeenCalled();
  });

  it("rejects invalid email format with 400", async () => {
    const req = makeRequest("POST", { ...validBody, email: "not-an-email" });
    const res = await POST(req as any);

    expect(res.status).toBe(400);
  });

  it("rejects message that is too short with 400", async () => {
    const req = makeRequest("POST", { ...validBody, message: "Hi" }); // less than 3 chars
    const res = await POST(req as any);

    expect(res.status).toBe(400);
  });

  it("accepts optional fields like eventDate and guestCount", async () => {
    const fakeInquiry = { id: "cltest456", ...validBody, eventDate: new Date("2026-12-01"), guestCount: 80 };
    mockPrisma.inquiry.create.mockResolvedValue(fakeInquiry);

    const body = { ...validBody, eventDate: "2026-12-01", guestCount: 80 };
    const req = makeRequest("POST", body);
    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
  });
});

describe("GET /api/inquiries", () => {
  it("returns list of inquiries for authenticated admin", async () => {
    const fakeRows = [
      { id: "cl1", name: "Alice", email: "alice@example.com", status: "new" },
      { id: "cl2", name: "Bob", email: "bob@example.com", status: "followup" },
    ];
    mockGetSession.mockResolvedValue({ user: { email: "admin@example.com" } });
    mockPrisma.inquiry.findMany.mockResolvedValue(fakeRows);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.rows).toHaveLength(2);
    expect(data.rows[0].name).toBe("Alice");
  });

  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });
});
