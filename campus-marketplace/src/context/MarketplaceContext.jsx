/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES as CATEGORY_ICON_SOURCE } from "../data/mockData";
import { apiRequest, getApiBaseUrl, readStoredTokens, writeStoredTokens } from "../api/client";

const MarketplaceContext = createContext(null);

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=1200&q=60";

function buildCategoryIconMap() {
  const map = new Map();
  for (const c of CATEGORY_ICON_SOURCE) map.set(c.id, c.icon);
  return map;
}

function mapApiCategory(apiCategory, iconMap) {
  return {
    id: apiCategory.slug,
    name: apiCategory.name,
    icon: iconMap.get(apiCategory.slug) ?? "tag",
    backendId: apiCategory.id,
  };
}

function mapApiUser(apiUser) {
  if (!apiUser) return null;
  return {
    id: String(apiUser.id),
    fullName: apiUser.full_name ?? "",
    collegeName: apiUser.college_name ?? "",
    email: apiUser.email ?? "",
    phone: apiUser.phone_number ?? "",
    role: "student",
  };
}

function mapApiProfile(apiProfile) {
  if (!apiProfile) return null;
  return {
    id: String(apiProfile.user_id ?? apiProfile.username ?? apiProfile.email),
    fullName: apiProfile.full_name ?? "",
    collegeName: apiProfile.college_name ?? "",
    email: apiProfile.email ?? "",
    phone: apiProfile.phone_number ?? "",
    role: "student",
  };
}

function mapApiProduct(apiProduct, categoriesByBackendId) {
  const category = apiProduct.category;
  const categorySlug = category?.slug || categoriesByBackendId.get(category?.id)?.id;

  const rawImage = apiProduct.images?.[0]?.image || apiProduct.images?.[0]?.url || "";
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${getApiBaseUrl().replace(/\/+$/, "")}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
    : DEFAULT_PRODUCT_IMAGE;

  return {
    id: String(apiProduct.id),
    title: apiProduct.title,
    price: Number(apiProduct.price),
    description: apiProduct.description,
    condition: apiProduct.condition,
    categoryId: categorySlug || "books",
    imageUrl,
    sellerId: String(apiProduct.seller?.id ?? ""),
    postedAt: apiProduct.created_at,
    flags: apiProduct.flags ?? { featured: false, trending: false },
    __api: apiProduct,
  };
}

export function MarketplaceProvider({ children }) {
  const iconMapRef = useRef(buildCategoryIconMap());

  const [categories, setCategories] = useState(() => CATEGORY_ICON_SOURCE);
  const [products, setProducts] = useState([]);
  const [usersById, setUsersById] = useState(() => new Map());
  const [wishlistIds, setWishlistIds] = useState(() => new Set());
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => readStoredTokens().access);
  const [refreshToken, setRefreshToken] = useState(() => readStoredTokens().refresh);

  const isAuthenticated = Boolean(accessToken);

  const setTokens = useCallback(({ access, refresh }) => {
    if (typeof access === "string") setAccessToken(access);
    if (typeof refresh === "string") setRefreshToken(refresh);
    writeStoredTokens({ access, refresh });
  }, []);

  const clearSession = useCallback(() => {
    setTokens({ access: "", refresh: "" });
    setCurrentUser(null);
    setWishlistIds(new Set());
  }, [setTokens]);

  const request = useCallback(
    async (path, opts = {}) => {
      return apiRequest(path, {
        ...opts,
        accessToken,
        refreshToken,
        onTokens: (t) => setTokens({ access: t.access, refresh: t.refresh }),
      });
    },
    [accessToken, refreshToken, setTokens]
  );

  const categoriesByBackendId = useMemo(() => {
    const map = new Map();
    for (const c of categories) {
      if (c.backendId != null) map.set(c.backendId, c);
    }
    return map;
  }, [categories]);

  useEffect(() => {
    let cancelled = false;

    const loadPublic = async () => {
      const apiCats = await request("/api/categories/");
      if (cancelled) return;

      const mappedCats = Array.isArray(apiCats)
        ? apiCats.map((c) => mapApiCategory(c, iconMapRef.current))
        : CATEGORY_ICON_SOURCE;
      setCategories(mappedCats);

      const apiProducts = await request("/api/products/");
      if (cancelled) return;

      const catMap = new Map();
      for (const c of mappedCats) {
        if (c.backendId != null) catMap.set(c.backendId, c);
      }

      const mappedProducts = Array.isArray(apiProducts)
        ? apiProducts.map((p) => mapApiProduct(p, catMap))
        : [];
      setProducts(mappedProducts);

      setUsersById(() => {
        const next = new Map();
        for (const p of mappedProducts) {
          const seller = mapApiUser(p.__api?.seller);
          if (seller?.id) next.set(seller.id, seller);
        }
        return next;
      });
    };

    loadPublic().catch(() => {
      // If API isn't running yet, keep UI usable with built-in categories.
      if (!cancelled) {
        setCategories(CATEGORY_ICON_SOURCE);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPrivate = async () => {
      if (!isAuthenticated) return;

      const profile = await request("/api/auth/profile/");
      if (cancelled) return;
      const mappedProfile = mapApiProfile(profile);
      setCurrentUser(mappedProfile);

      setUsersById((prev) => {
        const next = new Map(prev);
        if (mappedProfile?.id) next.set(String(mappedProfile.id), mappedProfile);
        return next;
      });

      const items = await request("/api/wishlist/");
      if (cancelled) return;
      const ids = new Set(
        Array.isArray(items)
          ? items
              .map((i) => String(i?.product?.id))
              .filter(Boolean)
          : []
      );
      setWishlistIds(ids);
    };

    loadPrivate().catch((err) => {
      if (err?.status === 401) clearSession();
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const api = useMemo(() => {
    const users = Array.from(usersById.values());

    const getUserById = (id) => usersById.get(String(id)) ?? null;
    const getCategoryById = (id) => categories.find((c) => c.id === id) ?? null;

    const isWishlisted = (productId) => wishlistIds.has(String(productId));

    const toggleWishlist = async (productId) => {
      if (!isAuthenticated) {
        const err = new Error("Please login to use wishlist");
        err.code = "AUTH_REQUIRED";
        throw err;
      }

      const result = await request("/api/wishlist/toggle/", {
        method: "POST",
        json: { product_id: Number(productId) },
      });

      setWishlistIds((prev) => {
        const next = new Set(prev);
        const idStr = String(productId);
        if (result?.saved) next.add(idStr);
        else next.delete(idStr);
        return next;
      });
      return result;
    };

    const login = async ({ email, password }) => {
      const token = await request("/api/auth/token/", {
        method: "POST",
        json: { username: email, password },
        retryOn401: false,
      });

      setTokens({ access: token?.access || "", refresh: token?.refresh || "" });
      const profile = await apiRequest("/api/auth/profile/", {
        accessToken: token?.access || "",
        refreshToken: token?.refresh || "",
      });
      const mappedProfile = mapApiProfile(profile);
      setCurrentUser(mappedProfile);
      setUsersById((prev) => {
        const next = new Map(prev);
        if (mappedProfile?.id) next.set(String(mappedProfile.id), mappedProfile);
        return next;
      });
      return mappedProfile;
    };

    const logout = () => clearSession();

    const registerUser = async ({ fullName, collegeName, email, phone, password, confirmPassword }) => {
      await request("/api/auth/register/", {
        method: "POST",
        json: {
          full_name: fullName,
          college_name: collegeName,
          email,
          phone_number: phone || "",
          password,
          confirm_password: confirmPassword,
        },
        retryOn401: false,
      });
      return login({ email, password });
    };

    const updateProfile = async (patch) => {
      if (!isAuthenticated) {
        const err = new Error("Please login to update profile");
        err.code = "AUTH_REQUIRED";
        throw err;
      }

      const updated = await request("/api/auth/profile/", {
        method: "PATCH",
        json: {
          full_name: patch.fullName,
          college_name: patch.collegeName,
          phone_number: patch.phone,
        },
      });
      const mapped = mapApiProfile(updated);
      setCurrentUser(mapped);
      setUsersById((prev) => {
        const next = new Map(prev);
        if (mapped?.id) next.set(String(mapped.id), mapped);
        return next;
      });
      return mapped;
    };

    const addProduct = async (draft) => {
      if (!isAuthenticated) {
        const err = new Error("Please login to add a product");
        err.code = "AUTH_REQUIRED";
        throw err;
      }

      const category = categories.find((c) => c.id === draft.categoryId);
      const created = await request("/api/products/", {
        method: "POST",
        json: {
          title: draft.title,
          price: String(draft.price),
          description: draft.description,
          condition: draft.condition,
          category_id: category?.backendId,
          is_active: true,
        },
      });

      if (draft.imageFile) {
        const fd = new FormData();
        fd.append("image", draft.imageFile);
        await request(`/api/products/${created.id}/upload-image/`, {
          method: "POST",
          body: fd,
        });
      }

      // Refresh public list so UI stays in sync.
      const apiProducts = await request("/api/products/");
      const catMap = new Map();
      for (const c of categories) {
        if (c.backendId != null) catMap.set(c.backendId, c);
      }
      const mappedProducts = Array.isArray(apiProducts)
        ? apiProducts.map((p) => mapApiProduct(p, catMap))
        : [];
      setProducts(mappedProducts);

      setUsersById((prev) => {
        const next = new Map(prev);
        for (const p of mappedProducts) {
          const seller = mapApiUser(p.__api?.seller);
          if (seller?.id) next.set(seller.id, seller);
        }
        return next;
      });

      return mappedProducts.find((p) => p.id === String(created.id)) || mapApiProduct(created, catMap);
    };

    const updateProduct = async (productId, patch) => {
      const updated = await request(`/api/products/${productId}/`, {
        method: "PATCH",
        json: patch,
      });
      setProducts((prev) => prev.map((p) => (p.id === String(productId) ? mapApiProduct(updated, categoriesByBackendId) : p)));
      return updated;
    };

    const deleteProduct = async (productId) => {
      await request(`/api/products/${productId}/`, {
        method: "DELETE",
      });
      setProducts((prev) => prev.filter((p) => p.id !== String(productId)));
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(String(productId));
        return next;
      });
    };

    return {
      categories,
      products,
      users,
      currentUser,
      isAuthenticated,
      login,
      registerUser,
      updateProfile,
      wishlistIds,
      isWishlisted,
      toggleWishlist,
      addProduct,
      updateProduct,
      deleteProduct,
      getUserById,
      getCategoryById,
      logout,
    };
  }, [
    categories,
    products,
    usersById,
    currentUser,
    wishlistIds,
    isAuthenticated,
    categoriesByBackendId,
    request,
    clearSession,
    setTokens,
  ]);

  return <MarketplaceContext.Provider value={api}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used within MarketplaceProvider");
  return ctx;
}
