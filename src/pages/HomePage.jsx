import { useEffect, useState, useRef } from "react";
import { Plus, ChevronLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { expenseApi } from "../api/expense.js";
import { categoryApi } from "../api/category.js";
import { paymentApi } from "../api/payment.js";
import { formatCurrency, getErrorMessage } from "../utils/helpers.js";
import { PAYMENT_METHODS } from "../utils/constants.js";

const METHODS_UI = [
  { value: "UPI", label: "UPI", icon: "💳" },
  { value: "CREDIT_CARD", label: "Credit Card", icon: "💳" },
  { value: "DEBIT_CARD", label: "Debit Card", icon: "💳" },
  { value: "CASH", label: "Cash", icon: "💵" },
  { value: "BANK_TRANSFER", label: "Bank", icon: "🏦" },
  { value: "WALLET", label: "Wallet", icon: "👛" },
];

const METHOD_NEEDS_APP = new Set(["UPI", "WALLET", "BANK_TRANSFER"]);
const METHOD_NEEDS_ACCOUNT = new Set([
  "UPI", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "WALLET", "OTHER",
]);

function appsForMethod(method, apps) {
  const map = {
    UPI: ["UPI", "OTHER"],
    WALLET: ["WALLET", "OTHER"],
    BANK_TRANSFER: ["BANK_APP", "OTHER"],
    CREDIT_CARD: ["CREDIT_CARD", "OTHER"],
    DEBIT_CARD: ["DEBIT_CARD", "OTHER"],
  };
  const types = map[method] || null;
  const filtered = types ? apps.filter((a) => types.includes(a.type)) : apps;
  return filtered.length > 0 ? filtered : apps;
}

function accountsForMethod(method, accounts) {
  const map = {
    CREDIT_CARD: ["CREDIT_CARD"],
    DEBIT_CARD: ["DEBIT_CARD"],
    BANK_TRANSFER: ["BANK_ACCOUNT"],
    WALLET: ["WALLET"],
    UPI: ["BANK_ACCOUNT", "WALLET"],
    OTHER: ["BANK_ACCOUNT", "WALLET", "OTHER"],
  };
  const types = map[method] || null;
  const filtered = types ? accounts.filter((a) => types.includes(a.type)) : accounts;
  return filtered.length > 0 ? filtered : accounts;
}

function sortByFrequent(items, frequentIds, getId) {
  const rank = new Map(frequentIds.map((id, i) => [String(id), i]));
  return [...items].sort(
    (a, b) => (rank.get(String(getId(a))) ?? 99) - (rank.get(String(getId(b))) ?? 99)
  );
}

function buildFlow(method, categoryHasSubs) {
  const f = ["amount", "method"];
  if (METHOD_NEEDS_APP.has(method)) f.push("app");
  if (METHOD_NEEDS_ACCOUNT.has(method)) f.push("account");
  f.push("category");
  if (categoryHasSubs) f.push("subcategory");
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
  const [wizardOpen, setWizardOpen] = useState(false);
  const [date, setDate] = useState(today());
  const [time, setTime] = useState(nowTime());
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const [hints, setHints] = useState(null);
  const [categories, setCategories] = useState([]);
  const [apps, setApps] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    Promise.all([
      expenseApi.entryHints(),
      categoryApi.list(),
      paymentApi.listApps(),
      paymentApi.listAccounts(),
    ]).then(([h, c, a, ac]) => {
      setHints(h || null);
      setCategories(c || []);
      setApps(a || []);
      setAccounts(ac || []);
    });
  }, []);

  const openWizard = () => {
    setWizardOpen(true);
  };

  return (
    <div className="max-w-md mx-auto">
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
          <button
            onClick={openWizard}
            className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200 transition hover:bg-primary-700 active:scale-95 md:hidden"
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <div className="hidden md:flex flex-col items-center justify-center pt-20 animate-fade-in">
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
          apps={apps}
          accounts={accounts}
          onAppsUpdate={(list) => setApps(list)}
          onAccountsUpdate={(list) => setAccounts(list)}
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

function Wizard({ date, time, hints, categories, apps, accounts, onAppsUpdate, onAccountsUpdate, onDone, onBack }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(() => {
    const pref = hints?.lastUsed || {};
    return {
      amount: "",
      paymentMethod: pref.paymentMethod || "",
      paymentAppId: pref.paymentAppId || "",
      paymentAccountId: pref.paymentAccountId || "",
      categoryId: pref.categoryId || "",
      subcategoryId: pref.subcategoryId || "",
      notes: "",
      purpose: "",
      isSplit: false,
      splitWith: "",
    };
  });

  const selectedCat = categories.find((c) => c.id === form.categoryId);
  const flow = buildFlow(form.paymentMethod, selectedCat?.subcategories?.length > 0);
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
        paymentAccountId: form.paymentAccountId || null,
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
            accounts={accounts}
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
              set("paymentAppId", "");
              set("paymentAccountId", "");
              if (val === "CASH" || !METHOD_NEEDS_ACCOUNT.has(val)) {
                const cHasSubs = categories.find((c) => c.id === form.categoryId)?.subcategories?.length > 0;
                const miniFlow = buildFlow(val, cHasSubs);
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
          <AccountStep
            method={form.paymentMethod}
            accounts={accounts}
            frequentIds={hints?.frequent?.accounts?.map((a) => a.id) || []}
            selected={form.paymentAccountId}
            onSelect={(id) => { set("paymentAccountId", id); goNext(); }}
            onCreate={async (account) => {
              set("paymentAccountId", account.id);
              onAccountsUpdate([...accounts, account]);
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
              if (!cat?.subcategories?.length) goNext();
              else goNext();
            }}
            onCreated={async () => {
              const updated = await categoryApi.list();
              setCategories(updated || []);
            }}
          />
        )}
        {currentStep === "subcategory" && (
          <ChipSelectStep
            title="Subcategory"
            items={selectedCat?.subcategories || []}
            selected={form.subcategoryId}
            onSelect={(id) => { set("subcategoryId", id); goNext(); }}
            renderLabel={(s) => s.name}
            onSkip={() => goNext()}
            extra={
              <button
                onClick={async () => {
                  const name = prompt("Subcategory name:");
                  if (!name?.trim()) return;
                  try {
                    await categoryApi.createSubcategory(form.categoryId, { name: name.trim() });
                    toast.success("Subcategory added");
                    const updated = await categoryApi.list();
                    setCategories(updated || []);
                  } catch (e) { toast.error(getErrorMessage(e)); }
                }}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 mt-4 select-none"
              >
                + New subcategory
              </button>
            }
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
      {extra}
      {onSkip && (
        <button onClick={onSkip} className="text-sm text-gray-400 hover:text-gray-600 mt-4 select-none">
          Skip
        </button>
      )}
    </div>
  );
}

function AppStep({ method, apps, frequentIds, selected, onSelect, onCreate }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const typeMap = { UPI: "UPI", WALLET: "WALLET", BANK_TRANSFER: "BANK_APP", CREDIT_CARD: "CREDIT_CARD", DEBIT_CARD: "DEBIT_CARD" };
  const type = typeMap[method] || "OTHER";

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

function AccountStep({ method, accounts, frequentIds, selected, onSelect, onCreate }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [bankName, setBankName] = useState("");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const typeMap = {
    CREDIT_CARD: "CREDIT_CARD",
    DEBIT_CARD: "DEBIT_CARD",
    BANK_TRANSFER: "BANK_ACCOUNT",
    WALLET: "WALLET",
    UPI: "BANK_ACCOUNT",
    OTHER: "OTHER",
  };
  const type = typeMap[method] || "OTHER";

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const created = await paymentApi.createAccount({
        name: name.trim(),
        bankName: bankName.trim() || null,
        lastFourDigits: lastFourDigits.trim().replace(/\D/g, "").slice(0, 4) || null,
        type,
      });
      toast.success("Account added");
      setName("");
      setBankName("");
      setLastFourDigits("");
      setCreating(false);
      onCreate(created);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in pt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Which account?</h2>
      {creating ? (
        <form onSubmit={submit} className="bg-gray-50 rounded-xl p-4 mb-4 animate-slide-up">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Account name e.g. HDFC Savings"
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
          {sortByFrequent(accountsForMethod(method, accounts), frequentIds, (a) => a.id).map((a) => {
            const active = String(selected) === String(a.id);
            const label = a.bankName ? `${a.name} · ${a.bankName}` : a.name;
            return (
              <button
                key={a.id}
                onClick={() => onSelect(a.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium transition active:scale-95 select-none ${
                  active
                    ? "border-primary-300 bg-primary-50 text-primary-700 ring-2 ring-primary-100"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{label}</span>
                {a.lastFourDigits && <span className="text-xs text-gray-400">•••• {a.lastFourDigits}</span>}
              </button>
            );
          })}
          <button
            onClick={() => setCreating(true)}
            className="px-5 py-3 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-gray-400 hover:text-gray-600 hover:border-gray-400 transition select-none"
          >
            + New account
          </button>
        </div>
      )}
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
      await categoryApi.create({ name: newName.trim(), icon: newIcon, color: "#4c6ef5" });
      setNewName("");
      setNewIcon("💸");
      setShowCreate(false);
      onCreated();
    } catch (e) {
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

function ProgressSteps({ flow, stepIdx, form, apps, accounts, categories, onJump }) {
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
      const acct = accounts.find((a) => String(a.id) === String(form.paymentAccountId));
      label = acct ? (acct.bankName ? `${acct.name} · ${acct.bankName}` : acct.name) : null;
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