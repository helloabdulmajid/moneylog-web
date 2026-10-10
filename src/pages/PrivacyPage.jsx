
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
  LockKeyhole,
  Database,
  Cookie,
  UserRound,
  Mail,
  FileText,
  Trash2,
} from "lucide-react";

const sections = [
  {
    id: "information",
    title: "1. Information We Collect",
    icon: Database,
    content: (
      <>
        <p>
          MoneyLog collects information needed to provide and improve your
          expense-tracking experience. Depending on how you use the service,
          this may include:
        </p>
        <ul>
          <li>
            <strong>Account information:</strong> details such as your email
            address and information associated with your account.
          </li>
          <li>
            <strong>Financial records:</strong> expenses, amounts, dates,
            categories, notes, payment methods, payment apps, and payment
            accounts or cards that you choose to record.
          </li>
          <li>
            <strong>Feedback and support:</strong> messages, issue descriptions,
            and any contact details or screenshots you voluntarily provide.
          </li>
          <li>
            <strong>Basic technical information:</strong> information that may
            be generated when you access the service, such as device, browser,
            diagnostic, and security-related information.
          </li>
        </ul>
        <p>
          MoneyLog is designed for tracking expenses that you enter. Do not
          submit passwords, PINs, CVVs, OTPs, or other sensitive banking
          credentials in expense notes or support messages.
        </p>
      </>
    ),
  },
  {
    id: "usage",
    title: "2. How We Use Your Information",
    icon: FileText,
    content: (
      <>
        <p>We may use your information to:</p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Record, organize, display, and analyze your expenses.</li>
          <li>Provide summaries, reports, filters, and other app features.</li>
          <li>Send essential account emails, such as verification and password-reset messages.</li>
          <li>Respond to feedback, support requests, and reported issues.</li>
          <li>Maintain service reliability, prevent misuse, and protect account security.</li>
          <li>Improve MoneyLog and comply with applicable legal obligations.</li>
        </ul>
        <p>
          We use information for purposes related to operating and maintaining
          MoneyLog, rather than treating your personal financial records as
          public information.
        </p>
      </>
    ),
  },
  {
    id: "financial-data",
    title: "3. Your Financial Data",
    icon: LockKeyhole,
    content: (
      <>
        <p>
          Your expense records may contain personal financial information.
          Please enter only the information necessary for your own tracking
          and analysis.
        </p>
        <p>
          MoneyLog does not need your bank login credentials, UPI PIN, card
          PIN, CVV, or OTP to let you manually record expenses. Never share
          these details with us.
        </p>
        <p>
          Unless a feature explicitly says otherwise, you should not assume
          that MoneyLog connects directly to your bank or automatically
          verifies transactions with a financial institution.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. How Information May Be Shared",
    icon: UserRound,
    content: (
      <>
        <p>
          We do not make your personal expense records publicly available
          through the normal use of MoneyLog. Information may be processed or
          shared in limited circumstances, including:
        </p>
        <ul>
          <li>
            <strong>Service providers:</strong> providers supporting hosting,
            database storage, account emails, security, and service operation.
          </li>
          <li>
            <strong>Support:</strong> information you submit may be accessed
            to investigate and respond to your request.
          </li>
          <li>
            <strong>Legal requirements:</strong> where disclosure is required
            by applicable law or a valid legal process.
          </li>
          <li>
            <strong>Protection:</strong> where reasonably necessary to
            investigate fraud, abuse, security incidents, or threats to the
            service and its users.
          </li>
        </ul>
        <p>
          Service providers may process relevant information to perform their
          services. Their handling of information may also be governed by
          their own privacy policies and applicable agreements.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "5. Cookies and Local Storage",
    icon: Cookie,
    content: (
      <>
        <p>
          MoneyLog may use essential browser storage, cookies, or similar
          technologies to support account sessions, remember preferences,
          maintain security, and provide core functionality.
        </p>
        <p>
          You can manage cookies and site data through your browser settings.
          Blocking essential storage may affect some features or prevent you
          from signing in.
        </p>
        <p>
          If optional analytics or other tracking technologies are introduced,
          this policy should be updated to explain their use.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "6. Data Security",
    icon: ShieldCheck,
    content: (
      <>
        <p>
          We take reasonable measures intended to protect information against
          unauthorized access, loss, misuse, alteration, or disclosure.
          These measures may include access controls and security safeguards.
        </p>
        <p>
          However, no website, application, or method of online transmission
          can be guaranteed to be completely secure. You should also protect
          your account credentials and use a secure device when accessing
          MoneyLog.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "7. Data Retention and Account Deletion",
    icon: Trash2,
    content: (
      <>
        <p>
          We retain information for as long as reasonably necessary to provide
          MoneyLog, maintain your account and records, resolve support issues,
          protect the service, and meet applicable legal requirements.
        </p>
        <p>
          If you want to delete your account or request the removal of your
          information, please contact us through the available support
          channel. We will handle requests in accordance with applicable law
          and our operational requirements.
        </p>
        <p>
          Some information may need to be retained for legitimate purposes,
          such as security, legal compliance, or maintaining records of
          previously submitted support requests. Where appropriate, such
          records may be retained in a limited or anonymized form.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "8. Your Privacy Rights",
    icon: UserRound,
    content: (
      <>
        <p>
          Depending on applicable law, you may have the right to request
          access to, correction of, or deletion of certain personal
          information, and to raise concerns about how your information is
          handled.
        </p>
        <p>
          To make a privacy-related request, contact us through the support
          option available in MoneyLog. We may need to verify your identity
          before processing certain requests.
        </p>
        <p>
          We aim to handle valid requests within the timeframes required by
          applicable law.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    icon: ShieldCheck,
    content: (
      <p>
        MoneyLog is not intended for children who are not legally permitted
        to use the service under applicable law. We do not knowingly seek to
        collect personal information from children in violation of applicable
        legal requirements. If you believe such information has been
        submitted, please contact us.
      </p>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    icon: FileText,
    content: (
      <p>
        We may update this Privacy Policy when MoneyLog's features, data
        practices, or legal requirements change. The updated version will be
        published on this page with a revised "Last updated" date. We
        encourage you to review this page periodically.
      </p>
    ),
  },
  {
    id: "contact",
    title: "11. Contact Us",
    icon: Mail,
    content: (
      <>
        <p>
          If you have questions, concerns, or requests regarding this Privacy
          Policy or your personal information, please contact us through the
          Feedback &amp; Support option available in MoneyLog.
        </p>
        <p>
          Please avoid including passwords, financial credentials, or other
          highly sensitive information in support messages.
        </p>
      </>
    ),
  },
];

export default function Privacy() {
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

        {/* Page introduction */}
        <section className="pb-10 pt-12 sm:pb-12 sm:pt-16">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-ink dark:bg-[#24231F] dark:text-[#EDE7DA]">
            <ShieldCheck size={25} strokeWidth={1.7} />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Your privacy matters
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            This Privacy Policy explains how MoneyLog collects, uses,
            stores, and protects information when you use our expense-tracking
            service.
          </p>

          <p className="mt-4 text-xs text-muted">
            Last updated: October 10, 2026
          </p>
        </section>

        {/* Privacy sections */}
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
        <footer className="mt-auto border-t border-border pt-6 mt-10">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} MoneyLog. All rights reserved.
            </p>

            <Link
              to="/"
              className="text-xs text-muted transition-colors hover:text-ink dark:hover:text-[#EDE7DA]"
            >
              Back to MoneyLog
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
