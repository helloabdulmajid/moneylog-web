import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "./Modal.jsx";
import { billPaymentApi } from "../api/billPayment.js";
import { paymentApi } from "../api/payment.js";
import { getErrorMessage, toTitleCase } from "../utils/helpers.js";
import { PAYMENT_METHODS, PAY_CHANNEL_SUGGESTIONS } from "../utils/constants.js";

export default function PayCardBillModal({ bill, card, onClose, onSaved }) {
  const isEdit = !!bill;
  const targetCard = card || bill?.creditCard || null;
  const [apps, setApps] = useState([]);
  const [sources, setSources] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState(() => ({
    amount: bill?.amount ?? "",
    paymentDate: bill?.paymentDate || new Date().toISOString().slice(0, 10),
    paymentTime: bill?.paymentTime || "",
    paymentChannel: bill?.paymentChannel || "",
    paymentAppId: bill?.paymentApp?.id || "",
    paymentMethod: bill?.paymentMethod || "",
    paidFromSourceId: bill?.paidFromSource?.id || "",
    note: bill?.note || "",
  }));

  useEffect(() => {
    Promise.all([paymentApi.listApps(), paymentApi.listActiveSources()]).then(
      ([appsRes, sourcesRes]) => {
        setApps(appsRes || []);
        setSources(sourcesRes || []);
      }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetCard?.id) {
      toast.error("Select a credit card first");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        creditCardId: targetCard.id,
        amount: Number(form.amount),
        paymentDate: form.paymentDate,
        paymentTime: form.paymentTime || null,
        paymentChannel: form.paymentChannel.trim() || null,
        paymentAppId: form.paymentAppId || null,
        paymentMethod: form.paymentMethod || null,
        paidFromSourceId: form.paidFromSourceId || null,
        note: form.note.trim() || null,
      };
      if (isEdit) {
        await billPaymentApi.update(bill.id, payload);
        toast.success("Bill payment updated");
      } else {
        await billPaymentApi.create(payload);
        toast.success("Bill payment recorded");
      }
      onSaved();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={isEdit ? "Edit bill payment" : "Pay card bill"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!card && (
          <div>
            <label className="label">Credit card</label>
            <input type="text" value={targetCard?.name || ""} readOnly className="input bg-gray-50" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Amount *</label>
            <input
              type="number"
              name="amount"
              min="0.01"
              step="0.01"
              required
              placeholder="0.00"
              className="input"
              value={form.amount}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Payment method</label>
            <select name="paymentMethod" className="input" value={form.paymentMethod} onChange={handleChange}>
              <option value="">Select method</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {toTitleCase(m)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Payment date *</label>
            <input
              type="date"
              name="paymentDate"
              className="input"
              value={form.paymentDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Time (optional)</label>
            <input
              type="time"
              name="paymentTime"
              className="input"
              value={form.paymentTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="label">Payment channel</label>
          <input
            type="text"
            name="paymentChannel"
            list="payChannelOptions"
            placeholder="e.g. CRED, PhonePe, Bank app"
            className="input"
            value={form.paymentChannel}
            onChange={handleChange}
          />
          <datalist id="payChannelOptions">
            {PAY_CHANNEL_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Payment app</label>
            <select name="paymentAppId" className="input" value={form.paymentAppId} onChange={handleChange}>
              <option value="">Select app</option>
              {apps.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Paid from</label>
            <select name="paidFromSourceId" className="input" value={form.paidFromSourceId} onChange={handleChange}>
              <option value="">Select source</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Note</label>
          <input
            type="text"
            name="note"
            placeholder="e.g. July month bill"
            className="input"
            value={form.note}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            <X className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Save changes" : "Save bill payment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}