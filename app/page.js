import Hero from "../components/Hero";

export default function Page() {
  return (
    <main>
      <Hero />
      <section className="flex min-h-svh items-center justify-center px-6">
        <p className="max-w-xl text-center text-2xl font-light leading-relaxed text-[var(--muted)]">
          The journey ends here. Normal scrolling resumes.
        </p>
      </section>
    </main>
  );
}
