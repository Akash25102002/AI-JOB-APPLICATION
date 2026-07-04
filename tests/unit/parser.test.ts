import { describe, it, expect } from "vitest";
import { parseResume } from "../../lib/ai/parser";

describe("Resume Parser Unit Tests", () => {
  it("should parse raw text and return structured resume entities", async () => {
    const rawText = `
    Alex Mercer
    alex.mercer@example.com
    Skills: TypeScript, React, Docker.
    Education: Stanford University, BS in CS (2017-2021).
    `;

    const parsed = await parseResume(rawText);

    expect(parsed).toBeDefined();
    expect(parsed.fullName).toBe("Alex Mercer");
    expect(parsed.email).toBe("alex.mercer@example.com");
    expect(parsed.skills).toContain("TypeScript");
    expect(parsed.skills).toContain("React");
    expect(parsed.education[0].school).toBe("Stanford University");
    expect(parsed.education[0].degree).toBe("Bachelor of Science");
  });

  it("should throw error if raw resume text is empty", async () => {
    await expect(parseResume("   ")).rejects.toThrow("Resume content is empty. Cannot parse.");
  });
});
