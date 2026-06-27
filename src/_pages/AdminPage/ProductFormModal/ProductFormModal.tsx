"use client";

import { axiosClassic } from "@/api/helpers/api.interceptor";
import productService from "@/api/services/productService.service";
import { useStoneCategories, useUpsertProduct } from "@/hooks/admin.hooks";
import { Characteristic, ProductFull } from "@/types/Product.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ComplectPickerModal from "./ComplectPickerModal";
import styles from "./ProductFormModal.module.scss";
import ProductReviewsAdmin from "./ProductReviewsAdmin";

interface PickedProduct {
  id: number;
  title: string;
  imageUrl: string;
}

interface Category {
  id: number;
  label: string;
  slug: string;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageMeta {
  id: string | null;
  displayOrder: number;
  delete: boolean;
}

interface FormState {
  stoneCategoryId: number | null;
  id: number | null;
  title: string;
  description: string;
  fullDescription: string;
  article: string;

  isComplect: boolean;
  quantityInStock: number;
  complectItems: number[];
  sale: number;
  currency: string;
  useFillImage: boolean;
  originalPrice: number;
  inShops: string[];
  characteristics: Characteristic[];
  isSouvenir: boolean;
  isNaturalStone: boolean;
  categoryId: string;
  isAdvertisement: boolean;
  advertisementType: string;
  imagesMeta: ImageMeta[];
}

const EMPTY: FormState = {
  id: null,
  article: "",
  title: "",
  description: "",
  fullDescription: "",
  isComplect: false,
  quantityInStock: 0,
  complectItems: [],
  sale: 0,
  stoneCategoryId: null,
  currency: "BYN",
  useFillImage: false,
  originalPrice: 0,
  inShops: [],
  characteristics: [],
  isSouvenir: false,
  isNaturalStone: false,
  categoryId: "",
  isAdvertisement: false,
  advertisementType: "",
  imagesMeta: [],
};

interface Props {
  productId: number | null;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductFormModal({ productId, onClose }: Props) {
  const isEdit = productId !== null && productId !== 0;
  const [isStonePickerOpen, setIsStonePickerOpen] = useState(false);
  const { data: stoneCategories = [] } = useStoneCategories();
  const mouseDownOnOverlay = useRef(false);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [existingImages, setExistingImages] = useState<
    { id: string; url: string; displayOrder: number }[]
  >([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [shopInput, setShopInput] = useState("");
  const [complectProducts, setComplectProducts] = useState<PickedProduct[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upsertMutation = useUpsertProduct();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () =>
      axiosClassic.get<Category[]>("/categories").then((r) => r.data),
    staleTime: Infinity,
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Load product for edit mode
  useEffect(() => {
    if (!isEdit) return;
    if (stoneCategories.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    productService.getProductById(productId!).then((res) => {
      if (res.isError || !res.data) {
        setIsLoading(false);
        return;
      }
      const p = res.data as ProductFull;
      setForm({
        id: p.id,
        title: p.title,
        description: p.description,
        fullDescription: p.fullDescription ?? "",
        isComplect: p.isComplect,
        quantityInStock: 0,
        complectItems: p.complectItems?.map((c) => c.id) ?? [],
        sale: p.sale,
        currency: p.currency ?? "BYN",
        useFillImage: p.useFillImage,
        originalPrice: p.originalPrice,
        inShops: p.inShops ?? [],
        characteristics: p.characteristics ?? [],
        isSouvenir: p.isSouvenir,
        isNaturalStone: p.isNaturalStone ?? true,
        stoneCategoryId:
          stoneCategories.find((s) => s.label === p.stoneCategory)?.id ?? null,
        categoryId: String(
          categories.find((c) => c.label === p.category)?.id ?? "",
        ),
        isAdvertisement: p.isAdvertisement ?? false,
        advertisementType: p.advertisementType ?? "",
        article: p.article ?? "",
        imagesMeta:
          p.images?.map((img, i) => ({
            id: img.id,
            displayOrder: img.displayOrder ?? i,
            delete: false,
          })) ?? [],
      });
      setExistingImages(p.images ?? []);
      setComplectProducts(
        p.complectItems?.map((c) => ({
          id: c.id,
          title: c.title,
          imageUrl: c.imageUrl,
        })) ?? [],
      );
      setIsLoading(false);
    });
  }, [productId, stoneCategories]);

  // ── Image handlers ───────────────────────────────────────────────────────

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      setNewImages((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.onload = (e) =>
        setNewPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleExistingDelete = (id: string) =>
    setForm((f) => ({
      ...f,
      imagesMeta: f.imagesMeta.map((m) =>
        m.id === id ? { ...m, delete: !m.delete } : m,
      ),
    }));

  // ── Shop handlers ────────────────────────────────────────────────────────

  const addShop = () => {
    const val = shopInput.trim();
    if (!val) return;
    set("inShops", [...form.inShops, val]);
    setShopInput("");
  };

  // ── Characteristic handlers ──────────────────────────────────────────────

  const updateChar = (idx: number, key: "name" | "value", val: string) =>
    set(
      "characteristics",
      form.characteristics.map((c, i) =>
        i === idx ? { ...c, [key]: val } : c,
      ),
    );

  const removeChar = (idx: number) =>
    set(
      "characteristics",
      form.characteristics.filter((_, i) => i !== idx),
    );

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!form.categoryId) {
      toast.error("Выберите категорию");
      return;
    }
    const product = {
      id: form.id,
      title: form.title,
      article: form.article,
      description: form.description,
      fullDescription: form.fullDescription,
      isComplect: form.isComplect,
      isNaturalStone: form.isNaturalStone,
      quantityInStock: Number(form.quantityInStock),
      complectItems: form.complectItems,
      sale: Number(form.sale),
      currency: form.currency,
      stoneCategoryId: form.stoneCategoryId,
      useFillImage: form.useFillImage,
      originalPrice: Number(form.originalPrice),
      inShops: form.inShops,
      characteristics: form.characteristics.filter((c) => c.name.trim()),
      isSouvenir: form.isSouvenir,
      categoryId: Number(form.categoryId),
      isAdvertisement: form.isAdvertisement,
      advertisementType: form.advertisementType,
      imagesMeta: [
        ...form.imagesMeta,
        ...newImages.map((_, i) => ({
          id: null,
          displayOrder: form.imagesMeta.length + i,
          delete: false,
        })),
      ],
    };
    console.log("stoneCategoryId отправляем:", form.stoneCategoryId);
    console.log("полный объект:", product);
    try {
      await upsertMutation.mutateAsync({ product, images: newImages });
      toast.success(isEdit ? "Товар обновлён" : "Товар создан");
      onClose();
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message;
      try {
        const parsed = JSON.parse(msg ?? "");
        const errors = parsed?.errors;
        if (errors && typeof errors === "object") {
          Object.values(errors).forEach((v) => toast.error(String(v)));
        } else {
          toast.error(parsed?.message ?? msg ?? "Ошибка");
        }
      } catch {
        toast.error(msg ?? "Ошибка");
      }
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        mouseDownOnOverlay.current = e.target === e.currentTarget;
      }}
      onMouseUp={(e) => {
        if (mouseDownOnOverlay.current && e.target === e.currentTarget) {
          onClose();
        }
        mouseDownOnOverlay.current = false;
      }}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEdit ? `Редактировать товар #${productId}` : "Создать товар"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <span />
            <span />
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>Загрузка...</div>
        ) : (
          <div className={styles.body}>
            {/* ── Section: Основное ─────────────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Основное</h3>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Название</label>
                <input
                  className={styles.input}
                  value={form.title}
                  placeholder="Название товара"
                  onChange={(e) => set("title", e.target.value)}
                />
              </div>
              <div className={styles.fieldHalf}>
                <label className={styles.label}>Артикул</label>
                <input
                  className={styles.input}
                  value={form.article}
                  placeholder="Артикул товара"
                  onChange={(e) => set("article", e.target.value)}
                />
              </div>
              <div className={styles.fieldFull}>
                <label className={styles.label}>Краткое описание</label>
                <textarea
                  className={styles.textarea}
                  value={form.description}
                  rows={2}
                  placeholder="Краткое описание"
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Полное описание</label>
                <textarea
                  className={styles.textarea}
                  value={form.fullDescription}
                  rows={4}
                  placeholder="Подробное описание"
                  onChange={(e) => set("fullDescription", e.target.value)}
                />
              </div>
            </section>

            {/* ── Section: Цены ─────────────────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Цены и наличие</h3>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Цена</label>
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    value={form.originalPrice}
                    onChange={(e) =>
                      set("originalPrice", Number(e.target.value))
                    }
                  />
                </div>

                <div className={styles.fieldNarrow}>
                  <label className={styles.label}>Валюта</label>
                  <select
                    className={styles.select}
                    value={form.currency}
                    onChange={(e) => set("currency", e.target.value)}
                  >
                    <option value="BYN">BYN</option>
                    <option value="RUB">RUB</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div className={styles.fieldNarrow}>
                  <label className={styles.label}>Скидка %</label>
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    max={100}
                    value={form.sale}
                    onChange={(e) => set("sale", Number(e.target.value))}
                  />
                </div>

                <div className={styles.fieldNarrow}>
                  <label className={styles.label}>На складе</label>
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    value={form.quantityInStock}
                    onChange={(e) =>
                      set("quantityInStock", Number(e.target.value))
                    }
                  />
                </div>

                <div className={styles.fieldNarrow}>
                  <label className={styles.label}>Категория</label>
                  <select
                    className={styles.select}
                    value={form.categoryId}
                    onChange={(e) => set("categoryId", e.target.value)}
                  >
                    <option value="">— выбрать —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* ── Section: Параметры ────────────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Параметры</h3>

              <div className={styles.toggleRow}>
                {(
                  [
                    ["isComplect", "Комплект"],
                    ["useFillImage", "Заливка фото"],
                    ["isSouvenir", "Сувенир"],
                    ["isNaturalStone", "Натуральный камень"],
                    ["isAdvertisement", "Реклама"],
                  ] as [keyof FormState, string][]
                ).map(([key, label]) => (
                  <label key={String(key)} className={styles.toggle}>
                    <input
                      type="checkbox"
                      className={styles.toggleInput}
                      checked={form[key] as boolean}
                      onChange={(e) => set(key, e.target.checked)}
                    />
                    <span className={styles.toggleTrack} />
                    <span className={styles.toggleText}>{label}</span>
                  </label>
                ))}
              </div>
              {/* Stone category picker */}
              <div className={styles.fieldFull} style={{ marginTop: 16 }}>
                <label className={styles.label}>Категория камня</label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    type="button"
                    className={styles.addLineBtn}
                    onClick={() => setIsStonePickerOpen(true)}
                  >
                    {form.stoneCategoryId
                      ? (stoneCategories.find(
                          (s) => s.id === form.stoneCategoryId,
                        )?.label ?? "Выбрать камень")
                      : "+ Выбрать камень"}
                  </button>
                  {form.stoneCategoryId && (
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => set("stoneCategoryId", null)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Stone Picker Modal */}
              {isStonePickerOpen && (
                <div
                  className={styles.overlay}
                  onClick={() => setIsStonePickerOpen(false)}
                >
                  <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                    style={{ maxWidth: 600 }}
                  >
                    <div className={styles.modalHeader}>
                      <h2 className={styles.modalTitle}>
                        Выбрать категорию камня
                      </h2>
                      <button
                        className={styles.closeBtn}
                        onClick={() => setIsStonePickerOpen(false)}
                      >
                        <span />
                        <span />
                      </button>
                    </div>

                    <div
                      style={{
                        padding: "20px 28px",
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 12,
                        maxHeight: "60vh",
                        overflowY: "auto",
                      }}
                    >
                      {stoneCategories.map((stone) => {
                        const isActive = form.stoneCategoryId === stone.id;
                        return (
                          <div
                            key={stone.id}
                            onClick={() => {
                              set("stoneCategoryId", stone.id);
                              setIsStonePickerOpen(false);
                            }}
                            style={{
                              border: isActive
                                ? "2px solid #1B3C78"
                                : "1px solid rgba(27,60,120,0.12)",
                              borderRadius: 4,
                              padding: 10,
                              cursor: "pointer",
                              background: isActive
                                ? "rgba(27,60,120,0.06)"
                                : "#fff",
                              transition: "all 0.15s",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            {stone.preview && (
                              <img
                                src={stone.preview}
                                alt={stone.label}
                                style={{
                                  width: "100%",
                                  height: 80,
                                  objectFit: "cover",
                                  borderRadius: 3,
                                }}
                              />
                            )}
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: isActive ? "#1B3C78" : "#0d1b2e",
                                textAlign: "center",
                              }}
                            >
                              {stone.label}
                            </span>
                            {isActive && (
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "#1B3C78",
                                  fontWeight: 700,
                                }}
                              >
                                ✓ Выбрано
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {form.isAdvertisement && (
                <div className={styles.fieldHalf}>
                  <label className={styles.label}>Тип рекламы</label>
                  <input
                    className={styles.input}
                    value={form.advertisementType}
                    placeholder="Тип рекламы"
                    onChange={(e) => set("advertisementType", e.target.value)}
                  />
                </div>
              )}

              {form.isComplect && (
                <div className={styles.fieldFull}>
                  <label className={styles.label}>Товары в комплекте</label>
                  <button
                    type="button"
                    className={styles.addLineBtn}
                    onClick={() => setIsPickerOpen(true)}
                  >
                    + Выбрать товары
                  </button>
                  {complectProducts.length > 0 && (
                    <div className={styles.complectChips}>
                      {complectProducts.map((p) => (
                        <div key={p.id} className={styles.complectChip}>
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className={styles.chipImg}
                          />
                          <span className={styles.chipTitle}>{p.title}</span>
                          <button
                            type="button"
                            onClick={() => {
                              set(
                                "complectItems",
                                form.complectItems.filter((id) => id !== p.id),
                              );
                              setComplectProducts((prev) =>
                                prev.filter((cp) => cp.id !== p.id),
                              );
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isPickerOpen && (
                <ComplectPickerModal
                  selectedIds={form.complectItems}
                  onToggle={(product) => {
                    if (form.complectItems.includes(product.id)) {
                      set(
                        "complectItems",
                        form.complectItems.filter((id) => id !== product.id),
                      );
                      setComplectProducts((prev) =>
                        prev.filter((cp) => cp.id !== product.id),
                      );
                    } else {
                      set("complectItems", [...form.complectItems, product.id]);
                      setComplectProducts((prev) => [...prev, product]);
                    }
                  }}
                  onClose={() => setIsPickerOpen(false)}
                />
              )}
            </section>

            {/* ── Section: Магазины ─────────────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Магазины</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {['Салон "ЗОЛОТО"', 'Магазин "СЕРЕБРО"'].map((shop) => {
                  const checked = form.inShops.includes(shop);
                  return (
                    <label
                      key={shop}
                      className={styles.toggle}
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        type="checkbox"
                        className={styles.toggleInput}
                        checked={checked}
                        onChange={() => {
                          set(
                            "inShops",
                            checked
                              ? form.inShops.filter((s) => s !== shop)
                              : [...form.inShops, shop],
                          );
                        }}
                      />
                      <span className={styles.toggleTrack} />
                      <span className={styles.toggleText}>{shop}</span>
                    </label>
                  );
                })}
              </div>

              <div className={styles.tagInput}>
                <input
                  className={styles.input}
                  value={shopInput}
                  placeholder="Добавить другой магазин..."
                  onChange={(e) => setShopInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addShop();
                    }
                  }}
                />
                <button
                  className={styles.addBtn}
                  type="button"
                  onClick={addShop}
                >
                  +
                </button>
              </div>

              {form.inShops.filter(
                (s) => s !== 'Салон "ЗОЛОТО"' && s !== 'Магазин "СЕРЕБРО"',
              ).length > 0 && (
                <div className={styles.tags}>
                  {form.inShops
                    .filter(
                      (s) =>
                        s !== 'Салон "ЗОЛОТО"' && s !== 'Магазин "СЕРЕБРО"',
                    )
                    .map((shop, i) => (
                      <span key={i} className={styles.tag}>
                        {shop}
                        <button
                          type="button"
                          onClick={() =>
                            set(
                              "inShops",
                              form.inShops.filter((s) => s !== shop),
                            )
                          }
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </section>
            {/* ── Section: Характеристики ───────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Характеристики</h3>
              <button
                className={styles.addLineBtn}
                type="button"
                style={{ marginBottom: 12 }}
                onClick={() => {
                  const defaults: Characteristic[] = [
                    { name: "Страна пр-ва", value: "" },
                    { name: "Металл", value: "Серебро 925" },
                    { name: "Вес г", value: "" },
                    { name: "Вставка", value: "" },
                    { name: "Размер", value: "" },
                  ];
                  const existing = form.characteristics.map((c) => c.name);
                  const toAdd = defaults.filter(
                    (d) => !existing.includes(d.name),
                  );
                  set("characteristics", [...form.characteristics, ...toAdd]);
                }}
              >
                + Стандартные характеристики
              </button>
              {form.characteristics.length > 0 && (
                <div className={styles.charList}>
                  {form.characteristics.map((c, i) => (
                    <div key={i} className={styles.charRow}>
                      <input
                        className={styles.input}
                        value={c.name}
                        placeholder="Название"
                        onChange={(e) => updateChar(i, "name", e.target.value)}
                      />
                      <input
                        className={styles.input}
                        value={c.value}
                        placeholder="Значение"
                        onChange={(e) => updateChar(i, "value", e.target.value)}
                      />
                      <button
                        className={styles.removeBtn}
                        type="button"
                        onClick={() => removeChar(i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                className={styles.addLineBtn}
                type="button"
                onClick={() =>
                  set("characteristics", [
                    ...form.characteristics,
                    { name: "", value: "" },
                  ])
                }
              >
                + Добавить характеристику
              </button>
            </section>

            {/* ── Section: Изображения ──────────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Изображения</h3>

              {existingImages.length > 0 && (
                <>
                  <p className={styles.subLabel}>
                    Существующие — нажмите ✕ чтобы отметить на удаление
                  </p>
                  <div className={styles.imageGrid}>
                    {existingImages.map((img) => {
                      const isDeleted =
                        form.imagesMeta.find((m) => m.id === img.id)?.delete ??
                        false;
                      return (
                        <div
                          key={img.id}
                          className={`${styles.imageCard} ${isDeleted ? styles.imageCardDeleted : ""}`}
                        >
                          <img src={img.url} alt="" />
                          <button
                            type="button"
                            className={`${styles.imageAction} ${isDeleted ? styles.imageActionRestore : styles.imageActionDelete}`}
                            onClick={() => toggleExistingDelete(img.id)}
                          >
                            {isDeleted ? "↩" : "✕"}
                          </button>
                          {isDeleted && (
                            <div className={styles.deletedOverlay}>Удалить</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <p className={styles.subLabel}>
                {existingImages.length > 0 ? "Новые фото" : "Загрузить фото"}
              </p>

              <div
                className={styles.uploadZone}
                onClick={() => fileRef.current?.click()}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span>Нажмите чтобы добавить фото</span>
                <span className={styles.uploadHint}>
                  PNG, JPG, WEBP · несколько файлов
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className={styles.fileInput}
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />

              {newPreviews.length > 0 && (
                <div className={styles.imageGrid}>
                  {newPreviews.map((src, i) => (
                    <div key={i} className={styles.imageCard}>
                      <img src={src} alt="" />
                      <button
                        type="button"
                        className={`${styles.imageAction} ${styles.imageActionDelete}`}
                        onClick={() => removeNewImage(i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Reviews section — only in edit mode */}
        {isEdit && !isLoading && <ProductReviewsAdmin productId={productId!} />}

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Отмена
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSubmit}
            disabled={upsertMutation.isPending || isLoading}
          >
            {upsertMutation.isPending
              ? "Сохраняем..."
              : isEdit
                ? "Сохранить"
                : "Создать"}
          </button>
        </div>
      </div>
    </div>
  );
}
