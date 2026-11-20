'use client';
import { useState } from 'react';
import { Activity, ArrowRight, BarChart3, CalendarCheck, HeartPulse, Inbox, Layers, Mail, MessageSquare, ShieldCheck, Sparkles, User, Zap } from 'lucide-react';
import { ButtonLink } from './ui/button';
import { Button } from './ui/button';
import { Field, Input, Textarea } from './ui/input';
import { CalmLoader, Callout, EmptyState, Eyebrow, Footer, FooterCta, ListCard, MinimalCard, Navbar, Pill, Reveal, Section, SectionHeading, Segmented, ShowcaseCard, StatTile } from './paper';

/* A complete page built only from the kit, so you can see every family together.
   Copy and numbers are placeholders. Replace with your product's real content. Never ship invented stats. */
export function DemoPage() {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  return (
    <>
      <Navbar
        brand={<><span>Brand<span className="text-primary">.</span><span className="text-muted-foreground">app</span></span></>}
        items={[{ href: '#features', label: 'Features' }, { href: '#numbers', label: 'Numbers' }, { href: '#contact', label: 'Contact' }]}
        activeHref="#features"
        action={{ label: 'Get started', href: '#contact' }}
      />

      <main>
        {/* HERO: eyebrow chip -> solid-ink display headline -> max-w-2xl lead -> ONE bg-cta + one outline */}
        <section className="px-4 pb-16 pt-32 sm:px-6 md:pb-20 md:pt-40 lg:px-8">
          <div className="mx-auto max-w-6xl text-center">
            <Reveal y={10}><Eyebrow variant="chip" icon={<Sparkles />}>Starter built on Paper and Pastel</Eyebrow></Reveal>
            <Reveal delay={0.06}>
              <h1 className="mx-auto mt-6 max-w-4xl text-balance text-display-sm font-semibold tracking-tight sm:text-display md:text-display-lg">
                Calm, white, and quietly colourful
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                One ink button, six category colours, hairline depth. Swap this copy for yours and keep the structure.
              </p>
            </Reveal>
            <Reveal delay={0.18} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="#contact" size="lg" arrow>Start a project</ButtonLink>
              <ButtonLink href="#features" size="lg" variant="outline">See the kit</ButtonLink>
            </Reveal>
          </div>
        </section>

        {/* FEATURES: three tile families, not one repeated card */}
        <Section id="features" band>
          <SectionHeading eyebrow="features" title="Three tile families, not one repeated card" description="Featured tiles carry a wash and a watermark. Secondary tiles stay neutral. Minimal tiles are one line and one link." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal><ShowcaseCard hue="blue" icon={HeartPulse} label="Care" description="A featured tile for the thing you most want people to open." href="#contact" /></Reveal>
            <Reveal delay={0.08} className="md:mt-8"><ShowcaseCard hue="violet" icon={Layers} label="Platform" description="Wash, watermark, one ink circle. Colour says which category." href="#contact" /></Reveal>
            <Reveal delay={0.16}><ShowcaseCard hue="emerald" icon={Zap} label="Automation" description="Each item gets one hue, cycled. Never six colours in one card." href="#contact" /></Reveal>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ListCard hue="coral" icon={Inbox} title="Shared inbox" description="Compact tile, icon in a tinted circle." href="#contact" />
            <ListCard hue="amber" icon={CalendarCheck} title="Scheduling" description="Hover takes the category colour." href="#contact" />
            <ListCard hue="teal" icon={BarChart3} title="Reporting" description="Neutral surface, hairline border." href="#contact" />
            <ListCard hue="blue" icon={ShieldCheck} title="Audit log" description="No shadow at rest. Depth is a border." href="#contact" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MinimalCard title="Docs" description="Plain tile, one link." href="#contact" />
            <MinimalCard title="Changelog" description="Plain tile, one link." href="#contact" />
            <MinimalCard title="Status" description="Plain tile, one link." href="#contact" />
          </div>
        </Section>

        {/* NUMBERS: KPI tiles. Real data only; these are sample figures for the starter. */}
        <Section id="numbers">
          <SectionHeading eyebrow="numbers" eyebrowHue="emerald" title="Numbers use mono and tick once" description="Sample figures for the starter. Replace with your own, and never invent social proof." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile hue="blue" icon={MessageSquare} value={182} label="Conversations" description="Sample figure" />
            <StatTile hue="emerald" icon={Activity} value={71} suffix="%" label="Handled automatically" description="Sample figure" />
            <StatTile hue="violet" icon={Layers} value={12} label="Active projects" description="Sample figure" />
            <StatTile hue="amber" icon={CalendarCheck} value={46} label="Bookings" description="Sample figure" />
          </div>
        </Section>

        {/* STATES + CALLOUTS */}
        <Section band>
          <SectionHeading eyebrow="states" eyebrowHue="coral" title="Every state is designed" description="Status colours are their own axis. They never borrow a category colour." />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <Callout tone="info" title="Note">Info uses the quiet accent.</Callout>
              <Callout tone="warning">Warning text uses the AA-safe ink variant.</Callout>
              <Callout tone="tip">Success is for confirmations.</Callout>
              <Callout tone="danger">Danger is for things that cannot be undone.</Callout>
            </div>
            <div className="rounded-[24px] border border-border bg-background">
              <CalmLoader label="Loading conversations" />
              <EmptyState icon={Inbox} title="Nothing here yet" description="Empty states get an icon in a circle, one line, and a single action." action={<Button size="sm" className="mt-2">Create the first one</Button>} />
            </div>
          </div>
        </Section>

        {/* FORM: marketing-size fields, inputs are rounded-[10px], submit is the one bg-cta */}
        <Section id="contact" width="5xl">
          <SectionHeading eyebrow="contact" eyebrowHue="teal" title="Inputs are the one thing that is not a pill" />
          <Reveal>
            <form className="mx-auto max-w-xl space-y-4 rounded-[24px] border border-border bg-surface-1 p-6 md:p-8" onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Billing period</p>
                <Segmented label="Billing period" value={plan} onChange={setPlan} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />
              </div>
              <Field label="Your name" icon={<User />}>{(p) => <Input placeholder="Jane Doe" {...p} />}</Field>
              <Field label="Email" icon={<Mail />} hint="We only use this to reply.">{(p) => <Input type="email" placeholder="jane@company.com" {...p} />}</Field>
              <Field label="Message">{(p) => <Textarea placeholder="What are you building?" {...p} />}</Field>
              <div className="flex items-center justify-between gap-3 pt-1">
                <Pill mono>reply in 1 day</Pill>
                <Button type="submit" arrow>Send message</Button>
              </div>
            </form>
          </Reveal>
        </Section>
      </main>

      <Footer bottom={<><span>Brand.app</span><span>Built on Paper and Pastel</span></>}>
        <FooterCta hue="blue" watermark={HeartPulse} eyebrow="Available for new projects" title="Have something in mind?" action={{ label: 'Start a conversation', href: '#contact' }} />
        <div className="grid gap-8 sm:grid-cols-3">
          <div><p className="font-mono text-[15px] font-semibold">Brand<span className="text-primary">.</span><span className="text-muted-foreground">app</span></p><p className="mt-2 max-w-[24ch] text-xs leading-relaxed text-muted-foreground">One line about what you do.</p></div>
          <div><p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Explore</p><ul className="space-y-2 text-sm"><li><a className="text-foreground/80 hover:text-foreground" href="#features">Features</a></li><li><a className="text-foreground/80 hover:text-foreground" href="#numbers">Numbers</a></li></ul></div>
          <div><p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Contact</p><ul className="space-y-2 text-sm"><li><a className="text-foreground/80 hover:text-foreground" href="#contact">Write to us</a></li></ul></div>
        </div>
      </Footer>
    </>
  );
}
