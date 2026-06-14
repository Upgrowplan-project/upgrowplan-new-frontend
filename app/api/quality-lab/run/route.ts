import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

const QUALITY_LAB_DIR = path.join(process.cwd(), "..", "quality_lab");

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const service = body.service || "market_research";
  const suite = body.suite || "smoke";
  const mode = body.mode || "auto";
  const noCacheFlag = body.no_cache ? ["--no-cache"] : [];

  const args = [
    "run_quality_lab.py",
    "--service", service,
    "--suite", suite,
    "--mode", mode,
    ...noCacheFlag,
  ];

  return new Promise<NextResponse>((resolve) => {
    const proc = spawn("python", args, {
      cwd: QUALITY_LAB_DIR,
      detached: true,
      stdio: "ignore",
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });

    proc.unref();

    const pid = proc.pid;
    const startedAt = new Date().toISOString();

    proc.on("error", (err) => {
      resolve(
        NextResponse.json(
          { ok: false, error: err.message },
          { status: 500 }
        )
      );
    });

    // Respond immediately — test runs in background
    resolve(
      NextResponse.json({
        ok: true,
        pid,
        service,
        suite,
        mode,
        started_at: startedAt,
        message: `Test run started (PID ${pid}). Results will update in ~/quality_lab/results/.`,
      })
    );
  });
}
