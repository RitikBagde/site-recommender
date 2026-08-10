"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Crown } from "lucide-react";
import { useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const CLOUDFRONT_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.6, ease } },
});

export function HeroBanner() {
  const [videoSrc, setVideoSrc] = useState(CLOUDFRONT_URL);

  return (
    <section className="relative min-h-[260px] overflow-hidden md:min-h-[320px] lg:min-h-[35vh]">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 size-full object-cover object-[50%_35%]"
        src={videoSrc}
        onError={() => setVideoSrc("/assets/turtleninja1.mp4")}
      />

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/75 to-transparent" />

      <div className="relative z-20 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-4 py-8 lg:px-6">
        <motion.span {...fadeUp(0)} className="mb-3 block text-[10px] font-inter uppercase tracking-[0.25em] text-white/80 sm:text-xs">
          <Crown className="mr-2 inline size-3.5 text-white/80" />
          WHERE WATCH COLLECTIVE
        </motion.span>

        <motion.h1
          {...fadeUp(0.2)}
          className="text-3xl font-bold uppercase leading-none tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--font-podium)" }}
        >
          FIND. SELECT. STREAM.
        </motion.h1>

        <motion.p
          {...fadeUp(0.4)}
          className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 font-inter sm:text-sm"
        >
          We aggregate all streaming sources so you don&apos;t have to hunt — <strong>You just watch</strong>.
        </motion.p>

        <motion.div {...fadeUp(0.4)} className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => document.getElementById("streaming-directory")?.scrollIntoView({ behavior: "smooth" })}
            className="flex w-fit items-center gap-1.5 rounded bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-black transition-colors hover:bg-neutral-200"
          >
            FIND YOUR STREAM
            <ArrowUpRight className="size-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-white/60 sm:inline">
              Join the community
            </span>
            {/* <a
              href="https://www.reddit.com/r/WhereWatch/s/3lWfRIpUCW"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Reddit community"
              className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:border-white/70 hover:bg-white hover:text-black"
            >
              <RedditIcon className="size-4" />
            </a> */}
            <a
              href="https://discord.gg/tH7DsujP84"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Discord server"
              className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:border-white/70 hover:bg-[#5865F2] hover:text-white"
            >
              <DiscordIcon className="size-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12.015a2.188 2.188 0 0 0-2.188-2.188c-.567 0-1.087.216-1.479.571a10.8 10.8 0 0 0-5.87-1.87l.996-4.687 3.292.702a1.562 1.562 0 1 0 .164-.766l-3.618-.77a.37.37 0 0 0-.434.27l-1.132 5.289a10.81 10.81 0 0 0-5.918 1.879 2.18 2.18 0 0 0-1.44-.576 2.188 2.188 0 1 0 2.067 3.017 10.86 10.86 0 0 0 0 1.851c.15 2.434 2.47 4.309 5.481 4.309 3.014 0 5.333-1.875 5.481-4.309a10.86 10.86 0 0 0 0-1.851 2.19 2.19 0 0 0 .352-.828 2.19 2.19 0 0 0-.002-2.086l.005.001zm-13.242 2.66a1.465 1.465 0 1 1 2.93 0 1.465 1.465 0 0 1-2.93 0zm7.704 4.422c-.556.554-1.764.81-2.462.81-.698 0-1.906-.256-2.462-.81a.35.35 0 0 1 .495-.495c.334.333 1.607.63 1.967.63.36 0 1.633-.297 1.967-.63a.35.35 0 0 1 .495.495zm-.628-2.957a1.465 1.465 0 1 1 0-2.93 1.465 1.465 0 0 1 0 2.93z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
