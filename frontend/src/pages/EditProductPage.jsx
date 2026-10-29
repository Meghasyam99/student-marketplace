import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMarketplace } from "../context/MarketplaceContext";

export default function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const {
    products,
    categories,
    updateProduct
  } = useMarketplace();

  const product = products.find(
    (p) => p.id === productId
  );

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Good");

  useEffect(() => {
    if (!product) return;

    setTitle(product.title);
    setCategoryId(product.categoryId);
    setPrice(product.price);
    setDescription(product.description);
    setCondition(product.condition);
  }, [product]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProduct(productId, {
        title,
        categoryId,
        price,
        description,
        condition,
      });

      toast.success("Product updated");
      navigate(`/products/${productId}`);
    } catch (err) {
      toast.error(
        err?.message || "Failed to update product"
      );
    }
  };

  if (!product) {
    return (
      <div className="container py-5">
        Product not found
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">

          <div className="cm-glass p-4">

            <h2 className="mb-4">
              Edit Product
            </h2>

            <form
              className="row g-3"
              onSubmit={onSubmit}
            >
              <div className="col-12">
                <label className="form-label">
                  Product Title
                </label>

                <input
                  className="form-control"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Category
                </label>

                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(e.target.value)
                  }
                >
                  {categories.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                />
              </div>

              <div className="col-12">
                <label className="form-label">
                  Description
                </label>

                <textarea
                  rows="4"
                  className="form-control"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Condition
                </label>

                <select
                  className="form-select"
                  value={condition}
                  onChange={(e) =>
                    setCondition(e.target.value)
                  }
                >
                  <option>Like New</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Update Product
                </button>
              </div>

            </form>

          </div>

        </div>
      </div>
    </div>
  );
}