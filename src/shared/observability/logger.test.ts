import { afterEach, expect, it, vi } from "vitest";
import { log } from "./logger";

afterEach(() => vi.restoreAllMocks());

it("emite log estruturado sem dados implícitos", () => {
  const output = vi.spyOn(console, "info").mockImplementation(() => undefined);
  log("info", "foundation.ready", { module: "foundation" });
  expect(output).toHaveBeenCalledWith(expect.stringContaining('"message":"foundation.ready"'));
});
