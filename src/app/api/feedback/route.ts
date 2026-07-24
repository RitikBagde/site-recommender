import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  hasErrors,
  validateReportLink,
  validateSuggestion,
} from "@/lib/validation";
import type {
  DmcaPayload,
  FeedbackSubmission,
  FeedbackType,
  ReportLinkPayload,
  SuggestionPayload,
} from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FeedbackSubmission;

    if (!body?.type || !body?.payload) {
      return NextResponse.json(
        { ok: false, message: "Invalid submission payload." },
        { status: 400 },
      );
    }

    const errors =
      body.type === "suggestion"
        ? validateSuggestion(body.payload as SuggestionPayload)
        : body.type === "report"
          ? validateReportLink(body.payload as ReportLinkPayload)
          : {};

    if (hasErrors(errors)) {
      return NextResponse.json(
        { ok: false, message: "Validation failed.", errors },
        { status: 422 },
      );
    }

    const submission: FeedbackSubmission = {
      type: body.type as FeedbackType,
      payload: body.payload,
      submittedAt: new Date().toISOString(),
    };

    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.from("feedback_submissions").insert({
        type: submission.type,
        payload: submission.payload,
        submitted_at: submission.submittedAt,
      });

      if (error) {
        console.error("[WhereWatch] Feedback insert failed:", error.message);
        return NextResponse.json(
          {
            ok: true,
            message:
              "Feedback received locally. Cloud sync is temporarily unavailable.",
            persisted: false,
          },
          { status: 202 },
        );
      }

      return NextResponse.json({
        ok: true,
        message: "Thank you — your feedback was submitted.",
        persisted: true,
      });
    }

    console.info("[WhereWatch] Feedback captured (local mode):", submission);

    return NextResponse.json({
      ok: true,
      message: "Thank you — your feedback was recorded.",
      persisted: false,
    });
  } catch (error) {
    console.error("[WhereWatch] Feedback route error:", error);
    return NextResponse.json(
      { ok: false, message: "Unable to process feedback right now." },
      { status: 500 },
    );
  }
}
