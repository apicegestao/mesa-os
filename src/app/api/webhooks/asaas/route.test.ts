import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient,
}));

vi.mock("@/shared/config/env", () => ({
  getPublicEnv: () => ({ NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co" }),
}));

vi.mock("@/shared/observability/logger", () => ({ log: vi.fn() }));

import { POST } from "./route";

const webhookToken = "a".repeat(32);
const event = {
  id: "event-123",
  event: "PAYMENT_CONFIRMED",
  payment: {
    id: "payment-123",
    checkoutSession: "935c6898-97d1-452b-a3d6-1805329eb045",
    value: 5,
  },
};

function request(headers: HeadersInit = {}) {
  return new Request("https://mesa.test/api/webhooks/asaas", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(event),
  });
}

describe("Asaas webhook", () => {
  beforeEach(() => {
    process.env.ASAAS_WEBHOOK_TOKEN = webhookToken;
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    mocks.createClient.mockReturnValue({ rpc: mocks.rpc });
  });

  afterEach(() => {
    delete process.env.ASAAS_WEBHOOK_TOKEN;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    mocks.rpc.mockReset();
    mocks.createClient.mockReset();
  });

  it("rejeita eventos sem o token de webhook", async () => {
    const response = await POST(request());

    expect(response.status).toBe(401);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("retoma o provisionamento para uma entrega financeira duplicada", async () => {
    mocks.rpc
      .mockResolvedValueOnce({ data: "duplicate", error: null })
      .mockResolvedValueOnce({ data: "enrollment-123", error: null });
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(request({ "asaas-access-token": webhookToken }));

    expect(response.status).toBe(200);
    expect(mocks.rpc).toHaveBeenNthCalledWith(2, "prepare_finance_access_provisioning", {
      target_checkout_session_id: event.payment.checkoutSession,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.supabase.co/functions/v1/provision-authorized-enrollment",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
