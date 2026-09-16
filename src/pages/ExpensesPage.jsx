import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import { expenseApi } from "../api/expense.js";
import { categoryApi } from "../api/category.js";
import { paymentApi } from "../api/payment.js";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import Loading from "../components/Loading.jsx";
import {
  formatCurrency,
  formatDate,
  getErrorMessage,
  toTitleCase,
} from "../utils/helpers.js";
import {
  PAYMENT_METHODS,
  PAYMENT_APP_TYPES,
  ACCOUNT_TYPES,
} from "../utils/constants.js";

const EMPTY_FORM = {
  amount: "",
  expenseDate: new Date().toISOString().slice(0, 10),
  expenseTime: "",
  categoryId: "",
  subcategoryId: "",
  paymentMethod: "",
  paymentAppId: "",
  paymentAccountId: "",
  notes: "",
  purpose: "",
  isSplit: false,
  splitWith: "",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({
    number: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [categories, setCategories] = useState([]);
  const [apps, setApps] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ month: "", year: "", categoryId: "" });
  const [editing, setEditing] = useState(null); // expense being edited, or "new"
  const [deleting, setDeleting] = useState(null);

  const loadExpenses = async (params = {}) => {
    setLoading(true);
    try {
      const query = {
        page: 0,
        size: 20,
        sortBy: "expenseDate",
        sortOrder: "desc",
        ...params,
      };
      if (!query.month && !query.startDate) {
        const now = new Date();
        query.month = now.getMonth() + 1;
        query.year = now.getFullYear();
      }
      if (search.trim()) query.search = search.trim();
      const data = await expenseApi.list(query);
      setExpenses(data.content || []);
      setPagination({
        number: data.number,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadRefs = async () => {
      const [cats, appsRes, accountsRes] = await Promise.all([
        categoryApi.list(),
        paymentApi.listApps(),
        paymentApi.listAccounts(),
      ]);
      setCategories(cats || []);
      setApps(appsRes || []);
      setAccounts(accountsRes || []);
    };
    loadRefs();
    loadExpenses();
  }, []);

  const applyFilter = () => {
    loadExpenses({
      month: filter.month || undefined,
      year: filter.year || undefined,
      categoryId: filter.categoryId || undefined,
    });
  };

  const handleSaved = () => {
    setEditing(null);
    loadExpenses();
    toast.success("Expense saved");
  };

  const handleDelete = async () => {
    try {
      await expenseApi.remove(deleting.id);
      toast.success("Expense deleted");
      loadExpenses();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(null);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  return (
    <div>
      <PageHeader
        title="Expenses"
        subtitle="Log and track every expense"
        action={
          <button className="btn-primary" onClick={() => setEditing("new")}>
            <Plus className="w-4 h-4" /> Add expense
          </button>
        }
      />

      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-10"
            placeholder="Search notes or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadExpenses()}
          />
        </div>
        <select
          className="input md:w-32"
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
        <select
          className="input md:w-44"
          value={filter.categoryId}
          onChange={(e) => setFilter({ ...filter, categoryId: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="btn-secondary" onClick={applyFilter}>
          Apply
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : expenses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-gray-500 mb-4">No expenses found.</p>
          <button className="btn-primary" onClick={() => setEditing("new")}>
            <Plus className="w-4 h-4" /> Add your first expense
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">Expense</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Payment</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 text-lg shrink-0">
                          {expense.category?.icon || "💸"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {expense.category?.name || expense.purpose || "Expense"}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {expense.subcategory?.name}
                            {expense.notes ? ` • ${expense.notes}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                      {formatDate(expense.expenseDate)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {expense.paymentAccount?.name || (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-rose-600 whitespace-nowrap">
                      − {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        className="btn-icon"
                        onClick={() => setEditing(expense)}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="btn-icon hover:text-red-600"
                        onClick={() => setDeleting(expense)}
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
                Showing {expenses.length} of {pagination.totalElements}
              </p>
              <div className="flex gap-2">
                <button
                  className="btn-secondary !px-3 !py-1.5 text-xs"
                  disabled={pagination.number === 0}
                  onClick={() =>
                    loadExpenses({ page: pagination.number - 1, ...currentQuery() })
                  }
                >
                  Prev
                </button>
                <button
                  className="btn-secondary !px-3 !py-1.5 text-xs"
                  disabled={pagination.number + 1 >= pagination.totalPages}
                  onClick={() =>
                    loadExpenses({ page: pagination.number + 1, ...currentQuery() })
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {(editing === "new" || editing?.id) && (
        <ExpenseFormModal
          expense={editing === "new" ? null : editing}
          categories={categories}
          apps={apps}
          accounts={accounts}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete expense"
      >
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this expense of{" "}
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

  function currentQuery() {
    return {
      month: filter.month || undefined,
      year: filter.year || undefined,
      categoryId: filter.categoryId || undefined,
    };
  }
}

function ExpenseFormModal({ expense, categories, apps, accounts, onClose, onSaved }) {
  const isEdit = !!expense;
  const [form, setForm] = useState(() =>
    isEdit
      ? {
          amount: expense.amount,
          expenseDate: expense.expenseDate,
          expenseTime: expense.expenseTime || "",
          categoryId: expense.category?.id || "",
          subcategoryId: expense.subcategory?.id || "",
          paymentMethod: expense.paymentMethod || "",
          paymentAppId: expense.paymentApp?.id || "",
          paymentAccountId: expense.paymentAccount?.id || "",
          notes: expense.notes || "",
          purpose: expense.purpose || "",
          isSplit: expense.isSplit || false,
          splitWith: expense.splitWith || "",
        }
      : EMPTY_FORM
  );
  const [submitting, setSubmitting] = useState(false);

  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const subcategories = selectedCategory?.subcategories || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        amount: Number(form.amount),
        expenseDate: form.expenseDate,
        expenseTime: form.expenseTime || null,
        categoryId: form.categoryId || null,
        subcategoryId: form.subcategoryId || null,
        paymentMethod: form.paymentMethod || null,
        paymentAppId: form.paymentAppId || null,
        paymentAccountId: form.paymentAccountId || null,
        notes: form.notes || null,
        purpose: form.purpose || null,
        isSplit: form.isSplit,
        splitWith: form.splitWith || null,
      };
      if (isEdit) {
        await expenseApi.update(expense.id, payload);
      } else {
        await expenseApi.create(payload);
      }
      onSaved();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={isEdit ? "Edit expense" : "Add expense"}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="label">Date</label>
            <input
              type="date"
              name="expenseDate"
              className="input"
              value={form.expenseDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Time</label>
            <input
              type="time"
              name="expenseTime"
              className="input"
              value={form.expenseTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select name="categoryId" className="input" value={form.categoryId} onChange={handleChange}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Subcategory</label>
            <select
              name="subcategoryId"
              className="input"
              value={form.subcategoryId}
              onChange={handleChange}
              disabled={!selectedCategory}
            >
              <option value="">{selectedCategory ? "Select subcategory" : "Pick a category first"}</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
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
            <label className="label">Payment account</label>
            <select name="paymentAccountId" className="input" value={form.paymentAccountId} onChange={handleChange}>
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Purpose</label>
          <input
            type="text"
            name="purpose"
            placeholder="e.g. Monthly groceries"
            className="input"
            value={form.purpose}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            name="notes"
            rows={2}
            placeholder="Optional notes..."
            className="input resize-none"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              name="isSplit"
              checked={form.isSplit}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Split expense
          </label>
        </div>

        {form.isSplit && (
          <div>
            <label className="label">Split with</label>
            <input
              type="text"
              name="splitWith"
              placeholder="e.g. Friends or names"
              className="input"
              value={form.splitWith}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            <X className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : isEdit ? "Update expense" : "Add expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}