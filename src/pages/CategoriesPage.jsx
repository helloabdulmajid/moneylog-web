import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, PlusCircle, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { categoryApi } from "../api/category.js";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import Loading from "../components/Loading.jsx";
import { getErrorMessage } from "../utils/helpers.js";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../utils/constants.js";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type: "category" | "subcategory", data }

  const load = async () => {
    setLoading(true);
    try {
      setCategories(await categoryApi.list());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category? Its subcategories will also be deleted.")) return;
    try {
      await categoryApi.remove(id);
      toast.success("Category deleted");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (!window.confirm("Delete this subcategory?")) return;
    try {
      await categoryApi.removeSubcategory(id);
      toast.success("Subcategory deleted");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Organize your spending into categories"
        action={
          <button className="btn-primary" onClick={() => setModal({ type: "category" })}>
            <Plus className="w-4 h-4" /> New category
          </button>
        }
      />

      {loading ? (
        <Loading />
      ) : categories.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-gray-500 mb-4">No categories yet.</p>
          <button className="btn-primary" onClick={() => setModal({ type: "category" })}>
            <Plus className="w-4 h-4" /> Create your first category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl text-xl text-white"
                    style={{ backgroundColor: category.color || "#6366f1" }}
                  >
                    {category.icon || "💸"}
                  </div>
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-xs text-gray-400">
                      {category.subcategories?.length || 0} subcategories
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    className="btn-icon"
                    onClick={() => setModal({ type: "category", data: category })}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="btn-icon hover:text-red-600"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {category.subcategories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {category.subcategories.map((sub) => (
                    <span
                      key={sub.id}
                      className="badge bg-gray-50 text-gray-600 border border-gray-100"
                    >
                      {sub.name}
                      <button
                        className="text-gray-300 hover:text-red-500"
                        onClick={() => handleDeleteSubcategory(sub.id)}
                        title="Delete subcategory"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <button
                className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium mt-1"
                onClick={() => setModal({ type: "subcategory", data: category })}
              >
                <PlusCircle className="w-4 h-4" /> Add subcategory
              </button>
            </div>
          ))}
        </div>
      )}

      <CategoryModal
        modal={modal}
        onClose={() => setModal(null)}
        onSaved={() => {
          setModal(null);
          load();
        }}
        onDeleteSubcategory={handleDeleteSubcategory}
      />
    </div>
  );
}

function CategoryModal({ modal, onClose, onSaved, onDeleteSubcategory }) {
  const isCategory = modal?.type === "category";
  const isSubcategory = modal?.type === "subcategory";

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🍔");
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [addingSub, setAddingSub] = useState(false);
  const [subName, setSubName] = useState("");

  useEffect(() => {
    if (modal?.type === "category" && modal?.data) {
      setName(modal.data.name);
      setIcon(modal.data.icon || "🍔");
      setColor(modal.data.color || CATEGORY_COLORS[0]);
    } else if (modal?.type === "subcategory") {
      setName("");
    } else {
      setName("");
      setIcon("🍔");
      setColor(CATEGORY_COLORS[0]);
    }
    setAddingSub(false);
    setSubName("");
  }, [modal]);

  const isEdit = isCategory && modal?.data?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isCategory) {
        const payload = { name, icon, color };
        if (isEdit) {
          await categoryApi.update(modal.data.id, payload);
        } else {
          await categoryApi.create(payload);
        }
        toast.success(isEdit ? "Category updated" : "Category created");
      } else if (isSubcategory) {
        await categoryApi.createSubcategory(modal.data.id, { name });
        toast.success("Subcategory added");
      }
      onSaved();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!subName.trim()) return;
    setSubmitting(true);
    try {
      await categoryApi.createSubcategory(modal.data.id, { name: subName.trim() });
      toast.success("Subcategory added");
      onSaved();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (!modal) return null;

  return (
    <Modal
      open
      onClose={onClose}
      title={
        isCategory
          ? isEdit
            ? "Edit category"
            : "New category"
          : `Subcategory for ${modal.data?.name}`
      }
    >
      {isCategory ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Groceries"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Icon</label>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
              {CATEGORY_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`flex items-center justify-center w-9 h-9 rounded-lg text-xl transition ${
                    icon === i
                      ? "ring-2 ring-primary-500 bg-primary-50"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setIcon(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Color</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full transition ${
                    color === c ? "ring-2 ring-offset-2 ring-gray-300" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              <X className="w-4 h-4" /> Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create category"}
            </button>
          </div>
        </form>
      ) : (
        <div>
          {!addingSub && modal.data?.subcategories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {modal.data.subcategories.map((sub) => (
                <span
                  key={sub.id}
                  className="badge bg-gray-50 text-gray-600 border border-gray-100 py-1.5"
                >
                  {sub.name}
                  <button
                    className="text-gray-300 hover:text-red-500"
                    onClick={() => onDeleteSubcategory(sub.id)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {addingSub ? (
            <form onSubmit={handleAddSubcategory} className="space-y-4">
              <div>
                <label className="label">Subcategory name *</label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Fruits & vegetables"
                  className="input"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setAddingSub(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-end">
              <button className="btn-primary" onClick={() => setAddingSub(true)}>
                <Plus className="w-4 h-4" /> Add subcategory
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}