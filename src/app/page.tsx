import Link from "next/link";
import { ArrowRight, Code, Activity, Trophy, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary-light/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto space-y-12 text-center z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm font-medium text-primary mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Striver DSA Sheet Mastered
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            Crack Your Dream <br className="hidden md:block"/>
            <span className="gradient-text">Coding Interview</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            A professional tracking dashboard for the Striver DSA Sheet. Monitor your daily consistency, build streaks, and accurately track your interview readiness.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-primary to-primary-light text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
            Start Tracking <ArrowRight size={20} className="mt-0.5" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 font-bold text-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            Learn More
          </a>
        </div>

        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left relative z-10 mx-auto w-full mb-24">
          <Card className="flex flex-col items-start gap-4 hover:border-primary/50 transition-colors">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold">Health Zone System</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">Dynamic visual indicators (Healthy, Warning, Danger) alert you instantly if you are falling behind your chosen 2, 3, 4, or 6 month timeline.</p>
          </Card>
          
          <Card className="flex flex-col items-start gap-4 hover:border-primary/50 transition-colors">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-bold">Curated Sheet</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">Interactive integration of all 450 Striver DSA Sheet problems. Grouped beautifully by data structure topics with smart drawer navigation.</p>
          </Card>

          <Card className="flex flex-col items-start gap-4 hover:border-primary/50 transition-colors">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Trophy size={24} />
            </div>
            <h3 className="text-xl font-bold">Job Readiness</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">Algorithmically generates a realistic probability score of your interview readiness based on the difficulty and volume of problems solved.</p>
          </Card>
        </div>

        {/* Feature Showcase Section 1 */}
        <div className="flex flex-col md:flex-row items-center gap-12 py-16 text-left border-t border-black/10 dark:border-white/10 mx-auto w-full relative z-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
              Progress Dashboard
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Stay completely <br/><span className="gradient-text">in control.</span></h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              When you set a plan duration, the tracker calculates your exact daily targets. The dashboard shows your "Today's Mission", overall completion, and maintains your daily streak to keep you permanently motivated.
            </p>
            <ul className="space-y-3 font-medium text-foreground/80">
              <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-primary"/> Daily Problem Quotas</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-primary"/> Interactive Streaks (🔥)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-primary"/> Topic Mastery Bars</li>
            </ul>
          </div>
          <div className="flex-1 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 p-2 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src="/dashboard-preview.png" alt="Dashboard Preview" className="w-full h-auto rounded-xl shadow-inner border border-black/5 dark:border-white/5" />
          </div>
        </div>

        {/* Feature Showcase Section 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 py-16 text-left border-t border-black/10 dark:border-white/10 mx-auto w-full relative z-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
              Topic Grid Navigation
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Navigate <span className="gradient-text">smarter.</span></h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Gone are the days of endless scrolling through spreadsheets. DSA Tracker categorizes all 450 problems into distinct visual topic cards. Click a topic, and a smooth drawer slides out containing just those problems.
            </p>
            <ul className="space-y-3 font-medium text-foreground/80">
              <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-primary"/> Minimalist Side Drawers</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-primary"/> Direct GeeksForGeeks Links</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-primary"/> One-click Checkoffs</li>
            </ul>
          </div>
          <div className="flex-1 w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 p-2 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src="/sheet-preview.png" alt="Sheet Preview" className="w-full h-auto rounded-xl shadow-inner border border-black/5 dark:border-white/5" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 text-center relative z-10 mx-auto w-full">
          <h2 className="text-4xl font-extrabold tracking-tight mb-6">Ready to clear your interviews?</h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-10 text-lg">
            Stop losing track of what you studied last week. Start a plan, hit your daily targets, and secure your dream job.
          </p>
          <Link href="/register" className="px-10 py-5 rounded-full bg-gradient-to-r from-primary to-primary-light text-white font-bold text-xl hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1 inline-flex items-center gap-2">
            Create Free Account <ArrowRight size={22} className="mt-0.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
