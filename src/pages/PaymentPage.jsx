import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Smartphone, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { paymentApi } from "../api/payment.js";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import Loading from "../components/Loading.jsx";
import { getErrorMessage, toTitleCase } from "../utils/helpers.js";
import { PAYMENT_APP_TYPES, PAYMENT_SOURCE_TYPES } from "../utils/constants.js";

export default function PaymentPage() {
  const [apps, setApps] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("apps");
  const [modal, setModal] = useState(null); // { type, data }

  const load = async () => {
    setLoading(true);
    try {
      const [appsRes, sourcesRes] = await Promise.all([
        paymentApi.listApps(),
        paymentApi.listSources(),
      ]);
      setApps(appsRes || []);
      setSources(sourcesRes || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      if (type === "app") await paymentApi.removeApp(id);
      else await paymentApi.removeSource(id);
      toast.success(`${type === "app" ? "App" : "Source"} deleted`);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const tabs = [
    { id: "apps", label: "Payment apps", count: apps.length },
    { id: "sources", label: "Sources", count: sources.length },
  ];

  return (
    <div>
      <PageHeader
        title="Payment Methods"
        subtitle="Apps and sources you use to pay"
        action={
          <button
            className="btn-primary"
            onClick={() => setModal({ type: activeTab === "apps" ? "app" : "source" })}
          >
            <Plus className="w-4 h-4" /> Add {activeTab === "apps" ? "app" : "source"}
          </button>
        }
      />

      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span
              className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? "bg-primary-50 text-primary-600" : "bg-gray-200 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : activeTab === "apps" ? (
        <AppsGrid
          apps={apps}
          onAdd={() => setModal({ type: "app" })}
          onEdit={(app) => setModal({ type: "app", data: app })}
          onDelete={(app) => handleDelete("app", app.id)}
        />
      ) : (
        <SourcesGrid
          sources={sources}
          onAdd={() => setModal({ type: "source" })}
          onEdit={(source) => setModal({ type: "source", data: source })}
          onDelete={(source) => handleDelete("source", source.id)}
        />
      )}

      <PaymentModal
        modal={modal}
        onClose={() => setModal(null)}
        onSaved={() => {
          setModal(null);
          load();
        }}
      />
    </div>
  );
}

function AppsGrid({ apps, onAdd, onEdit, onDelete }) {
  if (apps.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mx-auto mb-3">
          <Smartphone className="w-6 h-6" />
        </div>
        <p className="text-sm text-gray-500 mb-4">No payment apps yet.</p>
        <button className="btn-primary" onClick={onAdd}>
          <Plus className="w-4 h-4" /> Add your first app
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {apps.map((app) => (
        <div key={app.id} className="card p-5 flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{app.name}</p>
            <span className="badge bg-gray-50 text-gray-500 border border-gray-100 mt-0.5">
              {toTitleCase(app.type)}
            </span>
          </div>
          <div className="flex items-center">
            <button className="btn-icon" onClick={() => onEdit(app)}>
              <Pencil className="w-4 h-4" />
            </button>
            <button className="btn-icon hover:text-red-600" onClick={() => onDelete(app)}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SourcesGrid({ sources, onAdd, onEdit, onDelete }) {
  if (sources.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mx-auto mb-3">
          <Wallet className="w-6 h-6" />
        </div>
        <p className="text-sm text-gray-500 mb-4">No payment sources yet.</p>
        <button className="btn-primary" onClick={onAdd}>
          <Plus className="w-4 h-4" /> Add your first source
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sources.map((source) => (
        <div key={source.id} className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">{source.name}</p>
                <p className="text-xs text-gray-400">
                  {toTitleCase(source.type)}
                  {source.bankName ? ` • ${source.bankName}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <button className="btn-icon" onClick={() => onEdit(source)}>
                <Pencil className="w-4 h-4" />
              </button>
              <button className="btn-icon hover:text-red-600" onClick={() => onDelete(source)}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {source.lastFourDigits ? (
              <span className="text-sm text-gray-500 font-medium">
                •••• {source.lastFourDigits}
              </span>
            ) : (
              <span />
            )}
            <span
              className={`badge ${
                source.isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {source.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PaymentModal({ modal, onClose, onSaved }) {
  const isApp = modal?.type === "app";
  const item = modal?.data || null;
  const isEdit = !!item;

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [bankName, setBankName] = useState("");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (modal) {
      setName(item?.name || "");
      setType(item?.type || (isApp ? PAYMENT_APP_TYPES[0] : PAYMENT_SOURCE_TYPES[0]));
      setBankName(item?.bankName || "");
      setLastFourDigits(item?.lastFourDigits || "");
    }
  }, [modal]);

  if (!modal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isApp) {
        const payload = { name, type };
        if (isEdit) await paymentApi.updateApp(item.id, payload);
        else await paymentApi.createApp(payload);
      } else {
        const payload = { name, type, bankName: bankName || null, lastFourDigits: lastFourDigits || null };
        if (isEdit) await paymentApi.updateSource(item.id, payload);
        else await paymentApi.createSource(payload);
      }
      toast.success("Saved successfully");
      onSaved();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={
        isApp
          ? isEdit
            ? "Edit payment app"
            : "New payment app"
          : isEdit
          ? "Edit source"
          : "New source"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Name *</label>
          <input
            type="text"
            required
            placeholder={isApp ? "e.g. GPay" : "e.g. HDFC Salary Account"}
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Type *</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            {(isApp ? PAYMENT_APP_TYPES : PAYMENT_SOURCE_TYPES).map((t) => (
              <option key={t} value={t}>
                {toTitleCase(t)}
              </option>
            ))}
          </select>
        </div>

        {!isApp && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Bank name</label>
              <input
                type="text"
                placeholder="e.g. HDFC"
                className="input"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Last 4 digits</label>
              <input
                type="text"
                maxLength={4}
                placeholder="1234"
                className="input"
                value={lastFourDigits}
                onChange={(e) => setLastFourDigits(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            <X className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}