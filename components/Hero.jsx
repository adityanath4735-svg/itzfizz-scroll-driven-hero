"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
  const containerRef = useRef(null);
  const pinnedRef = useRef(null);
  const roadContainerRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const frontWheelRef = useRef(null);
  const rearWheelRef = useRef(null);
  const speedTextRef = useRef(null);
  const progressTextRef = useRef(null);
  const gearTextRef = useRef(null);
  const scrollPromptRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioCtxRef = useRef(null);
  const engineNodeRef = useRef(null);

  // Sound generator using Web Audio API for futuristic electric hypercar hum
  const toggleAudio = () => {
    if (!audioEnabled) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(65, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(260, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        engineNodeRef.current = { osc, filter, gain };
        setAudioEnabled(true);
      } catch {
        console.warn("Web Audio not supported");
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
        engineNodeRef.current = null;
      }
      setAudioEnabled(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const road = roadContainerRef.current;
      const car = carRef.current;
      const trail = trailRef.current;

      const calculateDistance = () => {
        if (!road || !car) return 800;
        const roadWidth = road.offsetWidth;
        const carWidth = car.offsetWidth;
        return roadWidth - carWidth;
      };

      const distance = calculateDistance();

      // Master Scroll-Driven Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2600",
          pin: pinnedRef.current,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const currentSpeed = Math.round(p * 348);
            const currentPercent = Math.round(p * 100);

            if (speedTextRef.current) {
              speedTextRef.current.textContent = `${currentSpeed} KM/H`;
            }
            if (progressTextRef.current) {
              progressTextRef.current.textContent = `${currentPercent.toString().padStart(2, "0")}%`;
            }
            if (gearTextRef.current) {
              let gear = "1";
              if (p > 0.85) gear = "7";
              else if (p > 0.7) gear = "6";
              else if (p > 0.5) gear = "5";
              else if (p > 0.35) gear = "4";
              else if (p > 0.2) gear = "3";
              else if (p > 0.08) gear = "2";
              else if (p < 0.02) gear = "N";
              gearTextRef.current.textContent = `GEAR ${gear}`;
            }

            // Update electric sound pitch based on scroll velocity/progress
            if (engineNodeRef.current && audioCtxRef.current) {
              try {
                const pitch = 70 + p * 240 + Math.abs(self.getVelocity() / 15);
                engineNodeRef.current.osc.frequency.setTargetAtTime(
                  pitch,
                  audioCtxRef.current.currentTime,
                  0.05
                );
              } catch {}
            }
          },
        },
      });

      // 1. Car translation along the road
      tl.to(
        car,
        {
          x: () => calculateDistance(),
          ease: "none",
        },
        0
      );

      // 2. Trail scale matching car position
      tl.to(
        trail,
        {
          scaleX: 1,
          ease: "none",
        },
        0
      );

      // 3. Wheels spinning
      tl.to(
        [frontWheelRef.current, rearWheelRef.current],
        {
          rotation: "+=2880",
          transformOrigin: "center center",
          ease: "none",
        },
        0
      );

      // 4. Headline characters illuminated sequentially
      tl.to(
        ".char",
        {
          opacity: 1,
          stagger: {
            each: 0.02,
            from: "start",
          },
          ease: "power1.inOut",
        },
        0.05
      );

      // 5. Stat cards revealed sequentially at checkpoints
      const statElements = gsap.utils.toArray(".stat-inner");
      statElements.forEach((el, index) => {
        const startPos = 0.15 + index * 0.22;
        tl.to(
          el,
          {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
          },
          startPos
        );
      });

      // 6. Scroll prompt fade out immediately
      tl.to(
        scrollPromptRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.08,
          ease: "power1.out",
        },
        0
      );
    }, containerRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const headlineLetters = "ITZFIZZ PROTO-01".split("");
  const sublineLetters = "BEYOND THE VELOCITY VECTOR".split("");

  const stats = [
    {
      code: "01 // ACCEL",
      title: "0-100 KM/H",
      value: "1.94 SEC",
      desc: "Torque Vectoring AWD",
    },
    {
      code: "02 // VELOCITY",
      title: "TOP SPEED",
      value: "384 KM/H",
      desc: "Active Drag Reduction",
    },
    {
      code: "03 // AERO",
      title: "DOWNFORCE",
      value: "1,250 KG",
      desc: "Ground Effect Tunnels",
    },
    {
      code: "04 // POWERTRAIN",
      title: "SYSTEM PEAK",
      value: "1,420 HP",
      desc: "800V Dual Inverter",
    },
  ];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned Viewport Container */}
      <div
        ref={pinnedRef}
        className="relative flex h-screen w-full flex-col justify-between overflow-hidden px-6 py-6 md:px-14 md:py-10 select-none"
      >
        {/* Subtle Ambient Background Mesh */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 50% 15%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 75%)",
          }}
        />

        {/* TOP BAR / TELEMETRY HUD */}
        <header className="relative z-20 flex items-center justify-between border-b border-[color-mix(in_srgb,var(--fg)_10%,transparent)] pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-[0.25em] text-[var(--fg)]">
                ITZFIZZ
              </span>
              <span className="text-[10px] tracking-widest text-[var(--muted)] uppercase">
                AERO LAB // EXPERIMENTAL
              </span>
            </div>
          </div>

          {/* Center Dynamic Telemetry Display */}
          <div className="hidden sm:flex items-center gap-6 rounded-full border border-[color-mix(in_srgb,var(--fg)_12%,transparent)] bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] px-6 py-2 backdrop-blur-md">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-medium tracking-wider text-[var(--muted)]">
                SPEED:
              </span>
              <span
                ref={speedTextRef}
                className="font-mono text-sm font-semibold tabular-nums tracking-wide text-[var(--accent)]"
              >
                0 KM/H
              </span>
            </div>
            <div className="h-3 w-[1px] bg-[color-mix(in_srgb,var(--fg)_15%,transparent)]" />
            <div className="flex items-baseline gap-1.5">
              <span
                ref={gearTextRef}
                className="font-mono text-xs font-semibold tracking-wider text-[var(--fg)]"
              >
                GEAR N
              </span>
            </div>
            <div className="h-3 w-[1px] bg-[color-mix(in_srgb,var(--fg)_15%,transparent)]" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-medium tracking-wider text-[var(--muted)]">
                STATUS:
              </span>
              <span className="text-xs font-medium tracking-wider text-emerald-400">
                OPTIMAL
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--fg)_14%,transparent)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)]"
              aria-label="Toggle hypercar engine sound"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  audioEnabled ? "bg-emerald-400" : "bg-[var(--muted)]"
                }`}
              />
              <span className="hidden md:inline font-mono text-[11px] tracking-wider">
                {audioEnabled ? "AUDIO ON" : "AUDIO SFX"}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-[var(--muted)]">
                JOURNEY
              </span>
              <span
                ref={progressTextRef}
                className="font-mono text-xs font-bold tabular-nums text-[var(--fg)]"
              >
                00%
              </span>
            </div>
          </div>
        </header>

        {/* HEADLINE SECTION (Split Characters) */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-2">
          <p className="mb-2 text-xs md:text-sm font-mono tracking-[0.35em] text-[var(--muted)] uppercase">
            {sublineLetters.map((char, index) => (
              <span key={index} className="char inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-none">
            {headlineLetters.map((char, index) => (
              <span
                key={index}
                className="char inline-block transition-transform duration-200"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
        </div>

        {/* ROADWAY & VEHICLE ARENA */}
        <div
          ref={roadContainerRef}
          className="relative z-15 w-full my-6 flex flex-col justify-end"
        >
          {/* THE CAR */}
          <div
            ref={carRef}
            className="relative z-20 w-[190px] sm:w-[230px] md:w-[260px] select-none"
            style={{ marginBottom: "-1px" }}
          >
            <svg
              viewBox="0 0 260 70"
              className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Headlight beam linear gradient */}
                <linearGradient
                  id="headlightBeam"
                  x1="0%"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                >
                  <stop offset="0%" stopColor="#fff8e7" stopOpacity="0.8" />
                  <stop offset="35%" stopColor="#ffb347" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
                </linearGradient>

                {/* Car metallic body gradient */}
                <linearGradient
                  id="bodyGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#2c2d30" />
                  <stop offset="45%" stopColor="#17181c" />
                  <stop offset="100%" stopColor="#0c0d0f" />
                </linearGradient>

                {/* Windshield glass reflection */}
                <linearGradient
                  id="glassGradient"
                  x1="30%"
                  y1="0%"
                  x2="70%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8d9ba8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#1a2430" stopOpacity="0.9" />
                </linearGradient>

                {/* Taillight glow filter */}
                <filter
                  id="taillightGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* PROJECTOR HEADLIGHT BEAM (Casting light forward) */}
              <polygon
                points="255,42 430,30 430,62 255,48"
                fill="url(#headlightBeam)"
                className="opacity-75 mix-blend-screen pointer-events-none"
              />

              {/* CAR UNDERGLOW REFLECTION */}
              <ellipse
                cx="130"
                cy="62"
                rx="105"
                ry="4"
                fill="var(--accent)"
                opacity="0.35"
                filter="blur(3px)"
              />

              {/* CAR REAR DIFFUSER & LOWER AERO BODY */}
              <path
                d="M10,56 L248,56 L254,51 L242,48 L18,48 L10,56 Z"
                fill="#121315"
                stroke="#333"
                strokeWidth="0.5"
              />

              {/* REAR GT SPOILER WING */}
              <path
                d="M8,26 L36,25 L34,22 L4,23 Z"
                fill="#ff5a1f"
                stroke="#e04e18"
                strokeWidth="0.5"
              />
              <path d="M12,25 L16,42" stroke="#444" strokeWidth="2.5" />
              <path d="M28,25 L30,42" stroke="#444" strokeWidth="2.5" />

              {/* MAIN BODYWORK AERODYNAMIC SHELL */}
              <path
                d="M10,48 C16,45 28,43 38,43 C42,43 50,44 54,46 C58,38 72,25 96,22 C125,18 162,23 186,34 C198,39 220,43 234,44 C244,45 252,48 254,51 L248,56 L18,56 Z"
                fill="url(#bodyGradient)"
                stroke="color-mix(in srgb, var(--fg) 18%, transparent)"
                strokeWidth="0.8"
              />

              {/* AERODYNAMIC ROOF & CABIN GLASS */}
              <path
                d="M86,33 C96,24 116,21 142,22 C162,23 174,27 182,34 Z"
                fill="url(#glassGradient)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.5"
              />

              {/* CARBON FIBER ACCENT STRIPE */}
              <path
                d="M38,44 L236,45"
                stroke="var(--accent)"
                strokeWidth="1.2"
                opacity="0.9"
              />

              {/* FRONT HEADLIGHT HOUSING & PROJECTOR LED */}
              <path
                d="M242,45 L254,49 L246,50 Z"
                fill="#ffffff"
                filter="url(#taillightGlow)"
              />

              {/* REAR TAILLIGHT STRIP (Feeds directly into the road trail) */}
              <path
                d="M6,43 L12,43 L10,50 L5,49 Z"
                fill="var(--accent)"
                filter="url(#taillightGlow)"
              />

              {/* REAR WHEEL ASSEMBLY */}
              <g
                ref={rearWheelRef}
                style={{ transformBox: "fill-box", transformOrigin: "52px 55px" }}
              >
                {/* Tire */}
                <circle cx="52" cy="55" r="14" fill="#0d0e10" stroke="#25262a" strokeWidth="2" />
                {/* Rim */}
                <circle cx="52" cy="55" r="9.5" fill="#1b1c20" stroke="#4a4c52" strokeWidth="1" />
                {/* Brake Caliper */}
                <rect x="49" y="47" width="6" height="3" rx="1" fill="var(--accent)" />
                {/* Spokes */}
                <line x1="52" y1="46" x2="52" y2="64" stroke="#8d8a84" strokeWidth="1.2" />
                <line x1="43" y1="55" x2="61" y2="55" stroke="#8d8a84" strokeWidth="1.2" />
                <line x1="46" y1="49" x2="58" y2="61" stroke="#8d8a84" strokeWidth="1.2" />
                <line x1="46" y1="61" x2="58" y2="49" stroke="#8d8a84" strokeWidth="1.2" />
                {/* Hub */}
                <circle cx="52" cy="55" r="2.5" fill="var(--accent)" />
              </g>

              {/* FRONT WHEEL ASSEMBLY */}
              <g
                ref={frontWheelRef}
                style={{ transformBox: "fill-box", transformOrigin: "208px 55px" }}
              >
                {/* Tire */}
                <circle cx="208" cy="55" r="14" fill="#0d0e10" stroke="#25262a" strokeWidth="2" />
                {/* Rim */}
                <circle cx="208" cy="55" r="9.5" fill="#1b1c20" stroke="#4a4c52" strokeWidth="1" />
                {/* Brake Caliper */}
                <rect x="205" y="47" width="6" height="3" rx="1" fill="var(--accent)" />
                {/* Spokes */}
                <line x1="208" y1="46" x2="208" y2="64" stroke="#8d8a84" strokeWidth="1.2" />
                <line x1="199" y1="55" x2="217" y2="55" stroke="#8d8a84" strokeWidth="1.2" />
                <line x1="202" y1="49" x2="214" y2="61" stroke="#8d8a84" strokeWidth="1.2" />
                <line x1="202" y1="61" x2="214" y2="49" stroke="#8d8a84" strokeWidth="1.2" />
                {/* Hub */}
                <circle cx="208" cy="55" r="2.5" fill="var(--accent)" />
              </g>
            </svg>
          </div>

          {/* THE ROADWAY (Pure CSS base line + dashed lane markings + glowing trail) */}
          <div className="road w-full relative">
            {/* Dashed Lane Markings */}
            <div className="road-lane pointer-events-none" />

            {/* Glowing Orange Neon Trail (GSAP animates scaleX: 1) */}
            <div
              ref={trailRef}
              className="trail absolute inset-0 h-[2px] w-full pointer-events-none shadow-[0_0_14px_var(--accent)]"
            />
          </div>
        </div>

        {/* STATS SECTION (GSAP animates each .stat-inner from 0.12 to 1) */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 pt-3">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--fg)_10%,transparent)] bg-[color-mix(in_srgb,var(--fg)_3%,transparent)] p-4 backdrop-blur-md transition-all duration-300 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
            >
              <div className="stat-inner flex flex-col justify-between h-full transition-opacity duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] tracking-widest text-[var(--muted)]">
                    {stat.code}
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] opacity-60" />
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-wider text-[var(--muted)] uppercase">
                    {stat.title}
                  </p>
                  <p className="font-mono text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[var(--fg)] mt-0.5">
                    {stat.value}
                  </p>
                </div>
                <p className="mt-2 text-[10px] tracking-wide text-[var(--muted)] border-t border-[color-mix(in_srgb,var(--fg)_8%,transparent)] pt-2">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SCROLL INSTRUCTION PROMPT */}
        <div
          ref={scrollPromptRef}
          className="relative z-20 flex items-center justify-center pt-3 text-[var(--muted)]"
        >
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase">
            <svg
              className="h-3.5 w-3.5 animate-bounce text-[var(--accent)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <span>SCROLL TO ACCELERATE JOURNEY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
