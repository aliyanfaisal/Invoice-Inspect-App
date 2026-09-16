import Link from 'next/link';
import { Search } from 'lucide-react';

export function Navigation() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl glass rounded-full border border-border/50 transition-all shadow-lg">
      <div className="flex h-16 items-center px-6">
        <div className="flex gap-2 items-center mr-8">
          <div className="bg-primary/20 text-primary p-1.5 rounded-xl shadow-sm">
            <Search className="h-5 w-5" />
          </div>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight text-gradient-primary">InvoiceInspect</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-primary text-foreground"
          >
            Check Invoice
          </Link>
          <Link
            href="/#how-it-works"
            className="transition-colors hover:text-primary text-muted-foreground"
          >
            How it works
          </Link>
          <Link
            href="#security"
            className="transition-colors hover:text-primary text-muted-foreground"
          >
            Security
          </Link>
          <Link
            href="#pricing"
            className="transition-colors hover:text-primary text-muted-foreground"
          >
            Pricing
          </Link>
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <Link
              href="/login"
              className="hidden md:inline-flex text-sm font-medium transition-colors hover:text-primary text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-white shadow hover:bg-primary/90 hover:scale-105 h-9 px-6 py-2"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
