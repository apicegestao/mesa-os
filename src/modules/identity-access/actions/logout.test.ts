import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ signOut: vi.fn(), redirect: vi.fn() }));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/shared/infrastructure/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({ auth: { signOut: mocks.signOut } })),
}));

import { logout, logoutToOpsLogin } from "./logout";

describe("logout actions", () => {
  beforeEach(() => {
    mocks.signOut.mockReset().mockResolvedValue({ error: null });
    mocks.redirect.mockReset();
  });

  it("returns member sign-out to the member login", async () => {
    await logout();
    expect(mocks.signOut).toHaveBeenCalledOnce();
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
  });

  it("returns an account switch to the segregated internal login", async () => {
    await logoutToOpsLogin();
    expect(mocks.signOut).toHaveBeenCalledOnce();
    expect(mocks.redirect).toHaveBeenCalledWith("/ops/login");
  });
});
