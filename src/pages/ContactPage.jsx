
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Mail,
  MessageSquare,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";

const EMAIL = "helloabdulmajid@gmail.com";

// Replace "#" with your actual social profile URLs later.
const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "#",
    icon: Facebook,
  },
  {
    name: "X",
    href: "#",
    icon: XIcon,
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: Linkedin,
  },
  {
    name: "YouTube",
    href: "#",
    icon: Youtube,
  },
];

function XIcon({ size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.57L5.43 22H2.3l7.25-8.28L1.8 2h6.4l4.43 6.96L18.9 2Zm-1.1 17.9h1.73L7.28 4H5.42L17.8 19.9Z" />
    </svg>
  );
}

export default function Contact() {
  return (
    <main className="min-h-screen bg-canvas text-ink dark:bg-[#11110F] dark:text-[#EDE7DA]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-75"
          >
            MoneyLog
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-ink dark:hover:text-[#EDE7DA]"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </header>

        {/* Introduction */}
        <section className="pb-10 pt-12 sm:pb-12 sm:pt-16">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-ink dark:bg-[#24231F] dark:text-[#EDE7DA]">
            <Mail size={25} strokeWidth={1.7} />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            We're here to help
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Get in touch
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
            Have a question, found a bug, or have an idea to improve
            MoneyLog? Reach out to us or share your feedback. We'd love to
            hear from you.
          </p>
        </section>

        {/* Contact options */}
        <section className="space-y-4">
          {/* Email */}
          <a
            href={`mailto:${EMAIL}`}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-ink/20 sm:p-6 dark:hover:border-[#EDE7DA]/20"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-canvas text-ink dark:bg-[#302F29] dark:text-[#EDE7DA]">
              <Mail size={21} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold">Email us</h2>
              <p className="mt-1 break-all text-sm text-muted">
                {EMAIL}
              </p>
            </div>

            <ArrowUpRight
              size={19}
              className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>

          {/* Feedback and Support */}
          <Link
            to="/feedback"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-ink/20 sm:p-6 dark:hover:border-[#EDE7DA]/20"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-canvas text-ink dark:bg-[#302F29] dark:text-[#EDE7DA]">
              <MessageSquare size={21} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold">
                Feedback &amp; Support
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                Report a problem, ask a question, or suggest a feature.
              </p>
            </div>

            <ArrowUpRight
              size={19}
              className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </section>

        {/* Social links */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold">Follow MoneyLog</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Stay connected for updates and new features.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`MoneyLog on ${name}`}
                title={name}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-canvas hover:text-ink dark:hover:text-[#EDE7DA]"
              >
                <Icon size={20} strokeWidth={1.7} />
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto border-t border-border pt-6 mt-12">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} MoneyLog. All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-xs text-muted">
              <Link
                to="/privacy"
                className="transition-colors hover:text-ink dark:hover:text-[#EDE7DA]"
              >
                Privacy
              </Link>

              <Link
                to="/terms"
                className="transition-colors hover:text-ink dark:hover:text-[#EDE7DA]"
              >
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
