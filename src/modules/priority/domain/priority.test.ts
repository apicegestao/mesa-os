import { describe, expect, it } from "vitest";
import { lowestCandidates } from "./priority";

const base = { ime: 50, stageCode: "x", stageLabel: "X" };
describe("priority candidates", () => {
  it("returns the unique lowest dimension", () => expect(lowestCandidates({ ...base, dimensions: [{ code: "a", label: "A", score: 20 }, { code: "b", label: "B", score: 40 }] })).toEqual([{ code: "a", label: "A", score: 20 }]));
  it("preserves every tied lowest candidate", () => expect(lowestCandidates({ ...base, dimensions: [{ code: "a", label: "A", score: 20 }, { code: "b", label: "B", score: 20 }] })).toHaveLength(2));
});
