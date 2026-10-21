import test from "node:test";
import assert from "node:assert/strict";

test("next config allows loopback dev origins alongside LAN access", async () => {
  const { default: nextConfig } = await import("../../next.config.mjs");

  assert.deepEqual(nextConfig.allowedDevOrigins, ["localhost", "127.0.0.1", "192.168.0.250"]);
});

test("Arena embedding opts in to the sandbox development origin", async () => {
  const originalEmbed = process.env.DASHBOARD_ALLOW_EMBED;
  process.env.DASHBOARD_ALLOW_EMBED = "arena";
  try {
    const { default: nextConfig } = await import("../../next.config.mjs?arena-origins");
    assert.deepEqual(nextConfig.allowedDevOrigins, [
      "localhost",
      "127.0.0.1",
      "192.168.0.250",
      "*.e2b.app",
    ]);
  } finally {
    if (originalEmbed === undefined) delete process.env.DASHBOARD_ALLOW_EMBED;
    else process.env.DASHBOARD_ALLOW_EMBED = originalEmbed;
  }
});
