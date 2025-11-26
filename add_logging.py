# -*- coding: utf-8 -*-
import sys

# Read the current file
with open(r"D:\UpgrowPlan\upgrowplan\app\solutions\marketResearch\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Find and replace the handleSubmit function to add logging
old_submit_start = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);"""

new_submit_start = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    console.log("[Market Research] Starting research submission...");
    console.log("[Market Research] Form data:", formData);"""

content = content.replace(old_submit_start, new_submit_start)

# Add logging to fetch call
old_fetch = """      const response = await fetch("http://localhost:8002/api/v1/research/from-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });"""

new_fetch = """      console.log("[Market Research] Sending request to market-research-service...");
      console.log("[Market Research] Request data:", requestData);

      const response = await fetch("http://localhost:8002/api/v1/research/from-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      console.log("[Market Research] Response status:", response.status);"""

content = content.replace(old_fetch, new_fetch)

# Add logging after getting result
old_result = """      const result = await response.json();
      setResearchId(result.research_id);
      setResearchStatus(result);
      pollResearchStatus(result.research_id);"""

new_result = """      const result = await response.json();
      console.log("[Market Research] Research started with ID:", result.research_id);
      console.log("[Market Research] Initial status:", result);
      setResearchId(result.research_id);
      setResearchStatus(result);
      pollResearchStatus(result.research_id);"""

content = content.replace(old_result, new_result)

# Add logging to pollResearchStatus
old_poll_start = """  const pollResearchStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8002/api/v1/research/${id}`);
        const status: ResearchStatus = await response.json();
        setResearchStatus(status);"""

new_poll_start = """  const pollResearchStatus = async (id: string) => {
    console.log("[Market Research] Starting status polling for ID:", id);
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8002/api/v1/research/${id}`);
        const status: ResearchStatus = await response.json();
        console.log("[Market Research] Status update:", {
          status: status.status,
          progress: status.progress,
          current_stage: status.current_stage
        });
        setResearchStatus(status);"""

content = content.replace(old_poll_start, new_poll_start)

# Add logging when completed
old_completed = """        if (status.status === "completed") {
          clearInterval(interval);
          setIsSubmitting(false);
          fetchResearchReport(id);"""

new_completed = """        if (status.status === "completed") {
          console.log("[Market Research] Research completed! Fetching report...");
          clearInterval(interval);
          setIsSubmitting(false);
          fetchResearchReport(id);"""

content = content.replace(old_completed, new_completed)

# Add logging to fetchResearchReport
old_fetch_report = """  const fetchResearchReport = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8002/api/v1/research/${id}/report`);
      const report: ResearchReport = await response.json();
      setResearchReport(report);"""

new_fetch_report = """  const fetchResearchReport = async (id: string) => {
    console.log("[Market Research] Fetching research report for ID:", id);
    try {
      const response = await fetch(`http://localhost:8002/api/v1/research/${id}/report`);
      const report: ResearchReport = await response.json();
      console.log("[Market Research] Report received:", {
        has_executive_summary: !!report.executive_summary,
        has_market_size: !!report.market_size,
        has_competitive_landscape: !!report.competitive_landscape,
        segments_count: report.target_segments?.length || 0
      });
      setResearchReport(report);"""

content = content.replace(old_fetch_report, new_fetch_report)

# Write the updated content back
with open(r"D:\UpgrowPlan\upgrowplan\app\solutions\marketResearch\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Logging added successfully!")
