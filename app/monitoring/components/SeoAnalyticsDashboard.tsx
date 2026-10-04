"use client";

import React from "react";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { SearchMetricsDashboard } from "./SearchMetricsDashboard";
import { ExportReportButton } from "./ExportReportButton";

// SEO-аналитика: посещаемость сайта + поисковые показатели Google/Bing.
// Визиты AI-ботов живут только во вкладке GEO Visibility.
export const SeoAnalyticsDashboard: React.FC = () => (
  <div>
    <AnalyticsDashboard headerAction={<ExportReportButton />} />

    <hr className="my-5" />

    <SearchMetricsDashboard />
  </div>
);
