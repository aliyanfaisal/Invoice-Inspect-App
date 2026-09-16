import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, AlertTriangle, FileText, ChevronRight } from "lucide-react";

export default function ResultsPage() {
  return (
    <div className="flex-1 bg-secondary/10 w-full min-h-screen">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to upload
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoice Review</h1>
            <p className="text-muted-foreground mt-1 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              INV-2023-089.pdf
            </p>
          </div>
          
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-right">
            <p className="text-sm font-medium text-destructive mb-1 uppercase tracking-wider">Potential Discrepancy</p>
            <p className="text-3xl font-bold text-destructive">€300.00</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-card border rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="bg-destructive/10 p-3 rounded-full mb-3">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-3xl font-bold text-foreground">2</p>
            <p className="text-sm font-medium text-muted-foreground">Errors found</p>
          </div>
          
          <div className="bg-card border rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="bg-amber-500/10 p-3 rounded-full mb-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">1</p>
            <p className="text-sm font-medium text-muted-foreground">Warning</p>
          </div>
          
          <div className="bg-card border rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="bg-emerald-500/10 p-3 rounded-full mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">14</p>
            <p className="text-sm font-medium text-muted-foreground">Verified checks</p>
          </div>
        </div>

        <h2 className="text-xl font-bold tracking-tight mb-4">Findings</h2>
        
        <div className="space-y-4">
          {/* Mock Error Finding */}
          <div className="bg-card border-l-4 border-l-destructive rounded-r-xl border-y border-r shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                      ERROR
                    </span>
                    <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
                      Line Item Calculation
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Line item total differs from expected calculation.
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-6 bg-secondary/30 rounded-lg p-4 border mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Expected Calculation</p>
                      <p className="font-mono text-sm">Consulting<br/>5 × €400 = €2,000</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Invoice Says</p>
                      <p className="font-mono text-sm font-semibold text-destructive">€2,300</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Difference</p>
                      <p className="font-mono text-sm font-semibold text-destructive">€300</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Found on <span className="font-medium text-foreground">Page 2</span>
                </p>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-secondary h-9 px-4 py-2 border">
                  View evidence
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Mock Warning Finding */}
          <div className="bg-card border-l-4 border-l-amber-500 rounded-r-xl border-y border-r shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                      WARNING
                    </span>
                    <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
                      Required Fields
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    VAT ID was not detected.
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    The document does not appear to contain a valid VAT ID for the supplier, which is required for tax compliance in most jurisdictions.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Document-wide check
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
