"use client";

import React from "react";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { SearchMetricsDashboard } from "./SearchMetricsDashboard";
import { ExportReportButton } from "./ExportReportButton";

// SEO-аналитика: посещаемость сайта + поисковые показатели Google/Bing.
// Визиты AI-ботов живут только во вкладке GEO Visibility.
export const SeoAnalyticsDashboard: React.FC = () => (
  <div>
    <div className="d-flex justify-content-end mb-4">
      <ExportReportButton />
    </div>

    <AnalyticsDashboard />

    <hr className="my-5" />

    <SearchMetricsDashboard />
  </div>
);
