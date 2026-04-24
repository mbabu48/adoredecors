import { describe, it, expect, afterEach, vi } from "vitest";

vi.mock("next-auth/providers/google", () => ({ default: vi.fn(() => ({})) }));
vi.mock("next-auth/providers/credentials", () => ({ default: vi.fn(() => ({})) }));

import { isAdminEmail } from "@/lib/auth";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isAdminEmail", () => {
  it("returns false when email is null", () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
    expect(isAdminEmail(null)).toBe(false);
  });

  it("returns false when email is undefined", () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it("returns false when ADMIN_EMAILS is empty string (deny all)", () => {
    vi.stubEnv("ADMIN_EMAILS", "");
    expect(isAdminEmail("anyone@example.com")).toBe(false);
  });

  it("returns false when ADMIN_EMAILS is unset (deny all)", () => {
    delete process.env.ADMIN_EMAILS;
    expect(isAdminEmail("anyone@example.com")).toBe(false);
  });

  it("returns true for a matching email", () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
    expect(isAdminEmail("admin@example.com")).toBe(true);
  });

  it("returns false for a non-matching email", () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
    expect(isAdminEmail("other@example.com")).toBe(false);
  });

  it("matches case-insensitively", () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
    expect(isAdminEmail("ADMIN@EXAMPLE.COM")).toBe(true);
  });

  it("supports multiple emails in comma-separated list", () => {
    vi.stubEnv("ADMIN_EMAILS", "a@example.com, b@example.com");
    expect(isAdminEmail("b@example.com")).toBe(true);
    expect(isAdminEmail("c@example.com")).toBe(false);
  });
});
