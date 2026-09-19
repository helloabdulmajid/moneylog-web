import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Plus, ChevronLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { expenseApi } from "../api/expense.js";
import { categoryApi } from "../api/category.js";
import { paymentApi } from "../api/payment.js";
import { formatCurrency, getErrorMessage } from "../utils/helpers.js";
import { PAYMENT_METHODS } from "../utils/constants.js";

const METHODS_UI = [
  { value: "UPI", label: "UPI", icon: "💳" },
  { value: "CARD", label: "Card", icon: "💳" },
  { value: "CASH", label: "Cash", icon: "💵" },
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: "🏦" },
  { value: "IMPS", label: "IMPS", icon: "🏦" },
  { value: "NEFT", label: "NEFT", icon: "🏦" },
  { value: "OTHER", label: "Other", icon: "💸" },
];

const METHOD_NEEDS_APP = new Set(["UPI", "BANK_TRANSFER", "IMPS", "NEFT"]);
const METHOD_NEEDS_ACCOUNT = new Set([
  "UPI", "CARD", "BANK_TRANSFER", "IMPS", "NEFT", "OTHER",
]);

function appsForMethod(method, apps) {
  const map = {
    UPI: ["UPI", "OTHER"],
    BANK_TRANSFER: ["BANK_APP", "OTHER"],
    IMPS: ["BANK_APP", "OTHER"],
    NEFT: ["BANK_APP", "OTHER"],
  };
  const types = map[method] || null;
  const filtered = types ? apps.filter((a) => types.includes(a.type)) : apps;
  return filtered.length > 0 ? filtered : apps;
}

function sourcesForMethod(method, sources) {
  const map = {
    CARD: ["CREDIT_CARD"],
    BANK_TRANSFER: ["BANK_ACCOUNT"],
    IMPS: ["BANK_ACCOUNT"],
    NEFT: ["BANK_ACCOUNT"],
    CASH: ["CASH"],
    UPI: ["BANK_ACCOUNT", "CREDIT_CARD", "WALLET"],
    OTHER: ["BANK_ACCOUNT", "CREDIT_CARD", "WALLET", "CASH"],
  };
  const types = map[method] || null;
  const filtered = types ? sources.filter((s) => types.includes(s.type)) : sources;
  return filtered.length > 0 ? filtered : sources;
}

function sortByFrequent(items, frequentIds, getId) {
  const rank = new Map(frequentIds.map((id, i) => [String(id), i]));
  return [...items].sort(
    (a, b) => (rank.get(String(getId(a))) ?? 99) - (rank.get(String(getId(b))) ?? 99)
  );
}

function buildFlow(method) {
  const f = ["amount", "method"];
  if (method !== "CASH") f.push("app");
  if (METHOD_NEEDS_ACCOUNT.has(method)) f.push("account");
  f.push("category", "subcategory");
  f.push("note", "split");
  return f;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function fmtDate(d) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d + "T00:00:00"));
}

export default function HomePage() {
  const location = useLocation();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [date, setDate] = useState(today());
  const [time, setTime] = useState(nowTime());
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const [hints, setHints] = useState(null);
  const [categories, setCategories] = useState([]);
  const [apps, setApps] = useState([]);
  const [sources, setSources] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    Promise.all([
      expenseApi.entryHints(),
      categoryApi.list(),
      paymentApi.listApps(),
      paymentApi.listSources(),
    ]).then(([h, c, a, s]) => {
      setHints(h || null);
      setCategories(c || []);
      setApps(a || []);
      setSources(s || []);
    });
  }, []);

  useEffect(() => {
    const now = new Date();
    expenseApi
      .list({ month: now.getMonth() + 1, year: now.getFullYear(), size: 100 })
      .then((res) => {
        const list = res?.content || [];
        const todayStr = today();
        setSummary({
          monthTotal: list.reduce((sum, e) => sum + e.amount, 0),
          todayCount: list.filter((e) => String(e.expenseDate) === todayStr).length,
        });
      });
  }, []);

  useEffect(() => {
    if (location.state?.openWizard) setWizardOpen(true);
  }, [location.state]);

  const openWizard = () => {
    setWizardOpen(true);
  };

  return (
    <div className="max-w-md mx-auto">
      {!wizardOpen && summary && (
        <div className="px-1 pt-5 pb-1 animate-fade-in">
          <p className="text-sm font-medium text-gray-500 dark:text-[#CFC5AF]">
            {new Date().toLocaleDateString("en", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums">
            {formatCurrency(summary.monthTotal)}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-400 dark:text-[#8A8070]">
              spent this month
            </span>
            {summary.todayCount > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium dark:bg-primary-950/50 dark:text-primary-300">
                {summary.todayCount} added today
              </span>
            ) : (
              <span className="text-xs text-gray-400 dark:text-[#8A8070]">
                · Pull up to add today's first one
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-1 py-5">
        <button
          onClick={() => dateRef.current?.showPicker()}
          className="text-sm font-medium text-gray-700 flex items-center gap-1.5 select-none"
        >
          {fmtDate(date)}
          <input
            ref={dateRef}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="sr-only"
          />
        </button>
        <button
          onClick={() => timeRef.current?.showPicker()}
          className="text-sm font-medium text-gray-500 flex items-center gap-1.5 select-none"
        >
          {time}
          <input
            ref={timeRef}
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="sr-only"
          />
        </button>
      </div>

      {!wizardOpen && (
        <>
          <div className="hidden md:flex flex-col items-center justify-center pt-16 animate-fade-in">
            <button
              onClick={openWizard}
              className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200 transition hover:bg-primary-700 active:scale-95"
            >
              <Plus className="w-7 h-7" strokeWidth={2.5} />
            </button>
            <p className="text-sm text-gray-400 mt-5 select-none">
              Tap to add an expense
            </p>
          </div>
        </>
      )}

      {wizardOpen && (
        <Wizard
          date={date}
          time={time}
          hints={hints}
          categories={categories}
          onCategoriesUpdate={(list) => setCategories(list)}
          apps={apps}
          sources={sources}
          onAppsUpdate={(list) => setApps(list)}
          onSourcesUpdate={(list) => setSources(list)}
          onDone={() => {
            setWizardOpen(false);
            toast.success("Expense saved");
          }}
          onBack={() => setWizardOpen(false)}
        />
      )}
    </div>
  );
}

function Wizard({ date, time, hints, categories, apps, sources, onCategoriesUpdate, onAppsUpdate, onSourcesUpdate, onDone, onBack }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(() => {
    const pref = hints?.lastUsed || {};
    return {
      amount: "",
      paymentMethod: pref.paymentMethod || "",
      paymentAppId: pref.paymentAppId || "",
      paymentSourceId: pref.paymentSourceId || "",
      categoryId: pref.categoryId || "",
      subcategoryId: pref.subcategoryId || "",
      notes: "",
      purpose: "",
      isSplit: false,
      splitWith: "",
    };
  });

  const selectedCat = categories.find((c) => c.id === form.categoryId);
  const flow = buildFlow(form.paymentMethod);
  const currentStep = flow[Math.min(stepIdx, flow.length - 1)];

  const goNext = () => setStepIdx((i) => Math.min(i + 1, flow.length - 1));
  const goBack = (to) => setStepIdx(to);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  useEffect(() => {
    setStepIdx((i) => Math.min(i, flow.length - 1));
  }, [flow.length]);

  const save = async () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    setSubmitting(true);
    try {
      await expenseApi.create({
        amount: Number(form.amount),
        expenseDate: date,
        expenseTime: time + ":00",
        paymentMethod: form.paymentMethod || null,
        paymentAppId: form.paymentAppId || null,
        paymentSourceId: form.paymentSourceId || null,
        categoryId: form.categoryId || null,
        subcategoryId: form.subcategoryId || null,
        notes: form.notes || null,
        purpose: form.purpose || null,
        isSplit: form.isSplit,
        splitWith: form.splitWith || null,
      });
      onDone();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-slide-up pb-6">
      {currentStep !== "amount" && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            className="text-gray-400 hover:text-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <ProgressSteps
            flow={flow}
            stepIdx={stepIdx}
            form={form}
            apps={apps}
            sources={sources}
            categories={categories}
            onJump={(idx) => setStepIdx(idx)}
          />
        </div>
      )}

      <div className="min-h-[320px]">
        {currentStep === "amount" && (
          <NumpadStep
            value={form.amount}
            onChange={(v) => set("amount", v)}
            onNext={() => { if (form.amount) goNext(); }}
          />
        )}
        {currentStep === "method" && (
          <ChipSelectStep
            title="How did you pay?"
            items={sortByFrequent(METHODS_UI, hints?.frequent?.paymentMethods || [], (m) => m.value)}
            selected={form.paymentMethod}
            onSelect={(val) => {
              set("paymentMethod", val);
              set("paymentSourceId", "");
              if (val === "CASH" || !METHOD_NEEDS_ACCOUNT.has(val)) {
                const miniFlow = buildFlow(val);
                setStepIdx(miniFlow.indexOf("category"));
              } else {
                goNext();
              }
            }}
            renderLabel={(m) => m.label}
            renderIcon={(m) => <span className="text-lg">{m.icon}</span>}
          />
        )}
        {currentStep === "app" && (
          <AppStep
            method={form.paymentMethod}
            apps={apps}
            frequentIds={hints?.frequent?.apps?.map((a) => a.id) || []}
            selected={form.paymentAppId}
            onSelect={(id) => { set("paymentAppId", id); goNext(); }}
            onCreate={async (app) => {
              set("paymentAppId", app.id);
              onAppsUpdate([...apps, app]);
              goNext();
            }}
          />
        )}
        {currentStep === "account" && (
          <SourceStep
            method={form.paymentMethod}
            sources={sources}
            frequentIds={hints?.frequent?.sources?.map((s) => s.id) || []}
            selected={form.paymentSourceId}
            onSelect={(id) => { set("paymentSourceId", id); goNext(); }}
            onCreate={async (source) => {
              set("paymentSourceId", source.id);
              onSourcesUpdate([...sources, source]);
              goNext();
            }}
          />
        )}
        {currentStep === "category" && (
          <CategoryStep
            categories={categories}
            selectedId={form.categoryId}
            frequentIds={hints?.frequent?.categories?.map((c) => c.id) || []}
            onSelect={(id) => {
              set("categoryId", id);
              set("subcategoryId", "");
              const cat = categories.find((c) => c.id === id);
              if (cat?.subcategories?.length) goNext();
              else setStepIdx(flow.indexOf("note"));
            }}
            onCreated={async (created) => {
              const updated = await categoryApi.list();
              onCategoriesUpdate(updated || []);
              if (created?.id) {
                set("categoryId", created.id);
                set("subcategoryId", "");
                const idx = flow.indexOf("subcategory");
                setStepIdx(idx !== -1 ? idx : flow.indexOf("note"));
              }
            }}
          />
        )}
        {currentStep === "subcategory" && (
          <SubcategoryStep
            categoryId={form.categoryId}
            items={selectedCat?.subcategories || []}
            selected={form.subcategoryId}
            onSelect={(id) => { set("subcategoryId", id); goNext(); }}
            onSkip={() => goNext()}
            onCreate={async (created) => {
              const updated = await categoryApi.list();
              onCategoriesUpdate(updated || []);
              set("subcategoryId", created?.id || "");
              goNext();
            }}
          />
        )}
        {currentStep === "note" && (
          <NoteStep form={form} onChange={set} onNext={goNext} onSkip={goNext} />
        )}
        {currentStep === "split" && (
          <SplitStep
            form={form}
            onChange={set}
            amount={form.amount}
            submitting={submitting}
            onSave={save}
            onBack={() => goBack(flow.length - 2)}
          />
        )}
      </div>
    </div>
  );
}

function NumpadStep({ value, onChange, onNext }) {
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

  const handleKey = (d) => {
    if (d === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (d === "." && value.includes(".")) return;
    if (d === "." && value === "") { onChange("0."); return; }
    const parts = value.split(".");
    if (parts.length === 2 && parts[1].length >= 2 && d !== "⌫") return;
    if (parts[0].replace("-", "").length >= 9 && d !== "." && d !== "⌫") return;
    onChange(value + d);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8 pt-8">
        <p className="text-4xl font-bold tracking-tight text-gray-900 tabular-nums">
          {value ? `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: (value.includes(".") ? 2 : 0), maximumFractionDigits: 2 })}` : "₹ 0"}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {digits.map((d) => (
          <button
            key={d}
            onClick={() => handleKey(d)}
            className={`h-14 rounded-xl text-xl font-semibold transition active:scale-95 select-none ${
              d === "⌫"
                ? "text-gray-500 bg-gray-100 hover:bg-gray-200"
                : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!value}
        className="w-full btn-primary mt-6 !py-3.5"
      >
        Next
      </button>
    </div>
  );
}

function ChipSelectStep({ title, items, selected, onSelect, renderLabel, renderExtra, renderIcon, onSkip, extra }) {
  return (
    <div className="animate-fade-in pt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => {
          const label = renderLabel(item);
          const id = item.id || item.value;
          const active = String(selected) === String(id);
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium transition active:scale-95 select-none ${
                active
                  ? "border-primary-300 bg-primary-50 text-primary-700 ring-2 ring-primary-100"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {renderIcon && renderIcon(item)}
              <span>{label}</span>
              {renderExtra && <span className="text-xs text-gray-400">{renderExtra(item)}</span>}
            </button>
          );
        })}
      </div>
      {(extra || onSkip) && (
        <div className="flex items-center justify-between mt-6">
          <div>{extra}</div>
          {onSkip && (
            <button onClick={onSkip} className="text-sm font-medium text-red-400 hover:text-red-600 select-none">
              Skip
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AppStep({ method, apps, frequentIds, selected, onSelect, onCreate }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const typeMap = { UPI: "UPI", BANK_TRANSFER: "BANK_APP", IMPS: "BANK_APP", NEFT: "BANK_APP" };
  const type = typeMap[method] || "UPI";

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const created = await paymentApi.createApp({ name: name.trim(), type });
      toast.success("App added");
      setName("");
      setCreating(false);
      onCreate(created);
    } catch (err) {
      const msg = getErrorMessage(err).toLowerCase();
      const existing = apps.find((a) => a.name.toLowerCase() === name.trim().toLowerCase());
      if (msg.includes("already exists") && existing) {
        toast.success("App added");
        setName("");
        setCreating(false);
        onCreate(existing);
        return;
      }
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in pt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Which app?</h2>
      {creating ? (
        <form onSubmit={submit} className="bg-gray-50 rounded-xl p-4 mb-4 animate-slide-up">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="App name e.g. GPay, PhonePe"
            className="input mb-3"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => { setCreating(false); setName(""); }} className="btn-secondary !py-2 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={!name.trim() || submitting} className="btn-primary !py-2 text-sm">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Add & continue
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap gap-3">
          {sortByFrequent(appsForMethod(method, apps), frequentIds, (a) => a.id).map((a) => {
            const active = String(selected) === String(a.id);
            return (
              <button
                key={a.id}
                onClick={() => onSelect(a.id)}
                className={`px-5 py-3 rounded-xl border text-sm font-medium transition active:scale-95 select-none ${
                  active
                    ? "border-primary-300 bg-primary-50 text-primary-700 ring-2 ring-primary-100"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {a.name}
              </button>
            );
          })}
          <button
            onClick={() => setCreating(true)}
            className="px-5 py-3 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-gray-400 hover:text-gray-600 hover:border-gray-400 transition select-none"
          >
            + New app
          </button>
        </div>
      )}
    </div>
  );
}

function SourceStep({ method, sources, frequentIds, selected, onSelect, onCreate }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [bankName, setBankName] = useState("");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const typeMap = {
    CARD: "CREDIT_CARD",
    BANK_TRANSFER: "BANK_ACCOUNT",
    IMPS: "BANK_ACCOUNT",
    NEFT: "BANK_ACCOUNT",
    UPI: "BANK_ACCOUNT",
    CASH: "CASH",
    OTHER: "BANK_ACCOUNT",
  };
  const type = typeMap[method] || "BANK_ACCOUNT";

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const created = await paymentApi.createSource({
        name: name.trim(),
        bankName: bankName.trim() || null,
        lastFourDigits: lastFourDigits.trim().replace(/\D/g, "").slice(0, 4) || null,
        type,
      });
      toast.success("Source added");
      setName("");
      setBankName("");
      setLastFourDigits("");
      setCreating(false);
      onCreate(created);
    } catch (err) {
      const msg = getErrorMessage(err).toLowerCase();
      const existing = sources.find((s) => s.name.toLowerCase() === name.trim().toLowerCase());
      if (msg.includes("already exists") && existing) {
        toast.success("Source added");
        setName("");
        setBankName("");
        setLastFourDigits("");
        setCreating(false);
        onCreate(existing);
        return;
      }
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in pt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Which source?</h2>
      {creating ? (
        <form onSubmit={submit} className="bg-gray-50 rounded-xl p-4 mb-4 animate-slide-up">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Source name e.g. HDFC Savings"
            className="input mb-3"
            autoFocus
          />
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Bank name (optional)"
            className="input mb-3"
          />
          <input
            type="text"
            value={lastFourDigits}
            onChange={(e) => setLastFourDigits(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="Last 4 digits (optional)"
            className="input mb-3"
            inputMode="numeric"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => { setCreating(false); setName(""); setBankName(""); setLastFourDigits(""); }} className="btn-secondary !py-2 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={!name.trim() || submitting} className="btn-primary !py-2 text-sm">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Add & continue
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap gap-3">
          {sortByFrequent(sourcesForMethod(method, sources), frequentIds, (s) => s.id).map((s) => {
            const active = String(selected) === String(s.id);
            const label = s.bankName ? `${s.name} · ${s.bankName}` : s.name;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium transition active:scale-95 select-none ${
                  active
                    ? "border-primary-300 bg-primary-50 text-primary-700 ring-2 ring-primary-100"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{label}</span>
                {s.lastFourDigits && <span className="text-xs text-gray-400">•••• {s.lastFourDigits}</span>}
              </button>
            );
          })}
          <button
            onClick={() => setCreating(true)}
            className="px-5 py-3 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-gray-400 hover:text-gray-600 hover:border-gray-400 transition select-none"
          >
            + New source
          </button>
        </div>
      )}
    </div>
  );
}

function SubcategoryStep({ categoryId, items, selected, onSelect, onSkip, onCreate }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const createSubcategory = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const created = await categoryApi.createSubcategory(categoryId, { name: name.trim() });
      toast.success("Subcategory added");
      setName("");
      setCreating(false);
      onCreate(created);
    } catch (e) {
      const msg = getErrorMessage(e).toLowerCase();
      const existing = items.find((s) => s.name.toLowerCase() === name.trim().toLowerCase());
      if (msg.includes("already exists") && existing) {
        toast.success("Subcategory added");
        setName("");
        setCreating(false);
        onCreate(existing);
        return;
      }
      toast.error(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in pt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Subcategory</h2>

      {creating ? (
        <form
          onSubmit={(e) => { e.preventDefault(); createSubcategory(); }}
          className="bg-gray-50 rounded-xl p-4 mb-4 animate-slide-up"
        >
          <label className="label text-xs text-gray-400 uppercase tracking-wide mb-1.5">Subcategory name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Groceries"
            className="input mb-3"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => { setCreating(false); setName(""); }} className="btn-secondary !py-2 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={!name.trim() || submitting} className="btn-primary !py-2 text-sm">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Add
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap gap-3">
          {items.map((s) => {
            const active = String(selected) === String(s.id);
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`px-5 py-3 rounded-xl border text-sm font-medium transition active:scale-95 select-none ${
                  active
                    ? "border-primary-300 bg-primary-50 text-primary-700 ring-2 ring-primary-100"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCreating(true)}
          className="px-5 py-3 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-primary-600 hover:text-primary-700 hover:border-gray-400 transition select-none"
        >
          + New subcategory
        </button>
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition select-none"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

function CategoryStep({ categories, selectedId, frequentIds, onSelect, onCreated }) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("💸");
  const [creating, setCreating] = useState(false);
  const inputRef = useRef(null);

  const sorted = sortByFrequent(
    categories.filter((c) => c.id),
    frequentIds,
    (c) => c.id
  );

  const createCategory = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const created = await categoryApi.create({ name: newName.trim(), icon: newIcon, color: "#4c6ef5" });
      setNewName("");
      setNewIcon("💸");
      setShowCreate(false);
      onCreated(created);
    } catch (e) {
      const msg = getErrorMessage(e).toLowerCase();
      const existing = categories.find((c) => c.name.toLowerCase() === newName.trim().toLowerCase());
      if (msg.includes("already exists") && existing) {
        setNewName("");
        setNewIcon("💸");
        setShowCreate(false);
        onCreated(existing);
        return;
      }
      toast.error(getErrorMessage(e));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="animate-fade-in pt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Category</h2>

      {showCreate && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{newIcon}</span>
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name"
              className="input !py-2 flex-1"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && createCategory()}
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {["🍔","🛒","🚕","🏠","💡","📱","🎬","✈️","🏥","🎓","👕","🐾","🎁","💊","🛠️","💸","☕","🍿","⛽","📚"].map(
              (ic) => (
                <button
                  key={ic}
                  onClick={() => setNewIcon(ic)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition ${
                    newIcon === ic ? "ring-2 ring-primary-500 bg-primary-50" : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {ic}
                </button>
              )
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setShowCreate(false); setNewName(""); setNewIcon("💸"); }}
              className="btn-secondary !py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={createCategory}
              disabled={!newName.trim() || creating}
              className="btn-primary !py-2 text-sm"
            >
              {creating && <Loader2 className="w-4 h-4 animate-spin" />}
              Add
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {sorted.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition active:scale-95 select-none ${
              selectedId === cat.id
                ? "border-primary-300 bg-primary-50 text-primary-700 ring-2 ring-primary-100"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg"
              style={{ backgroundColor: cat.color || "#4c6ef5" }}
            >
              {cat.icon || "💸"}
            </div>
            <span className="truncate w-full text-center">{cat.name}</span>
          </button>
        ))}
        {!showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-dashed border-gray-300 text-xs font-medium text-gray-400 hover:text-gray-600 hover:border-gray-400 transition select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
              <Plus className="w-5 h-5" />
            </div>
            <span>New</span>
          </button>
        )}
      </div>
    </div>
  );
}

function NoteStep({ form, onChange, onNext, onSkip }) {
  return (
    <div className="animate-fade-in pt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Any notes?</h2>
      <div className="space-y-4">
        <div>
          <label className="label text-xs text-gray-400 uppercase tracking-wide mb-1.5">Purpose</label>
          <input
            type="text"
            value={form.purpose}
            onChange={(e) => onChange("purpose", e.target.value)}
            placeholder="e.g. Monthly groceries"
            className="input"
          />
        </div>
        <div>
          <label className="label text-xs text-gray-400 uppercase tracking-wide mb-1.5">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Optional"
            className="input resize-none"
            rows={2}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-6">
        <button onClick={onSkip} className="btn-secondary flex-1 !py-3">
          Skip
        </button>
        <button onClick={onNext} className="btn-primary flex-1 !py-3">
          Continue
        </button>
      </div>
    </div>
  );
}

function SplitStep({ form, onChange, amount, submitting, onSave, onBack }) {
  return (
    <div className="animate-fade-in pt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Split?</h2>
      <label className="flex items-center gap-3 cursor-pointer select-none mb-4">
        <div
          className={`relative w-12 h-7 rounded-full transition-colors ${form.isSplit ? "bg-primary-600" : "bg-gray-200"}`}
          onClick={() => onChange("isSplit", !form.isSplit)}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
              form.isSplit ? "translate-x-5" : ""
            }`}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">This is a split expense</span>
      </label>
      {form.isSplit && (
        <div className="animate-slide-up mb-4">
          <label className="label text-xs text-gray-400 uppercase tracking-wide mb-1.5">Split with</label>
          <input
            type="text"
            value={form.splitWith}
            onChange={(e) => onChange("splitWith", e.target.value)}
            placeholder="e.g. Ravi, Priya"
            className="input"
            autoFocus
          />
        </div>
      )}
      <button
        onClick={onSave}
        disabled={submitting || !amount || Number(amount) <= 0}
        className="w-full btn-primary !py-3.5"
      >
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          `Save${amount ? ` -₹${Number(amount).toLocaleString("en-IN")}` : ""}`
        )}
      </button>
    </div>
  );
}

function ProgressSteps({ flow, stepIdx, form, apps, sources, categories, onJump }) {
  const steps = [];
  flow.forEach((step, idx) => {
    if (idx >= stepIdx) return;
    let label = null;
    if (step === "amount") {
      label = form.amount ? `₹${Number(form.amount).toLocaleString("en-IN")}` : null;
    } else if (step === "method") {
      label = form.paymentMethod ? form.paymentMethod.replace("_", " ") : null;
    } else if (step === "app") {
      label = apps.find((a) => String(a.id) === String(form.paymentAppId))?.name || null;
    } else if (step === "account") {
      const src = sources.find((s) => String(s.id) === String(form.paymentSourceId));
      label = src ? (src.bankName ? `${src.name} · ${src.bankName}` : src.name) : null;
    } else if (step === "category") {
      label = categories.find((c) => c.id === form.categoryId)?.name || null;
    } else if (step === "subcategory") {
      label = categories
        .find((c) => c.id === form.categoryId)
        ?.subcategories?.find((s) => s.id === form.subcategoryId)?.name || null;
    } else if (step === "note") {
      label = form.purpose ? "Notes" : null;
    } else if (step === "split") {
      label = form.isSplit ? "Split" : null;
    }
    if (label) steps.push({ idx, label });
  });

  return (
    <div className="flex gap-1.5 flex-wrap">
      {steps.map((s) => (
        <button
          key={s.idx}
          onClick={() => onJump(s.idx)}
          className="text-xs bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700 px-2 py-0.5 rounded-full transition select-none"
        >
          {s.idx === steps[steps.length - 1].idx ? `← ${s.label}` : s.label}
        </button>
      ))}
    </div>
  );
}