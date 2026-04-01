import { BookOpen } from '@repo/ui/lib';
import Link from "next/link";

const footerLinks = [
  { label: "Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Privacidad", href: "#" },
  { label: "Términos", href: "#" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <BookOpen className='text-primary-foreground' />
          </div>
          <span className="text-sm font-semibold text-foreground">
            Geist EdTech
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          © 2024 Geist EdTech. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
