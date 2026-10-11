
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  UserRound,
  CheckCircle2,
  Wallet,
  ShieldAlert,
  Database,
  Ban,
  RefreshCw,
  Mail,
} from "lucide-react";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of These Terms",
    icon: FileText,
    content: (
      <>
        <p>
          Welcome to MoneyLog. These Terms of Service ("Terms") govern your
          access to and use of MoneyLog, an expense-tracking and financial
          record-keeping application.
        </p>
        <p>
          By accessing or using MoneyLog, you agree to these Terms. If you do
          not agree, please do not use the service.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility and Your Account",
    icon: UserRound,
    content: (
      <>
        <p>
          You must be legally permitted to use MoneyLog under the laws
          applicable to you. If you are not legally able to enter into a
          binding agreement, you may use the service only with appropriate
          permission where permitted by law.
        </p>
        <p>When creating and using an account, you agree to:</p>
        <ul>
          <li>Provide accurate information where requested.</li>
          <li>Keep your login credentials confidential.</li>
          <li>Take reasonable steps to protect access to your account.</li>
          <li>Notify us if you suspect unauthorized access to your account.</li>
          <li>Use your account only for lawful purposes.</li>
        </ul>
        <p>
          You are responsible for activity carried out through your account,
          subject to applicable law and circumstances beyond your reasonable
          control.
        </p>
      </>
    ),
  },
  {
    id: "service",
    title: "3. What MoneyLog Provides",
    icon: Wallet,
    content: (
      <>
        <p>
          MoneyLog helps you record, organize, categorize, and review expenses.
          Depending on available features, the service may include summaries,
          reports, filters, payment tracking, and other tools for understanding
          your spending.
        </p>
        <p>
          Features may change over time. We may add, modify, suspend, or
          discontinue features where reasonably necessary to maintain or
          improve the service, subject to applicable law.
        </p>
        <p>
          Unless a feature explicitly states otherwise, you should not assume
          that MoneyLog automatically imports, verifies, or reconciles
          transactions with your bank, credit card issuer, or payment app.
        </p>
      </>
    ),
  },
  {
    id: "responsibilities",
    title: "4. Your Responsibilities",
    icon: CheckCircle2,
    content: (
      <>
        <p>You agree to use MoneyLog responsibly. In particular, you must not:</p>
        <ul>
          <li>Use the service for unlawful, fraudulent, or deceptive activities.</li>
          <li>Attempt to gain unauthorized access to accounts, systems, or data.</li>
          <li>Interfere with the operation, security, or availability of MoneyLog.</li>
          <li>Upload malicious code or attempt to exploit security vulnerabilities.</li>
          <li>Abuse, overload, or disrupt the service or its infrastructure.</li>
          <li>Use the service in a way that violates the rights of others or applicable law.</li>
        </ul>
        <p>
          We may take reasonable action to investigate suspected misuse and
          protect MoneyLog and its users.
        </p>
      </>
    ),
  },
  {
    id: "financial-disclaimer",
    title: "5. Financial Disclaimer",
    icon: ShieldAlert,
    content: (
      <>
        <p>
          MoneyLog is a personal expense-tracking and record-keeping tool. It
          is not a bank, payment service provider, accounting firm, tax adviser,
          investment adviser, or financial institution.
        </p>
        <p>
          Information, summaries, calculations, categories, and reports are
          provided to help you understand the records entered into the
          application. They are not professional financial, investment,
          accounting, or tax advice.
        </p>
        <p>
          You are responsible for checking the accuracy and completeness of
          your entries. Before making important financial, tax, or other
          decisions, independently verify relevant information with the
          appropriate provider or qualified professional.
        </p>
        <p>
          Unless expressly provided by a specific feature, MoneyLog does not
          guarantee cashback, rewards, discounts, transaction status, or the
          accuracy of information supplied by third parties.
        </p>
      </>
    ),
  },
  {
    id: "your-data",
    title: "6. Your Data and Records",
    icon: Database,
    content: (
      <>
        <p>
          You remain responsible for the information you enter into MoneyLog,
          including expense amounts, dates, descriptions, categories, and
          payment details.
        </p>
        <p>
          You should not enter bank passwords, UPI PINs, card PINs, CVVs,
          OTPs, or other authentication secrets into MoneyLog.
        </p>
        <p>
          We handle personal information in accordance with our Privacy Policy.
          You should review that policy to understand how information is
          collected, used, retained, and protected.
        </p>
        <p>
          Do not rely on MoneyLog as the only copy of records that you are
          legally or personally required to preserve. Keep independent records
          where appropriate.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    title: "7. Availability and Service Changes",
    icon: RefreshCw,
    content: (
      <>
        <p>
          We aim to keep MoneyLog available and functioning reliably, but we
          cannot guarantee uninterrupted or error-free operation.
        </p>
        <p>
          The service may occasionally be unavailable due to maintenance,
          updates, technical issues, network problems, or circumstances beyond
          our control.
        </p>
        <p>
          To the extent permitted by applicable law, we are not responsible
          for interruptions, data transmission failures, or losses arising
          from circumstances outside our reasonable control.
        </p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "8. Suspension and Termination",
    icon: Ban,
    content: (
      <>
        <p>
          You may stop using MoneyLog at any time. If you want to request
          account deletion, contact us through the available support channel
          and review our Privacy Policy for information about data handling.
        </p>
        <p>
          We may restrict, suspend, or terminate access where reasonably
          necessary to address violations of these Terms, suspected fraud,
          security risks, legal requirements, or misuse of the service.
        </p>
        <p>
          Where appropriate and legally permitted, we will take reasonable
          steps to notify affected users. Account closure does not necessarily
          mean that all associated information is immediately erased; data
          may be retained where required or permitted by applicable law.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "9. Limitations of Liability",
    icon: ShieldAlert,
    content: (
      <>
        <p>
          To the extent permitted by applicable law, MoneyLog is provided on
          an "as available" basis, without guarantees that the service will
          always be uninterrupted, error-free, or suitable for every purpose.
        </p>
        <p>
          To the extent permitted by law, we are not liable for indirect,
          incidental, special, or consequential losses arising from your use
          of, or inability to use, MoneyLog, including decisions based on
          incomplete or inaccurate records.
        </p>
        <p>
          Nothing in these Terms excludes or limits liability, consumer
          rights, or other protections that cannot legally be excluded or
          limited under applicable law.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to These Terms",
    icon: RefreshCw,
    content: (
      <p>
        We may update these Terms when MoneyLog's features, operations, or
        legal requirements change. The revised version will be published on
        this page with an updated "Last updated" date. If a change materially
        affects users, we will provide notice where required by applicable
        law. Continued use after the revised Terms take effect constitutes
        acceptance where legally permitted.
      </p>
    ),
  },
  {
    id: "law",
    title: "11. Applicable Law",
    icon: FileText,
    content: (
      <p>
        These Terms are subject to applicable laws and regulations. Any
        dispute will be handled by the courts or other authorities with
        appropriate jurisdiction, subject to mandatory legal protections
        available to you. Specific governing-law and jurisdiction details
        should be added once the operator's legal status and appropriate
        jurisdiction have been confirmed.
      </p>
    ),
  },
  {
    id: "contact",
    title: "12. Contact Us",
    icon: Mail,
    content: (
      <p>
        If you have questions about these Terms, need help with your account,
        or wish to report misuse, please contact us through the Feedback &
        Support option available in MoneyLog.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <main className="min-h-screen bg-canvas text-ink dark:bg-[#11110F] dark:text-[#EDE7DA]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-8 sm:px-8">
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
            <FileText size={25} strokeWidth={1.7} />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Clear and fair use
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            These Terms explain the rules and responsibilities that apply
            when you use MoneyLog and its expense-tracking features.
          </p>

          <p className="mt-4 text-xs text-muted">
            Last updated: October 02, 2026
          </p>
        </section>

        {/* Terms sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const SectionIcon = section.icon;

            return (
              <section
                key={section.id}
                id={section.id}
                className="rounded-2xl border border-border bg-surface p-5 sm:p-7"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink dark:bg-[#302F29] dark:text-[#EDE7DA]">
                    <SectionIcon size={18} strokeWidth={1.7} />
                  </div>

                  <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-3 text-sm leading-7 text-muted [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_strong]:font-medium [&_strong]:text-ink dark:[&_strong]:text-[#EDE7DA]">
                  {section.content}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-border pt-6">
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
                to="/"
                className="transition-colors hover:text-ink dark:hover:text-[#EDE7DA]"
              >
                Back to MoneyLog
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
