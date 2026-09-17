import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ReceiptText } from "lucide-react";
import toast from "react-hot-toast";
import { billPaymentApi } from "../api/billPayment.js";
import { creditCardApi } from "../api/card.js";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import Loading from "../components/Loading.jsx";
import PayCardBillModal from "../components/PayCardBillModal.jsx";
import { formatCurrency, formatDate, getErrorMessage, toTitleCase } from "../utils/helpers.js";

export default function BillPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [cards, setCards] = useState([]);
  const [pagination, setPagination] = useState({ number: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ month: "", year: "", creditCardId: "" });
  const [modal, setModal] = useState(null); // { type: "new" | "edit", data }
  const [deleting, setDeleting] = useState(null);

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const query = { page: 0, size: 20, ...params };
      if (!query.month && !query.startDate) {
        const now = new Date();
        query.month = now.getMonth() + 1;
        query.year = now.getFullYear();
      }
      const data = await billPaymentApi.list(query);
      setPayments(data.content || []);
      setPagination({ number: data.number, totalPages: data.totalPages, totalElements: data.totalElements });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    creditCardApi.list().then((c) => setCards(c || []));
    load();
  }, []);

  const applyFilter = () => {
    load({
      month: filter.month || undefined,
      year: filter.year || undefined,
      creditCardId: filter.creditCardId || undefined,
    });
  };

  const handleDelete = async () => {
    try {
      await billPaymentApi.remove(deleting.id);
      toast.success("Bill payment deleted");
      setDeleting(null);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  return (
    <div>
      <PageHeader
        title="Bill Payments"
        subtitle="Track every credit card bill payment"
        action={
          <button className="btn-primary" onClick={() => setModal({ type: "new" })}>
            <Plus className="w-4 h-4" /> Pay card bill
          </button>
        }
      />

      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-3">
        <select
          className="input md:w-52"
          value={filter.creditCardId}
          onChange={(e) => setFilter({ ...filter, creditCardId: e.target.value })}
        >
          <option value="">All cards</option>
          {cards.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="input md:w-36"
          value={filter.month}
          onChange={(e) => setFilter({ ...filter, month: e.target.value })}
        >
          <option value="">All months</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          className="input md:w-28"
          value={filter.year}
          onChange={(e) => setFilter({ ...filter, year: e.target.value })}
        >
          <option value="">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button className="btn-secondary" onClick={applyFilter}>
          Apply
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : payments.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mx-auto mb-3">
            <ReceiptText className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 mb-4">No bill payments found.</p>
          <button className="btn-primary" onClick={() => setModal({ type: "new" })}>
            <Plus className="w-4 h-4" /> Record a payment
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">Card</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Channel</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium truncate">{payment.creditCard?.name}</p>
                      <p className="text-xs text-gray-400">
                        {payment.paymentMethod ? toTitleCase(payment.paymentMethod) : "—"}
                        {payment.note ? ` • ${payment.note}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {payment.paymentChannel || (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-rose-600 whitespace-nowrap">
                      − {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        className="btn-icon"
                        onClick={() => setModal({ type: "edit", data: payment })}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="btn-icon hover:text-red-600"
                        onClick={() => setDeleting(payment)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing {payments.length} of {pagination.totalElements}
              </p>
              <div className="flex gap-2">
                <button
                  className="btn-secondary !px-3 !py-1.5 text-xs"
                  disabled={pagination.number === 0}
                  onClick={() => load({ page: pagination.number - 1 })}
                >
                  Prev
                </button>
                <button
                  className="btn-secondary !px-3 !py-1.5 text-xs"
                  disabled={pagination.number + 1 >= pagination.totalPages}
                  onClick={() => load({ page: pagination.number + 1 })}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {modal && (
        <PayCardBillModal
          bill={modal?.type === "edit" ? modal.data : null}
          card={modal?.type === "new" && cards.length === 1 ? cards[0] : null}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete bill payment">
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this bill payment of{" "}
          <span className="font-semibold">
            {deleting ? formatCurrency(deleting.amount) : ""}
          </span>
          ? This action cannot be undone.
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