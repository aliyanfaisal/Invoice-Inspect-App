import { UploadZone } from "@/components/UploadZone";
import { CheckCircle, ShieldAlert, FileSearch, ArrowRight, Lock, EyeOff, FileDigit, Building2, Landmark, Wallet, Briefcase } from "lucide-react";
import { HeroBackground, FloatingIcons } from "@/components/HeroAnimations";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col relative z-0">
      <HeroBackground />
      <FloatingIcons />
      
      <section className="w-full pt-32 pb-20 lg:pt-40 lg:pb-32 flex flex-col items-center justify-center text-center px-4 relative z-10">
        <div className="max-w-4xl space-y-8 relative">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Milestone 1 Preview
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
            Before you pay an invoice, <br className="hidden md:block" />
            <span className="text-gradient-primary">get a second opinion.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Find invoice errors before you pay. Check the numbers. Catch inconsistencies. See the evidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
            <Link 
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full text-base font-semibold transition-all hover:scale-105 bg-card border border-border text-foreground shadow-sm hover:shadow-md h-12 px-8"
            >
              See how it works
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="w-full mt-16 relative z-20">
          <UploadZone />
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="w-full py-12 border-t border-border/50 bg-background/50 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            Trusted by modern finance teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl"><Building2 className="w-6 h-6" /> Acme Corp</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Landmark className="w-6 h-6" /> Globex</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Wallet className="w-6 h-6" /> Initech</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Briefcase className="w-6 h-6" /> Soylent</div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="w-full py-24 bg-card/50 border-t border-border/50 relative z-10">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-6">How it works</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              We process your invoice securely and instantly verify every calculation, line item, and tax amount against our deterministic rules engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Bento Card 1: Extract (Spans 2 columns on tablet/desktop) */}
            <div className="md:col-span-2 flex flex-col justify-between p-10 rounded-[2rem] glass-card transition-all hover:shadow-lg group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileSearch className="w-48 h-48 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="bg-primary text-white w-12 h-12 flex items-center justify-center rounded-2xl mb-6 shadow-md">
                  <span className="font-bold text-xl">1</span>
                </div>
                <h3 className="text-3xl font-semibold mb-4 text-foreground">Extract Data</h3>
                <p className="text-muted-foreground text-lg max-w-md">
                  We accurately parse text, tables, and positioned data from your PDF invoice using advanced document intelligence.
                </p>
              </div>
            </div>
            
            {/* Bento Card 2: Verify (Spans 1 column) */}
            <div className="col-span-1 flex flex-col justify-between p-10 rounded-[2rem] bg-gradient-to-br from-primary to-accent text-white transition-all hover:shadow-lg group relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle className="w-40 h-40" />
              </div>
              <div className="relative z-10">
                <div className="bg-white/20 backdrop-blur-sm w-12 h-12 flex items-center justify-center rounded-2xl mb-6">
                  <span className="font-bold text-xl">2</span>
                </div>
                <h3 className="text-3xl font-semibold mb-4">Verify Math</h3>
                <p className="text-white/80 text-lg">
                  Our deterministic code runs strict mathematical checks to ensure totals, taxes, and line items match perfectly.
                </p>
              </div>
            </div>
            
            {/* Bento Card 3: Show Evidence (Spans full width) */}
            <div className="md:col-span-2 lg:col-span-3 flex flex-col md:flex-row items-center gap-10 p-10 rounded-[2rem] glass-card transition-all hover:shadow-lg group">
              <div className="flex-1">
                <div className="bg-accent/20 text-accent w-12 h-12 flex items-center justify-center rounded-2xl mb-6 shadow-sm">
                  <span className="font-bold text-xl">3</span>
                </div>
                <h3 className="text-3xl font-semibold mb-4 text-foreground">Show Evidence</h3>
                <p className="text-muted-foreground text-lg max-w-xl">
                  Every error or discrepancy we flag is backed up with the exact page number and region in the original document, so you never have to guess.
                </p>
              </div>
              <div className="w-full md:w-1/3 bg-background/50 rounded-2xl p-6 border border-border shadow-inner flex flex-col items-center justify-center text-center">
                <ShieldAlert className="w-16 h-16 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-foreground">Visual Proof</p>
                <p className="text-sm text-muted-foreground">Original PDF Highlights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section id="security" className="w-full py-24 bg-background relative z-10">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Enterprise-grade Security</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Your financial data is sensitive. We built InvoiceInspect with privacy as the foundational principle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="bg-secondary p-4 rounded-full mb-2">
                <EyeOff className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Zero Retention</h3>
              <p className="text-muted-foreground">
                We never store your uploaded PDFs. Files are processed in memory and instantly discarded after analysis.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="bg-secondary p-4 rounded-full mb-2">
                <Lock className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Bank-Level Encryption</h3>
              <p className="text-muted-foreground">
                All data in transit is secured using industry-standard TLS 1.3 encryption protocols.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="bg-secondary p-4 rounded-full mb-2">
                <FileDigit className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Deterministic Math</h3>
              <p className="text-muted-foreground">
                We use strict code for math, not AI. No hallucinations on your numbers, guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
