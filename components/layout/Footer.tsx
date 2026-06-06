import Link from "next/link";

const platformLinks = [
  { href: "/explore", label: "Explore Salons" },
  { href: "/explore?category=bridal-makeup", label: "Bridal Makeup" },
  { href: "/explore?category=mehendi", label: "Mehendi Artists" },
  { href: "/explore?category=hair", label: "Hair Stylists" },
];

const aiFeatureLinks = [
  { href: "/concierge", label: "LUNÉVIA Concierge" },
  { href: "/hairstyle", label: "Hairstyle Analyzer" },
  { href: "/package-builder", label: "Package Builder" },
  { href: "/timeline", label: "Bridal Timeline" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

interface FooterColumnProps {
  title: string;
  links: { href: string; label: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="font-dm-sans text-sm font-semibold uppercase tracking-wider text-gold">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-dm-sans text-sm text-blush/80 transition-colors duration-[400ms] ease-in-out hover:text-cream"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-cormorant text-3xl font-semibold text-gold"
            >
              LUNÉVIA
            </Link>
            <p className="mt-3 max-w-xs font-dm-sans text-sm leading-relaxed text-blush/80">
              Your most beautiful day, designed by AI.
            </p>
          </div>

          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="AI Features" links={aiFeatureLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        <div className="mt-12 border-t border-gold/20 pt-6">
          <p className="text-center font-dm-sans text-sm text-blush/70">
            Made with ❤️ for Delhi&apos;s brides — LUNÉVIA
          </p>
        </div>
      </div>
    </footer>
  );
}
