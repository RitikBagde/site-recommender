"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Crown } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.6, ease } },
});

export function HeroBanner() {
  return (
    <section className="relative min-h-[260px] overflow-hidden md:min-h-[320px] lg:min-h-[35vh]">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 size-full object-cover"
        src="/assets/turtleninja1.mp4"
        // src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4"
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

        <motion.div {...fadeUp(0.4)} className="mt-4">
          <button
            type="button"
            onClick={() => document.getElementById("streaming-directory")?.scrollIntoView({ behavior: "smooth" })}
            className="flex w-fit items-center gap-1.5 rounded bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-black transition-colors hover:bg-neutral-200"
          >
            FIND YOUR STREAM
            <ArrowUpRight className="size-3.5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
