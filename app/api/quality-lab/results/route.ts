import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const QUALITY_LAB_RESULTS = path.join(
  process.cwd(),
  "..",
  "quality_lab",
  "results"
);

function readJsonSafe(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function GET() {
  const summaryPath = path.join(
    QUALITY_LAB_RESULTS,
    "market_research_summary.json"
  );
  const bugLogPath = path.join(
    QUALITY_LAB_RESULTS,
    "market_research_summary_bug_log.json"
  );

  const summary = readJsonSafe(summaryPath);
  const bugLog = readJsonSafe(bugLogPath);

  if (!summary) {
    return NextResponse.json(
      {
        error: "No results found. Run quality lab first.",
        results_path: summaryPath,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ summary, bugLog });
}
