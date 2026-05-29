import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMarketplace } from "../context/MarketplaceContext";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { categories, addProduct } = useMarketplace();

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "books");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Good");
  const [imageFile, setImageFile] = useState(null);

  const imagePreview = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    if (!imagePreview) return undefined;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Please enter a product title");
    if (!categoryId) return toast.error("Please choose a category");
    if (!price || Number(price) <= 0) return toast.error("Please enter a valid price");
    if (!description.trim()) return toast.error("Please add a short description");

    try {
      const product = await addProduct({
        title: title.trim(),
        categoryId,
        price,
        description: description.trim(),
        condition,
        imageFile,
      });
      toast.success("Product added");
      navigate(`/products/${product.id}`);
    } catch (err) {
      if (err?.code === "AUTH_REQUIRED") {
        toast.error("Please login to add a product");
        navigate("/login");
        return;
      }
      const msg = err?.data?.detail || err?.message || "Failed to add product";
      toast.error(msg);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-2 mb-3">
            <div>
              <div className="h3 fw-bold mb-1">Add product</div>
              <div className="cm-muted">List a student-relevant item in minutes.</div>
            </div>
          </div>

          <div className="cm-glass p-4 p-md-5">
            <form className="row g-3" onSubmit={onSubmit}>
              <div className="col-12">
                <label className="form-label">Product title</label>
                <input
                  className="form-control form-control-lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Data Structures textbook"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Category</label>
                <select
                  className="form-select form-select-lg"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Price</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe item usage, any defects, included accessories…"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Product condition</label>
                <select
                  className="form-select"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option>Like New</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Upload images</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
                <div className="form-text cm-muted">Uploads to your Django backend when you submit.</div>
              </div>

              {imagePreview ? (
                <div className="col-12">
                  <div className="cm-card overflow-hidden">
                    <img className="cm-image" alt="Preview" src={imagePreview} />
                  </div>
                </div>
              ) : null}

              <div className="col-12">
                <button type="submit" className="btn btn-primary cm-btn-gradient btn-lg w-100">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
