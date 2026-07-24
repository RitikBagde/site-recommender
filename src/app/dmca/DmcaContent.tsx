"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { DmcaPayload } from "@/types";
import { AlertTriangle, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialValues: DmcaPayload = {
  fullName: "",
  email: "",
  description: "",
  infringingUrls: "",
  copyrightedWork: "",
  signature: "",
};

export function DmcaContent() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to directory
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border bg-brand-surface">
              <Shield className="h-5 w-5 text-brand-glow" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary sm:text-2xl">DMCA Policy</h1>
              <p className="text-sm text-muted">Copyright Takedown Requests</p>
            </div>
          </div>

          <p className="leading-7 text-muted">
            We take intellectual property rights seriously and comply with the Digital Millennium Copyright Act (DMCA). If you believe content linked from our site infringes your copyright, follow the procedure below.
          </p>
          <p className="mt-2 leading-7 text-muted/70">
            Please Note: WhereWatch is a directory service that provides links to third-party sites. We do not host, store, or control any content.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">How We Handle DMCA Requests</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { step: "1", title: "Review", desc: "We review all valid DMCA requests submitted via email." },
              { step: "2", title: "Verify", desc: "We verify that all required information is included." },
              { step: "3", title: "Action", desc: "We remove links to infringing content when appropriate." },
              { step: "4", title: "Notify", desc: "We notify you of the action taken on your request." },
            ].map((item) => (
              <div key={item.step} className="rounded-lg border border-brand-border/50 bg-brand-surface/50 p-3.5">
                <div className="mb-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-glow/15 text-xs font-bold text-brand-glow">
                  {item.step}
                </div>
                <p className="text-sm font-medium text-primary">{item.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">DMCA Request Requirements</h2>
          <div className="space-y-3 rounded-lg border border-brand-border/50 bg-brand-surface/30 p-4 text-sm leading-6 text-muted sm:p-5">
            {[
              { num: "1", label: "Description of Copyrighted Work", text: "A description of the copyrighted work that you claim is being infringed." },
              { num: "2", label: "Location of Infringing Material", text: "The URL(s) or location of the material you claim is infringing, with enough detail to locate it." },
              { num: "3", label: "Your Contact Information", text: "Your name, title (if acting as an agent), address, telephone number, and email address." },
              { num: "4", label: "Good Faith Statement", text: "\u201CI have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law.\u201D", italic: true },
              { num: "5", label: "Accuracy Statement", text: "\u201CThe information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner.\u201D", italic: true },
              { num: "6", label: "Legal Accountability Statement", text: "\u201CI understand that I am subject to legal action upon submitting a DMCA request without solid proof.\u201D", italic: true },
              { num: "7", label: "Signature", text: "An electronic or physical signature of the copyright owner or an authorized agent." },
            ].map((item) => (
              <div key={item.num} className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-xs font-bold text-brand-glow">{item.num}</span>
                <div>
                  <span className="font-medium text-primary">{item.label}</span>
                  <p className={item.italic ? "italic text-muted/80" : ""}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-brand-border pt-8">
          {!formOpen ? (
            <div className="text-center">
              <h2 className="mb-2 text-lg font-bold text-primary">File a DMCA Complaint</h2>
              <p className="mb-5 text-sm text-muted">
                If you believe your copyrighted work has been infringed, click below to submit a takedown request.
              </p>
              <Button variant="accent" onClick={() => setFormOpen(true)}>
                <AlertTriangle className="h-4 w-4" strokeWidth={1.5} />
                File a DMCA Complaint
              </Button>
            </div>
          ) : (
            <DmcaComplaintForm onClose={() => setFormOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

function DmcaComplaintForm({ onClose }: { onClose: () => void }) {
  const [values, setValues] = useState<DmcaPayload>(initialValues);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!values.fullName.trim() || !values.email.trim() || !values.description.trim() || !values.signature.trim()) {
      setMessage("Please fill in all required fields.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "complaint",
          payload: {
            ...values,
            fullName: values.fullName.trim(),
            email: values.email.trim(),
            description: values.description.trim(),
            infringingUrls: values.infringingUrls.trim() || undefined,
            copyrightedWork: values.copyrightedWork.trim() || undefined,
            signature: values.signature.trim(),
          },
          submittedAt: new Date().toISOString(),
        }),
      });

      const result = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok && response.status !== 202) {
        throw new Error(result.message || "Submission failed.");
      }

      setStatus("success");
      setMessage(result.message);
      setValues(initialValues);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit complaint.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-brand-border/50 bg-brand-surface/30 p-6 text-center">
        <p className="text-sm text-primary">{message}</p>
        <div className="mt-4 flex justify-center gap-3">
          <Button onClick={() => setStatus("idle")}>Submit another</Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-primary">Submit a DMCA Complaint</h2>
          <p className="mt-1 text-sm text-muted">Fill out the form below to file a copyright takedown request.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="fullName" value={values.fullName} onChange={(e) => setValues((c) => ({ ...c, fullName: e.target.value }))} placeholder="Your legal name" required />
          <Field label="Email address" name="email" value={values.email} onChange={(e) => setValues((c) => ({ ...c, email: e.target.value }))} placeholder="you@example.com" type="email" required />
        </div>

        <div>
          <label htmlFor="dmca-copyrighted-work" className="mb-2 block text-xs font-medium text-muted">Description of copyrighted work</label>
          <Textarea id="dmca-copyrighted-work" value={values.copyrightedWork} onChange={(e) => setValues((c) => ({ ...c, copyrightedWork: e.target.value }))} placeholder="Describe the copyrighted work you claim is being infringed." />
        </div>

        <div>
          <label htmlFor="dmca-infringing-urls" className="mb-2 block text-xs font-medium text-muted">Location of infringing material</label>
          <Textarea id="dmca-infringing-urls" value={values.infringingUrls} onChange={(e) => setValues((c) => ({ ...c, infringingUrls: e.target.value }))} placeholder="URL(s) of the allegedly infringing content, with enough detail to locate it." />
        </div>

        <div>
          <label htmlFor="dmca-description" className="mb-2 block text-xs font-medium text-muted">Description of infringement</label>
          <Textarea id="dmca-description" value={values.description} onChange={(e) => setValues((c) => ({ ...c, description: e.target.value }))} placeholder="Explain how the content infringes your copyright." required />
        </div>

        <Field label="Electronic signature" name="signature" value={values.signature} onChange={(e) => setValues((c) => ({ ...c, signature: e.target.value }))} placeholder="Type your full legal name as your electronic signature" required />

        <div className="rounded-lg border border-brand-border/50 bg-brand-bg/50 p-4 text-xs leading-6 text-muted">
          <p className="mb-1 font-medium text-primary">By submitting this complaint, you affirm:</p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>You have a good faith belief that the use of the material is not authorized.</li>
            <li>The information in this notice is accurate and, under penalty of perjury, you are the owner or authorized to act on behalf of the owner.</li>
            <li>You understand that you are subject to legal action upon submitting a DMCA request without solid proof.</li>
          </ul>
        </div>

        {status === "error" && <p className="text-sm text-brand-purple" role="alert">{message}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="accent" disabled={status === "submitting"}>
            {status === "submitting" ? "Submitting..." : "Submit complaint"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to top
          </Button>
        </div>
      </form>
    </div>
  );
}