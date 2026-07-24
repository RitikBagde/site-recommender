import type { FeedbackSubmission } from "@/types";

function formatEmailHtml(submission: FeedbackSubmission): string {
  const { type, payload, submittedAt } = submission;
  const time = new Date(submittedAt).toLocaleString();

  if (type === "suggestion") {
    const p = payload as FeedbackSubmission["payload"] & { platformName: string; url: string; category: string; notes?: string };
    return `
      <h2>New Platform Suggestion</h2>
      <table>
        <tr><td><strong>Platform:</strong></td><td>${p.platformName}</td></tr>
        <tr><td><strong>URL:</strong></td><td><a href="${p.url}">${p.url}</a></td></tr>
        <tr><td><strong>Category:</strong></td><td>${p.category}</td></tr>
        ${p.notes ? `<tr><td><strong>Notes:</strong></td><td>${p.notes}</td></tr>` : ""}
        <tr><td><strong>Submitted:</strong></td><td>${time}</td></tr>
      </table>
    `;
  }

  const p = payload as FeedbackSubmission["payload"] & { platformName: string; url: string; issueType: string; description: string };
  return `
    <h2>New Link Report</h2>
    <table>
      <tr><td><strong>Platform:</strong></td><td>${p.platformName}</td></tr>
      <tr><td><strong>URL:</strong></td><td><a href="${p.url}">${p.url}</a></td></tr>
      <tr><td><strong>Issue Type:</strong></td><td>${p.issueType}</td></tr>
      <tr><td><strong>Description:</strong></td><td>${p.description}</td></tr>
      <tr><td><strong>Submitted:</strong></td><td>${time}</td></tr>
    </table>
  `;
}

export async function sendFeedbackEmail(
  submission: FeedbackSubmission,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FEEDBACK_EMAIL_TO;
  const from = process.env.FEEDBACK_EMAIL_FROM;

  if (!apiKey || !to || !from) return false;

  const platformName =
    "platformName" in submission.payload
      ? (submission.payload as { platformName: string }).platformName
      : "Unknown";
  const subject =
    submission.type === "suggestion"
      ? `[WhereWatch] New Suggestion: ${platformName}`
      : `[WhereWatch] New Report: ${platformName}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html: formatEmailHtml(submission),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[WhereWatch] Resend API error:", res.status, body);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[WhereWatch] Resend send failed:", err);
    return false;
  }
}
