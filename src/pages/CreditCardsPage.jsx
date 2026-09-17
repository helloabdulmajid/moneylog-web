import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, CreditCard, ReceiptText } from "lucide-react";
import toast from "react-hot-toast";
import { creditCardApi } from "../api/card.js";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import Loading from "../components/Loading.jsx";
import PayCardBillModal from "../components/PayCardBillModal.jsx";
import { getErrorMessage, toTitleCase, formatCurrency } from "../utils/helpers.js";
import { CARD_NETWORKS } from "../utils/constants.js";

export default function CreditCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type: "new" | "edit" | "pay", data }
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setCards(await creditCardApi.list());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    try {
      await creditCardApi.remove(deleting.id);
      toast.success("Credit card deleted");
      setDeleting(null);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader
        title="Credit Cards"
        subtitle="Manage your cards and their bills"
        action={
          <button className="btn-primary" onClick={() => setModal({ type: "new" })}>
            <Plus className="w-4 h-4" /> New card
          </button>
        }
      />

      {loading ? (
        <Loading />
      ) : cards.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mx-auto mb-3">
            <CreditCard className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 mb-4">No credit cards yet.</p>
          <button className="btn-primary" onClick={() => setModal({ type: "new" })}>
            <Plus className="w-4 h-4" /> Add your first card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="card p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{card.name}</p>
                    <p className="text-xs text-gray-400">
                      {card.issuer}
                      {card.issuer && card.lastFourDigits ? " • " : ""}
                      {card.lastFourDigits ? `•••• ${card.lastFourDigits}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="btn-icon" onClick={() => setModal({ type: "edit", data: card })}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="btn-icon hover:text-red-600"
                    onClick={() => setDeleting(card)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {card.network && (
                  <span className="badge bg-gray-50 text-gray-600 border border-gray-100">
                    {toTitleCase(card.network)}
                  </span>
                )}
                <span
                  className={`badge ${
                    card.isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {card.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {card.creditLimit != null && (
                <p className="text-sm text-gray-500 mb-3">
                  Limit: <span className="font-medium text-gray-700">{formatCurrency(card.creditLimit)}</span>
                </p>
              )}

              <div className="mt-auto pt-2">
                <button
                  className="flex items-center justify-center gap-1.5 w-full btn-secondary !py-2 text-sm"
                  onClick={() => setModal({ type: "pay", data: card })}
                >
                  <ReceiptText className="w-4 h-4" /> Pay bill
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal?.type !== "pay" && (
        <CardModal
          modal={modal}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}

      {modal?.type === "pay" && (
        <PayCardBillModal
          card={modal.data}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete credit card">
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{deleting?.name || "this card"}</span>? It will be
          deactivated and its bill payments removed.
        </p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setDeleting(null)}>
            Cancel
          </button>
          <button className="btn-danger !py-2.5 px-4" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

function CardModal({ modal, onClose, onSaved }) {
  const item = modal?.data || null;
  const isEdit = !!item;

  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [network, setNetwork] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (modal) {
      setName(item?.name || "");
      setIssuer(item?.issuer || "");
      setLastFourDigits(item?.lastFourDigits || "");
      setNetwork(item?.network || "");
      setCreditLimit(item?.creditLimit ?? "");
      setIsActive(item?.isActive ?? true);
    }
  }, [modal]);

  if (!modal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        issuer: issuer || null,
        lastFourDigits: lastFourDigits || null,
        network: network || null,
        creditLimit: creditLimit ? Number(creditLimit) : null,
        isActive,
      };
      if (isEdit) await creditCardApi.update(item.id, payload);
      else await creditCardApi.create(payload);
      toast.success(isEdit ? "Credit card updated" : "Credit card created");
      onSaved();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={isEdit ? "Edit credit card" : "New credit card"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Card name *</label>
          <input
            type="text"
            required
            placeholder="e.g. HDFC Regalia"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Issuer</label>
            <input
              type="text"
              placeholder="e.g. HDFC, ICICI"
              className="input"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Network</label>
            <select className="input" value={network} onChange={(e) => setNetwork(e.target.value)}>
              <option value="">Select network</option>
              {CARD_NETWORKS.map((n) => (
                <option key={n} value={n}>
                  {toTitleCase(n)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Credit limit</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 500000"
              className="input"
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Active
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            <X className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create card"}
          </button>
        </div>
      </form>
    </Modal>
  );
}