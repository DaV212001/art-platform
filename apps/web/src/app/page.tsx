import Link from 'next/link';
import { ArrowRight, Sparkles, Target, Users, GitBranch, Star, TrendingUp, Zap } from 'lucide-react';

const STATS = [
  { value: '2,400+', label: 'Exercises completed' },
  { value: '98%', label: 'Review quality score' },
  { value: '4.2×', label: 'Faster improvement' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose an exercise',
    description: 'Pick a targeted challenge designed around a specific skill. No vague prompts — every exercise has a measurable goal.',
    color: '#7c5cfc',
  },
  {
    step: '02',
    title: 'Create & submit',
    description: 'Work in any tool you love — Procreate, Photoshop, Krita. Upload your piece and add notes on what you struggled with.',
    color: '#5b6ef5',
  },
  {
    step: '03',
    title: 'Get structured feedback',
    description: "Reviewers follow a strict framework — what works, a specific issue, evidence, and a concrete suggestion. No 'nice work!' comments.",
    color: '#34c98b',
  },
  {
    step: '04',
    title: 'Revise & track progress',
    description: 'Submit V2, V3. See your revision chain. Watch your work improve with each iteration in a permanent, visible history.',
    color: '#f5a623',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-4 py-28 text-center overflow-hidden">
        {/* Background glows */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,92,252,0.15) 0%, transparent 70%)', filter: 'blur(2px)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(91,110,245,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 animate-fade-up badge badge-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deliberate Practice Engine for Artists</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-up delay-100"
            style={{
              fontFamily: 'var(--font-plus-jakarta, var(--font-inter))',
              background: 'linear-gradient(145deg, #ffffff 0%, #c4b8ff 50%, #7c5cfc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.05,
            }}
          >
            Stop practicing blind.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #e8e0ff 0%, #a89cff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Start improving.
            </span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200"
            style={{ color: 'var(--color-muted)' }}
          >
            Complete focused exercises, give structured peer feedback,
            and build a measurable track record of artistic growth —
            all in one deliberate practice loop.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
            <Link href="/register" className="btn btn-primary btn-lg">
              Start for free
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <Link href="/exercises" className="btn btn-ghost btn-lg">
              Browse exercises
            </Link>
          </div>

          {/* Social proof stats */}
          <div
            className="inline-grid grid-cols-3 gap-px rounded-2xl overflow-hidden animate-fade-up delay-400"
            style={{ background: 'var(--color-border)' }}
          >
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center px-8 py-4"
                style={{ background: 'var(--color-surface-1)' }}
              >
                <span className="text-2xl font-extrabold" style={{ color: 'var(--color-foreground)' }}>
                  {value}
                </span>
                <span className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        className="px-4 py-24"
        style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface-1)' }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="section-label mb-3">How it works</p>
            <h2
              className="text-3xl md:text-4xl font-extrabold"
              style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}
            >
              The deliberate practice loop
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map(({ step, title, description, color }) => (
              <div
                key={step}
                className="card p-6 relative overflow-hidden group"
                style={{ background: 'var(--color-surface-2)' }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }}
                />
                <div
                  className="text-5xl font-black mb-4 leading-none select-none"
                  style={{ color: `${color}30`, fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}
                >
                  {step}
                </div>
                <h3 className="text-base font-bold mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature highlights ── */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="section-label mb-3">Built differently</p>
            <h2
              className="text-3xl md:text-4xl font-extrabold"
              style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}
            >
              Everything a serious artist needs
            </h2>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* Large card – Structured feedback */}
            <div
              className="md:col-span-7 card p-8 relative overflow-hidden group"
              style={{ background: 'var(--color-surface-1)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: 'radial-gradient(ellipse at top left, rgba(124,92,252,0.08) 0%, transparent 60%)' }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'var(--color-brand-dim)', border: '1px solid var(--color-brand-border)' }}
                >
                  <Target className="w-6 h-6" style={{ color: '#b39fff' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">Structured critiques only</h3>
                <p style={{ color: 'var(--color-muted)', lineHeight: '1.65' }}>
                  Reviewers must identify <strong style={{ color: '#b39fff' }}>what is working</strong>, a <strong style={{ color: '#b39fff' }}>specific issue</strong>, provide <strong style={{ color: '#b39fff' }}>evidence</strong>, and offer a <strong style={{ color: '#b39fff' }}>concrete suggestion</strong>. No "nice work!" or vague criticism allowed.
                </p>

                {/* Preview card */}
                <div
                  className="mt-6 p-4 rounded-xl space-y-3"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                >
                  {[
                    { label: 'What is working', text: 'The overall gesture reads well and the weight shift is believable.', color: '#34c98b' },
                    { label: 'Specific issue', text: 'The left foreshortening of the forearm loses volume mid-way.', color: '#f2547d' },
                    { label: 'Suggestion', text: 'Use the envelope method — sketch a bounding box around the foreshortened limb first.', color: '#7c5cfc' },
                  ].map(({ label, text, color }) => (
                    <div key={label} className="flex gap-3">
                      <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ background: color, minHeight: '40px' }} />
                      <div>
                        <p className="text-xs font-semibold mb-0.5" style={{ color }}>{label}</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Credit economy */}
            <div
              className="md:col-span-5 card p-8 relative overflow-hidden group"
              style={{ background: 'var(--color-surface-1)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: 'radial-gradient(ellipse at bottom right, rgba(245,166,35,0.08) 0%, transparent 60%)' }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'var(--color-credit-dim)', border: '1px solid var(--color-credit-border)' }}
                >
                  <Zap className="w-6 h-6" style={{ color: '#ffc662' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">A balanced credit economy</h3>
                <p style={{ color: 'var(--color-muted)', lineHeight: '1.65' }}>
                  Review others to earn credits. Spend credits to get your own work reviewed. Everyone contributes — no free riders.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { action: 'Write a review', credit: '+5 credits', positive: true },
                    { action: 'Request review', credit: '−3 credits', positive: false },
                  ].map(({ action, credit, positive }) => (
                    <div
                      key={action}
                      className="p-3 rounded-xl text-center"
                      style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                    >
                      <p className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>{action}</p>
                      <p className="font-bold" style={{ color: positive ? '#34c98b' : '#ff82a1' }}>{credit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revision chains */}
            <div
              className="md:col-span-5 card p-8 relative overflow-hidden group"
              style={{ background: 'var(--color-surface-1)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: 'radial-gradient(ellipse at top right, rgba(52,201,139,0.08) 0%, transparent 60%)' }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'var(--color-success-dim)', border: '1px solid rgba(52,201,139,0.25)' }}
                >
                  <GitBranch className="w-6 h-6" style={{ color: '#5ddba3' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">Track every revision</h3>
                <p style={{ color: 'var(--color-muted)', lineHeight: '1.65' }}>
                  Each submission lives in a revision chain. Submit V2 after applying feedback, get new critiques, submit V3. Your entire journey stays visible.
                </p>
                <div className="mt-6 flex items-center gap-2">
                  {['V1', 'V2', 'V3'].map((v, i) => (
                    <div key={v} className="flex items-center gap-2">
                      <div
                        className="px-3 py-1 rounded-lg text-xs font-bold"
                        style={{
                          background: i === 2 ? 'var(--color-success-dim)' : 'var(--color-surface-2)',
                          border: `1px solid ${i === 2 ? 'rgba(52,201,139,0.3)' : 'var(--color-border)'}`,
                          color: i === 2 ? '#5ddba3' : 'var(--color-muted)',
                        }}
                      >
                        {v}
                      </div>
                      {i < 2 && <ArrowRight className="w-3 h-3" style={{ color: 'var(--color-subtle)' }} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reputation */}
            <div
              className="md:col-span-7 card p-8 relative overflow-hidden group"
              style={{ background: 'var(--color-surface-1)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: 'radial-gradient(ellipse at bottom left, rgba(91,110,245,0.08) 0%, transparent 60%)' }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(91,110,245,0.12)', border: '1px solid rgba(91,110,245,0.25)' }}
                >
                  <TrendingUp className="w-6 h-6" style={{ color: '#8fa0ff' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">Per-skill reputation</h3>
                <p style={{ color: 'var(--color-muted)', lineHeight: '1.65' }}>
                  Your reviewer reputation is tracked per skill category. Build trust in Anatomy. Build authority in Perspective. They're separate — and that makes advice more meaningful.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    { skill: 'Perspective', score: 92, color: '#7c5cfc' },
                    { skill: 'Anatomy', score: 78, color: '#5b6ef5' },
                    { skill: 'Composition', score: 61, color: '#8fa0ff' },
                  ].map(({ skill, score, color }) => (
                    <div key={skill}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{skill}</span>
                        <span className="text-xs font-bold" style={{ color }}>{score}</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'var(--color-surface-3)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-4 py-24">
        <div className="container mx-auto max-w-3xl text-center">
          <div
            className="card p-12 relative overflow-hidden"
            style={{ background: 'var(--color-surface-1)' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(124,92,252,0.12) 0%, transparent 70%)' }}
            />
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'var(--color-brand-dim)', border: '1px solid var(--color-brand-border)' }}
              >
                <Star className="w-8 h-8" style={{ color: '#b39fff' }} />
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold mb-4"
                style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}
              >
                Ready to practice with purpose?
              </h2>
              <p className="text-lg mb-8" style={{ color: 'var(--color-muted)' }}>
                Join artists who stopped posting into the void and started improving with intention.
              </p>
              <Link href="/register" className="btn btn-primary btn-lg">
                Create free account
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
