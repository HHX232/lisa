/* eslint-disable @next/next/no-img-element */
"use client";

import {
  AdminReview,
  AdminUser,
  AdvertisementBody,
  InstallmentCard,
  InstallmentCardBody,
  ReviewStatus,
  UpdateAdminUserBody,
} from "@/api/services/admin.service";
import {
  Category,
  CategoryBody,
  useAdminCategories,
  useDeleteCategory,
  useUpsertCategory,
} from "@/api/services/categoryHooks/hooks";
import {
  useAdminAdvertisements,
  useAdminOrders,
  useAdminProducts,
  useAdminReviews,
  useAdminSettings,
  useAdminUsers,
  useChangeAdminOrderStatus,
  useChangeProductStatus,
  useChangeReviewStatus,
  useDeleteAdminProduct,
  useDeleteAdminReview,
  useDeleteAdminUser,
  useDeleteAdvertisement,
  useDeleteGiftCertificate,
  useDeleteInstallmentCard,
  useDeleteStoneCategory,
  useGiftCertificates,
  useImportProductsExcel,
  useInstallmentCards,
  useStoneCategories,
  useUpdateAdminReview,
  useUpdateAdminSettings,
  useUpdateAdminUser,
  useUpsertAdvertisement,
  useUpsertGiftCertificate,
  useUpsertInstallmentCard,
  useUpsertStoneCategory,
} from "@/hooks/admin.hooks";
import { Advertisement } from "@/types/Advertisement.types";
import {
  GiftCertificate,
  GiftCertificateBody,
} from "@/types/GiftCertificate.types";
import { ORDER_STATUS_LABELS, OrderStatus } from "@/types/Order.types";
import { Product, ProductStatus } from "@/types/Product.types";
import { StoneCategory, StoneCategoryBody } from "@/types/StoneCategory.types";
import { UserRole } from "@/types/user.types";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import styles from "./AdminPage.module.scss";
import ProductFormModal from "./ProductFormModal/ProductFormModal";

const PAGE_SIZE = 10;
type Tab =
  | "users"
  | "ads"
  | "products"
  | "orders"
  | "reviews"
  | "stones"
  | "certificates"
  | "categories"| "installment"| 'settings';
const EMPTY_CATEGORY: CategoryBody = {
  id: 0,
  label: "",
  slug: "",
  imagesMeta: [],
};
function AdminSettingsTab() {
  const { data, isLoading } = useAdminSettings()
  const updateMutation = useUpdateAdminSettings()

  const [form, setForm] = useState({ phoneNumber: '', email: '' })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data) setForm({ phoneNumber: data.phoneNumber ?? '', email: data.email ?? '' })
  }, [data])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(form)
      toast.success('Настройки сохранены')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  if (isLoading) return <div className={styles.state}>Загрузка...</div>

  return (
    <div style={{ maxWidth: 480 }}>
      <div className={styles.tabHeader}>
        <span className={styles.count}>Контактные данные админов</span>
      </div>

      <div className={styles.tableWrap} style={{ padding: '28px 28px' }}>
        <div className={styles.formGrid}>
          <label className={styles.formLabel}>
            Номер телефона
            <input
              className={styles.formInput}
              type="text"
              value={form.phoneNumber}
              onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
            />
          </label>
          <label className={styles.formLabel}>
            Email
            <input
              className={styles.formInput}
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Сохраняем...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  )
}
function CategoriesTab() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const upsertMutation = useUpsertCategory();
  const deleteMutation = useDeleteCategory();

  const [editCat, setEditCat] = useState<
    (CategoryBody & { existingImages?: Category["images"] }) | null
  >(null);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditCat({ ...EMPTY_CATEGORY, existingImages: [] });
    setNewImages([]);
    setImagePreviews([]);
  };

  const openEdit = (c: Category) => {
    setEditCat({
      id: c.id,
      label: c.label,
      slug: c.slug,
      imagesMeta: (c.images ?? []).map((img) => ({
        id: img.id,
        displayOrder: img.displayOrder,
        delete: false,
      })),
      existingImages: c.images ?? [],
    });
    setNewImages([]);
    setImagePreviews([]);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setNewImages((prev) => [...prev, ...arr]);
    arr.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const toggleDeleteExisting = (imgId: string) => {
    if (!editCat) return;
    setEditCat(
      (s) =>
        s && {
          ...s,
          imagesMeta: s.imagesMeta.map((m) =>
            m.id === imgId ? { ...m, delete: !m.delete } : m,
          ),
        },
    );
  };

  const removeNewImage = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!editCat) return;
    try {
      const nextOrder = editCat.imagesMeta.length + 1;
      const newImagesMeta = newImages.map((_, i) => ({
        id: null,
        displayOrder: nextOrder + i,
        delete: null,
      }));
      await upsertMutation.mutateAsync({
        category: {
          ...editCat,
          imagesMeta: [...editCat.imagesMeta, ...newImagesMeta],
        },
        images: newImages,
      });
      toast.success(
        editCat.id === 0 ? "Категория создана" : "Категория обновлена",
      );
      setEditCat(null);
      setNewImages([]);
      setImagePreviews([]);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    }
  };

  const handleDelete = async () => {
    if (!deleteCat) return;
    try {
      await deleteMutation.mutateAsync(deleteCat.id);
      toast.success("Удалено");
      setDeleteCat(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    }
  };

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>{categories.length} категорий</span>
        <button className={styles.createBtn} onClick={openCreate}>
          + Добавить
        </button>
      </div>

      {isLoading && <p className={styles.loading}>Загрузка...</p>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Slug</th>
              <th>Превью</th>
              <th>Изображений</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.label}</td>
                <td>{c.slug}</td>
                <td>
                  {c.preview && (
                    <img
                      src={c.preview}
                      alt={c.label}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  )}
                </td>
                <td>{c.images?.length ?? 0}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEdit(c)}
                    >
                      Изменить
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteCat(c)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      {editCat && (
        <div className={styles.overlay} >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setEditCat(null)}
            >
              <span />
              <span />
            </button>
            <h2 className={styles.modalTitle}>
              {editCat.id === 0
                ? "Новая категория"
                : `Редактировать: ${editCat.label}`}
            </h2>

            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                Название
                <input
                  className={styles.formInput}
                  value={editCat.label}
                  onChange={(e) =>
                    setEditCat((s) => s && { ...s, label: e.target.value })
                  }
                />
              </label>
              <label className={styles.formLabel}>
                Slug (для URL)
                <input
                  className={styles.formInput}
                  value={editCat.slug}
                  onChange={(e) =>
                    setEditCat((s) => s && { ...s, slug: e.target.value })
                  }
                />
              </label>

              {/* Existing images */}
              {(editCat.existingImages?.length ?? 0) > 0 && (
                <div
                  className={styles.formLabel}
                  style={{ gridColumn: "1 / -1" }}
                >
                  Текущие изображения
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginTop: 8,
                    }}
                  >
                    {editCat.existingImages!.map((img) => {
                      const deleted =
                        editCat.imagesMeta.find((m) => m.id === img.id)
                          ?.delete ?? false;
                      return (
                        <div
                          key={img.id}
                          style={{
                            position: "relative",
                            opacity: deleted ? 0.3 : 1,
                          }}
                        >
                          <img
                            src={img.url}
                            alt=""
                            style={{
                              width: 64,
                              height: 64,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => toggleDeleteExisting(img.id)}
                            style={{
                              position: "absolute",
                              top: -6,
                              right: -6,
                              background: "#af0e0e",
                              color: "#fff",
                              border: "none",
                              borderRadius: "50%",
                              width: 20,
                              height: 20,
                              cursor: "pointer",
                              fontSize: 12,
                              lineHeight: 1,
                            }}
                          >
                            {deleted ? "↩" : "×"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* New images */}
              <div
                className={styles.formLabel}
                style={{ gridColumn: "1 / -1" }}
              >
                {editCat.id === 0 ? "Изображения" : "Добавить изображения"}
                <div className={styles.imageUpload}>
                  {imagePreviews.map((src, i) => (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        margin: "4px 4px 0 0",
                      }}
                    >
                      <img
                        src={src}
                        alt=""
                        style={{
                          width: 64,
                          height: 64,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          background: "#af0e0e",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className={styles.fileInput}
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <button
                    className={styles.fileBtn}
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    Выбрать файлы
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditCat(null)}
              >
                Отмена
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={upsertMutation.isPending}
              >
                {upsertMutation.isPending ? "Сохраняем..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteCat && (
        <div className={styles.overlay} >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setDeleteCat(null)}
            >
              <span />
              <span />
            </button>
            <h2 className={styles.modalTitle}>Удалить категорию?</h2>
            <p className={styles.deleteText}>
              Вы уверены, что хотите удалить <strong>{deleteCat.label}</strong>?
              Это действие необратимо.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteCat(null)}
              >
                Отмена
              </button>
              <button
                className={styles.dangerBtn}
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Удаляем..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const EMPTY_CARD: InstallmentCardBody = {
  id: 0,
  address: '',
  period: '',
}

function InstallmentCardsTab() {
  const { data: cards = [], isLoading } = useInstallmentCards()
  const upsertMutation = useUpsertInstallmentCard()
  const deleteMutation = useDeleteInstallmentCard()

  const [editCard, setEditCard] = useState<InstallmentCardBody | null>(null)
  const [deleteCard, setDeleteCard] = useState<InstallmentCard | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileRef = useRef<HTMLInputElement>(null)

  const openCreate = () => {
    setEditCard({ ...EMPTY_CARD })
    setImage(null)
    setImagePreview('')
  }

  const openEdit = (c: InstallmentCard) => {
    setEditCard({ id: c.id, address: c.address, period: c.period })
    setImage(null)
    setImagePreview(c.image ?? '')
  }

  const handleFile = (f: File | null) => {
    setImage(f)
    if (f) {
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(f)
    }
  }

  const handleSave = async () => {
    if (!editCard) return
    try {
      await upsertMutation.mutateAsync({ card: editCard, image })
      toast.success(editCard.id === 0 ? 'Карта создана' : 'Карта обновлена')
      setEditCard(null)
      setImage(null)
      setImagePreview('')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  const handleDelete = async () => {
    if (!deleteCard) return
    try {
      await deleteMutation.mutateAsync(deleteCard.id)
      toast.success('Удалено')
      setDeleteCard(null)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>{cards.length} карт</span>
        <button className={styles.createBtn} onClick={openCreate}>+ Добавить</button>
      </div>

      {isLoading && <p className={styles.loading}>Загрузка...</p>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Изображение</th>
              <th>Адрес</th>
              <th>Период</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {!cards.length && (
              <tr><td colSpan={5} className={styles.empty}>Нет карт рассрочки</td></tr>
            )}
            {cards.map((c) => (
              <tr key={c.id}>
                <td className={styles.idCell}>{c.id}</td>
                <td>
                  {c.image
                    ? <img src={c.image} alt={c.address} className={styles.adThumb} />
                    : <span className={styles.noImage}>—</span>}
                </td>
                <td>{c.address}</td>
                <td>{c.period}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEdit(c)}>Изменить</button>
                    <button className={styles.deleteBtn} onClick={() => setDeleteCard(c)}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      {editCard && (
        <div className={styles.overlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setEditCard(null)}>
              <span /><span />
            </button>
            <h2 className={styles.modalTitle}>
              {editCard.id === 0 ? 'Новая карта рассрочки' : `Редактировать карту #${editCard.id}`}
            </h2>

            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                Адрес
                <input
                  className={styles.formInput}
                  value={editCard.address}
                  onChange={(e) => setEditCard((s) => s && { ...s, address: e.target.value })}
                />
              </label>
              <label className={styles.formLabel}>
                Период
                <input
                  className={styles.formInput}
                  value={editCard.period}
                  onChange={(e) => setEditCard((s) => s && { ...s, period: e.target.value })}
                />
              </label>

              <div className={styles.formLabel}>
                Изображение
                <div className={styles.imageUpload}>
                  {imagePreview && (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={imagePreview}
                        alt=""
                        style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 4, display: 'block' }}
                      />
                      <button
                        type="button"
                        onClick={() => { setImage(null); setImagePreview('') }}
                        style={{
                          position: 'absolute', top: -6, right: -6,
                          background: '#af0e0e', color: '#fff', border: 'none',
                          borderRadius: '50%', width: 20, height: 20,
                          cursor: 'pointer', fontSize: 12,
                        }}
                      >×</button>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => { handleFile(e.target.files?.[0] ?? null); e.target.value = '' }}
                  />
                  <button className={styles.fileBtn} type="button" onClick={() => fileRef.current?.click()}>
                    {imagePreview ? 'Заменить фото' : 'Выбрать фото'}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setEditCard(null)}>Отмена</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteCard && (
        <div className={styles.overlay} >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setDeleteCard(null)}>
              <span /><span />
            </button>
            <h2 className={styles.modalTitle}>Удалить карту?</h2>
            <p className={styles.deleteText}>
              Вы уверены, что хотите удалить карту <strong>#{deleteCard.id}</strong>? Это действие необратимо.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteCard(null)}>Отмена</button>
              <button className={styles.dangerBtn} onClick={handleDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Удаляем...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
// ─────────────────────────────────────────────────────────────────────────────
// Users Tab
// ─────────────────────────────────────────────────────────────────────────────
function UsersTab() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(0);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState<UpdateAdminUserBody>({});

  const { data, isLoading, isError } = useAdminUsers({
    search: search || undefined,
    role: roleFilter || undefined,
    page,
    size: PAGE_SIZE,
  });

  const updateMutation = useUpdateAdminUser();
  const deleteMutation = useDeleteAdminUser();

  const openEdit = (user: AdminUser) => {
    setEditUser(user);
    setEditForm({
      role: user.role,
      email: user.email,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified,
      phoneNumberVerified: user.phoneNumberVerified,
      contactInfo: user.contactInfo,
    });
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    await updateMutation.mutateAsync({ id: editUser.id, body: editForm });
    setEditUser(null);
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    await deleteMutation.mutateAsync(deleteUser.id);
    setDeleteUser(null);
  };

  const totalPages = data?.page.totalPages ?? 0;
  const totalElements = data?.page.totalElements ?? 0;

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>{totalElements} записей</span>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Поиск по email, телефону..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
        <select
          className={styles.select}
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">Все роли</option>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        {isLoading && <div className={styles.state}>Загрузка...</div>}
        {isError && <div className={styles.stateError}>Ошибка загрузки</div>}
        {!isLoading && !isError && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Роль</th>
                <th>Email верифицирован</th>
                <th>Тел. верифицирован</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {data?.content.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.empty}>
                    Нет пользователей
                  </td>
                </tr>
              )}
              {data?.content.map((user) => (
                <tr key={user.id}>
                  <td className={styles.idCell}>{user.id}</td>
                  <td>{user.email || "—"}</td>
                  <td>{user.phoneNumber || "—"}</td>
                  <td>
                    <span
                      className={`${styles.roleBadge} ${user.role === "ADMIN" ? styles.roleAdmin : styles.roleUser}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.verifiedBadge} ${user.emailVerified ? styles.yes : styles.no}`}
                    >
                      {user.emailVerified ? "Да" : "Нет"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.verifiedBadge} ${user.phoneNumberVerified ? styles.yes : styles.no}`}
                    >
                      {user.phoneNumberVerified ? "Да" : "Нет"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => openEdit(user)}
                      >
                        Изменить
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteUser(user)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ←
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.pageBtn} ${i === page ? styles.pageBtnActive : ""}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className={styles.overlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setEditUser(null)}
            >
              <span />
              <span />
            </button>
            <h2 className={styles.modalTitle}>
              Редактировать пользователя #{editUser.id}
            </h2>
            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                Роль
                <select
                  className={styles.formSelect}
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      role: e.target.value as UserRole,
                    }))
                  }
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>
              <label className={styles.formLabel}>
                Email
                <input
                  className={styles.formInput}
                  type="email"
                  value={editForm.email ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </label>
              <label className={styles.formLabel}>
                Телефон
                <input
                  className={styles.formInput}
                  type="text"
                  value={editForm.phoneNumber ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, phoneNumber: e.target.value }))
                  }
                />
              </label>
              <label className={styles.formLabel}>
                Контактные данные
                <input
                  className={styles.formInput}
                  type="text"
                  value={editForm.contactInfo ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, contactInfo: e.target.value }))
                  }
                />
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={editForm.emailVerified ?? false}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      emailVerified: e.target.checked,
                    }))
                  }
                />
                Email подтверждён
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={editForm.phoneNumberVerified ?? false}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      phoneNumberVerified: e.target.checked,
                    }))
                  }
                />
                Телефон подтверждён
              </label>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditUser(null)}
              >
                Отмена
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Сохраняем..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteUser && (
        <div className={styles.overlay} >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setDeleteUser(null)}
            >
              <span />
              <span />
            </button>
            <h2 className={styles.modalTitle}>Удалить пользователя?</h2>
            <p className={styles.deleteText}>
              Вы уверены, что хотите удалить{" "}
              <strong>{deleteUser.email || deleteUser.phoneNumber}</strong> (ID:{" "}
              {deleteUser.id})? Это действие необратимо.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteUser(null)}
              >
                Отмена
              </button>
              <button
                className={styles.dangerBtn}
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Удаляем..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ads Tab
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_AD: AdvertisementBody = {
  id: 0,
  title: "",
  description: "",
  specialLabel: "",
  edgeColor: "#072761",
  isActive: true,
  url: "",
  buttonUrl: "",
};

function AdsTab() {
  const { data: ads, isLoading, isError } = useAdminAdvertisements();
  const upsertMutation = useUpsertAdvertisement();
  const deleteMutation = useDeleteAdvertisement();

  const [editAd, setEditAd] = useState<AdvertisementBody | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteAd, setDeleteAd] = useState<Advertisement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditAd({ ...EMPTY_AD });
    setCurrentImage(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const openEdit = (ad: Advertisement) => {
    setEditAd({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      specialLabel: ad.specialLabel,
      edgeColor: ad.edgeColor,
      isActive: ad.isActive ?? true,
      url: ad.url ?? "",
      buttonUrl: ad.buttonUrl ?? "",
    });
    setCurrentImage(ad.image);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleUpsert = async () => {
    if (!editAd) return;
    try {
      await upsertMutation.mutateAsync({
        advertisement: editAd,
        image: imageFile,
      });
      toast.success(editAd.id === 0 ? "Реклама создана" : "Реклама обновлена");
      setEditAd(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message;
      try {
        const parsed = JSON.parse(msg ?? "");
        toast.error(parsed?.message ?? msg ?? "Ошибка");
      } catch {
        toast.error(msg ?? "Ошибка");
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteAd) return;
    await deleteMutation.mutateAsync(deleteAd.id);
    setDeleteAd(null);
  };

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>{ads?.length ?? 0} записей</span>
        <button className={styles.createBtn} onClick={openCreate}>
          + Создать
        </button>
      </div>

      <div className={styles.tableWrap}>
        {isLoading && <div className={styles.state}>Загрузка...</div>}
        {isError && <div className={styles.stateError}>Ошибка загрузки</div>}
        {!isLoading && !isError && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Изображение</th>
                <th>Заголовок</th>
                <th>Описание</th>
                <th>Метка</th>
                <th>Цвет</th>
                <th>Активна</th>
                <th>URL</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {!ads?.length && (
                <tr>
                  <td colSpan={7} className={styles.empty}>
                    Нет рекламных блоков
                  </td>
                </tr>
              )}
              {ads?.map((ad) => (
                <tr key={ad.id}>
                  <td className={styles.idCell}>{ad.id}</td>
                  <td>
                    {ad.image ? (
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className={styles.adThumb}
                      />
                    ) : (
                      <span className={styles.noImage}>—</span>
                    )}
                  </td>
                  <td className={styles.adTitle}>{ad.title || "—"}</td>
                  <td className={styles.adDesc}>{ad.description || "—"}</td>
                  <td>{ad.specialLabel || "—"}</td>
                  <td>
                    <div className={styles.colorCell}>
                      <span
                        className={styles.colorSwatch}
                        style={{ background: ad.edgeColor }}
                      />
                      {ad.edgeColor}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`${styles.verifiedBadge} ${ad.isActive ? styles.yes : styles.no}`}
                    >
                      {ad.isActive ? "Да" : "Нет"}
                    </span>
                  </td>
                  <td className={styles.adDesc}>{ad.url || "—"}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => openEdit(ad)}
                      >
                        Изменить
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteAd(ad)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit / Create Modal */}
      {editAd && (
        <div className={styles.overlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setEditAd(null)}>
              <span />
              <span />
            </button>
            <h2 className={styles.modalTitle}>
              {editAd.id === 0
                ? "Создать рекламу"
                : `Редактировать рекламу #${editAd.id}`}
            </h2>

            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                Заголовок
                <input
                  className={styles.formInput}
                  type="text"
                  value={editAd.title}
                  onChange={(e) =>
                    setEditAd((f) => f && { ...f, title: e.target.value })
                  }
                />
              </label>
              <label className={styles.formLabel}>
                Описание
                <textarea
                  className={styles.formTextarea}
                  value={editAd.description}
                  rows={3}
                  onChange={(e) =>
                    setEditAd((f) => f && { ...f, description: e.target.value })
                  }
                />
              </label>
              <label className={styles.formLabel}>
                Специальная метка
                <input
                  className={styles.formInput}
                  type="text"
                  value={editAd.specialLabel}
                  onChange={(e) =>
                    setEditAd(
                      (f) => f && { ...f, specialLabel: e.target.value },
                    )
                  }
                />
              </label>
              <label className={styles.formLabel}>
                URL (ссылка на страницу)
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="https://..."
                  value={editAd.url}
                  onChange={(e) =>
                    setEditAd((f) => f && { ...f, url: e.target.value })
                  }
                />
              </label>
              <label className={styles.formLabel}>
                URL кнопки
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="https://..."
                  value={editAd.buttonUrl}
                  onChange={(e) =>
                    setEditAd((f) => f && { ...f, buttonUrl: e.target.value })
                  }
                />
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 4,
                }}
              >
                <div
                  onClick={() =>
                    setEditAd((f) => f && { ...f, isActive: !f.isActive })
                  }
                  style={{
                    width: 42,
                    height: 24,
                    borderRadius: 12,
                    background: editAd.isActive ? "#1B3C78" : "#ddd",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      left: editAd.isActive ? 21 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
                <span
                  style={{ fontSize: 14, color: "#0d1b2e", fontWeight: 500 }}
                >
                  Активна
                </span>
              </div>
              <label className={styles.formLabel}>
                Цвет рамки
                <div className={styles.colorRow}>
                  <input
                    type="color"
                    className={styles.colorPicker}
                    value={editAd.edgeColor}
                    onChange={(e) =>
                      setEditAd((f) => f && { ...f, edgeColor: e.target.value })
                    }
                  />
                  <input
                    className={styles.formInput}
                    type="text"
                    value={editAd.edgeColor}
                    onChange={(e) =>
                      setEditAd((f) => f && { ...f, edgeColor: e.target.value })
                    }
                  />
                </div>
              </label>

              <div className={styles.formLabel}>
                Изображение
                <div className={styles.imageUpload}>
                  {(imagePreview || currentImage) && (
                    <img
                      src={imagePreview ?? currentImage!}
                      alt="preview"
                      className={styles.imagePreview}
                    />
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleImageChange}
                  />
                  <button
                    className={styles.fileBtn}
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    {imageFile ? imageFile.name : "Выбрать файл"}
                  </button>
                  {imageFile && (
                    <button
                      className={styles.fileClear}
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditAd(null)}
              >
                Отмена
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleUpsert}
                disabled={upsertMutation.isPending}
              >
                {upsertMutation.isPending ? "Сохраняем..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteAd && (
        <div className={styles.overlay} >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setDeleteAd(null)}
            >
              <span />
              <span />
            </button>
            <h2 className={styles.modalTitle}>Удалить рекламу?</h2>
            <p className={styles.deleteText}>
              Вы уверены, что хотите удалить рекламу{" "}
              <strong>{deleteAd.title || `#${deleteAd.id}`}</strong>? Это
              действие необратимо.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteAd(null)}
              >
                Отмена
              </button>
              <button
                className={styles.dangerBtn}
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Удаляем..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Products Tab
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<ProductStatus, string> = {
  PENDING: "Ожидает",

  APPROVED: "Активен",
};

function ProductsTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    keyof typeof STATUS_LABELS | ""
  >("");
  const [isAdvertisement, setIsAdvertisement] = useState<boolean | undefined>();
  const [isNaturalStone, setIsNaturalStone] = useState<boolean | undefined>();
  const [isComplect, setIsComplect] = useState<boolean | undefined>();
  const [isSouvenir, setIsSouvenir] = useState<boolean | undefined>();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [formProductId, setFormProductId] = useState<number | null | 0>(null);
  const excelRef = useRef<HTMLInputElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAdminProducts({
    size: PAGE_SIZE,
    title: search || undefined,
    status: statusFilter || undefined,
    isAdvertisement,
    isNaturalStone,
    isComplect,
    isSouvenir,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  const deleteMutation = useDeleteAdminProduct();
  const statusMutation = useChangeProductStatus();
  const importMutation = useImportProductsExcel();

  const handleDelete = async () => {
    if (!deleteProduct) return;
    await deleteMutation.mutateAsync(deleteProduct.id);
    setDeleteProduct(null);
  };

  const handleStatusChange = (id: number, status: ProductStatus) => {
    statusMutation.mutate({ id, status });
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await importMutation.mutateAsync(file);
      setImportResult(res?.message ?? "Импорт завершён");
    } catch {
      setImportResult("Ошибка импорта");
    } finally {
      if (excelRef.current) excelRef.current.value = "";
    }
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const totalElements = data?.totalElements ?? 0
const products = data?.content ?? []

  const boolSelect = (
    value: boolean | undefined,
    onChange: (v: boolean | undefined) => void,
    label: string,
  ) => (
    <select
      className={styles.filterSelect}
      value={value === undefined ? "" : String(value)}
      onChange={(e) =>
        onChange(e.target.value === "" ? undefined : e.target.value === "true")
      }
    >
      <option value="">{label}: все</option>
      <option value="true">Да</option>
      <option value="false">Нет</option>
    </select>
  );

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>{totalElements} товаров</span>
        <div className={styles.headerActions}>
          {importResult && (
            <span className={styles.importResult}>{importResult}</span>
          )}
          <input
            ref={excelRef}
            type="file"
            accept=".xlsx,.xls"
            className={styles.fileInput}
            onChange={handleExcelImport}
          />
          <button
            className={styles.importBtn}
            onClick={() => {
              setImportResult(null);
              excelRef.current?.click();
            }}
            disabled={importMutation.isPending}
          >
            {importMutation.isPending ? "Импорт..." : "Импорт Excel"}
          </button>
          <button
            className={styles.createBtn}
            onClick={() => setFormProductId(0)}
          >
            + Создать
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={statusFilter}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="">Статус: все</option>
          <option value="PENDING">Ожидает</option>

          <option value="APPROVED">Одобрен</option>
        </select>
        {boolSelect(isAdvertisement, setIsAdvertisement, "Реклама")}
        {boolSelect(isNaturalStone, setIsNaturalStone, "Нат. камень")}
        {boolSelect(isComplect, setIsComplect, "Комплект")}
        {boolSelect(isSouvenir, setIsSouvenir, "Сувенир")}
        <input
          className={styles.searchInput}
          type="number"
          placeholder="Цена от"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ width: 90 }}
        />
        <input
          className={styles.searchInput}
          type="number"
          placeholder="Цена до"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ width: 90 }}
        />
      </div>

      <div className={styles.tableWrap}>
        {isLoading && <div className={styles.state}>Загрузка...</div>}
        {isError && <div className={styles.stateError}>Ошибка загрузки</div>}
        {!isLoading && !isError && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Фото</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Скидка</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {!products.length && (
                <tr>
                  <td colSpan={7} className={styles.empty}>
                    Нет товаров
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr key={product.id}>
                  <td className={styles.idCell}>{product.id}</td>
                  <td>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className={styles.adThumb}
                      />
                    ) : (
                      <span className={styles.noImage}>—</span>
                    )}
                  </td>
                  <td className={styles.adTitle}>{product.title}</td>
                  <td>
                    {product.currentPrice} {product.currency}
                  </td>
                  <td>{product.sale ? `−${product.sale}%` : "—"}</td>
                  <td>
                    <select
                      className={styles.statusSelect}
                      value={product.status ?? ""}
                      onChange={(e) =>
                        handleStatusChange(
                          product.id,
                          e.target.value as ProductStatus,
                        )
                      }
                      disabled={statusMutation.isPending}
                    >
                      {!product.status && (
                        <option value="" disabled>
                          —
                        </option>
                      )}
                      <option value="PENDING">{STATUS_LABELS.PENDING}</option>
                      <option value="APPROVED">{STATUS_LABELS.APPROVED}</option>
                    </select>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => setFormProductId(product.id)}
                      >
                        Изменить
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteProduct(product)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {hasNextPage && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreBtn}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Загрузка..." : "Загрузить ещё"}
          </button>
        </div>
      )}

      {formProductId !== null && (
        <ProductFormModal
          productId={formProductId === 0 ? null : formProductId}
          onClose={() => setFormProductId(null)}
        />
      )}

      {deleteProduct && (
        <div className={styles.overlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setDeleteProduct(null)}
            >
              <span />
              <span />
            </button>
            <h2 className={styles.modalTitle}>Удалить товар?</h2>
            <p className={styles.deleteText}>
              Вы уверены, что хотите удалить{" "}
              <strong>{deleteProduct.title}</strong> (ID: {deleteProduct.id})?
              Это действие необратимо.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteProduct(null)}
              >
                Отмена
              </button>
              <button
                className={styles.dangerBtn}
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Удаляем..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// Orders Tab
// ─────────────────────────────────────────────────────────────────────────────

const ALL_ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrdersTab() {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data, isLoading, isError } = useAdminOrders({
    page,
    size: PAGE_SIZE,
    status: statusFilter || undefined,
  });
  const statusMutation = useChangeAdminOrderStatus();

  const totalPages = data?.page.totalPages ?? 0;
  const totalElements = data?.page.totalElements ?? 0;

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>{totalElements} заказов</span>
        <select
          className={styles.select}
          value={statusFilter}
          style={{ width: 160 }}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">Все статусы</option>
          {ALL_ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableWrap}>
        {isLoading && <div className={styles.state}>Загрузка...</div>}
        {isError && <div className={styles.stateError}>Ошибка загрузки</div>}
        {!isLoading && !isError && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Пользователь</th>
                <th>Адрес</th>
                <th>Дата</th>
                <th>Товары</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {!data?.content.length && (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    Нет заказов
                  </td>
                </tr>
              )}
              {data?.content.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    className={styles.orderRow}
                    onClick={() =>
                      setExpandedId(expandedId === order.id ? null : order.id)
                    }
                  >
                    <td className={styles.idCell}>{order.id}</td>
                    <td>
                      <div className={styles.orderUser}>
                        <span>
                          {order.user.email || order.user.phoneNumber || "—"}
                        </span>
                        {order.user.email && order.user.phoneNumber && (
                          <span className={styles.orderUserSub}>
                            {order.user.phoneNumber}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={styles.orderAddress}>
                      {order.address || "—"}
                    </td>
                    <td className={styles.orderDate}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td>
                      <span
                        className={`${styles.itemsCount} ${expandedId === order.id ? styles.itemsCountActive : ""}`}
                      >
                        {order.items.length} поз.{" "}
                        {expandedId === order.id ? "▲" : "▼"}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className={`${styles.statusSelect} ${styles[`orderStatus_${order.status}`]}`}
                        value={order.status}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: order.id,
                            status: e.target.value as OrderStatus,
                          })
                        }
                        disabled={statusMutation.isPending}
                      >
                        {ALL_ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {ORDER_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  {expandedId === order.id && (
                    <tr className={styles.itemsRow}>
                      <td colSpan={6} className={styles.itemsCell}>
                        <div className={styles.itemsList}>
                          {order.items.map((item, i) => (
                            <div key={i} className={styles.orderItem}>
                              {item.product.imageUrl && (
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.title}
                                  className={styles.orderItemImg}
                                />
                              )}
                              <div className={styles.orderItemInfo}>
                                <span className={styles.orderItemTitle}>
                                  {item.product.title}
                                </span>
                                <span className={styles.orderItemPrice}>
                                  {item.product.currentPrice}{" "}
                                  {item.product.currency}
                                  {item.product.sale > 0 && (
                                    <span className={styles.orderItemSale}>
                                      {" "}
                                      −{item.product.sale}%
                                    </span>
                                  )}
                                </span>
                              </div>
                              <span className={styles.orderItemCount}>
                                × {item.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ←
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.pageBtn} ${i === page ? styles.pageBtnActive : ""}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      )}
    </>
  );
}

const REVIEW_STATUS_LABELS: Record<string, string> = {
  PENDING: "На проверке",
  APPROVED: "Опубликован",
  REJECTED: "Отклонён",
};

function ReviewsTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [editReview, setEditReview] = useState<AdminReview | null>(null);
  const [editText, setEditText] = useState("");
  const [editStars, setEditStars] = useState(5);
  const [deleteImage, setDeleteImage] = useState(false);
  const [editImages, setEditImages] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useAdminReviews({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
    size: PAGE_SIZE,
  });
  const deleteMutation = useDeleteAdminReview();
  const statusMutation = useChangeReviewStatus();
  const updateMutation = useUpdateAdminReview();

  const reviews = data?.content ?? [];
  const totalPages = data?.page.totalPages ?? 0;

  const openEdit = (r: AdminReview) => {
    setEditReview(r);
    setEditText(r.text);
    setEditStars(r.stars);
    setDeleteImage(false);
    setEditImages([]);
  };

  const handleUpdate = async () => {
    if (!editReview) return;
    await updateMutation.mutateAsync({
      productId: editReview.id,
      data: { text: editText, stars: editStars, deleteImage },
      images: editImages.length > 0 ? editImages : undefined,
    });
    toast.success("Отзыв обновлён");
    setEditReview(null);
  };

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>
          {data?.page.totalElements ?? 0} отзывов
        </span>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Поиск..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">Все статусы</option>
          <option value="PENDING">На проверке</option>
          <option value="APPROVED">Опубликован</option>
          <option value="REJECTED">Отклонён</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        {isLoading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Автор</th>
                <th>Текст</th>
                <th>Оценка</th>
                <th>Статус</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.author || "—"}</td>
                  <td className={styles.textCell}>{r.text}</td>
                  <td>{"★".repeat(r.stars)}</td>
                  <td>
                    <select
                      value={r.status}
                      className={styles.statusSelect}
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: r.id,
                          status: e.target.value,
                        })
                      }
                    >
                      {(
                        ["PENDING", "APPROVED", "REJECTED"] as ReviewStatus[]
                      ).map((s) => (
                        <option key={s} value={s}>
                          {REVIEW_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(r.createdAt).toLocaleDateString("ru-RU")}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEdit(r)}
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteMutation.mutate(r.id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            ←
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      )}

      {/* Edit modal */}
      {editReview && (
        <div
          className={styles.reviewEditOverlay}
          onClick={() => setEditReview(null)}
        >
          <div
            className={styles.reviewEditModal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={styles.reviewEditHeader}>
              <div>
                <h3 className={styles.reviewEditTitle}>Редактировать отзыв</h3>
                <span className={styles.reviewEditSub}>
                  #{editReview.id} · {editReview.author || "Аноним"}
                </span>
              </div>
              <button
                className={styles.reviewEditClose}
                onClick={() => setEditReview(null)}
              >
                <span />
                <span />
              </button>
            </div>

            <div className={styles.reviewEditBody}>
              {/* Stars */}
              <div className={styles.reviewEditField}>
                <label className={styles.reviewEditLabel}>Оценка</label>
                <div className={styles.reviewStarPicker}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.reviewStar} ${n <= editStars ? styles.reviewStarOn : ""}`}
                      onClick={() => setEditStars(n)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Text */}
              <div className={styles.reviewEditField}>
                <label className={styles.reviewEditLabel}>Текст отзыва</label>
                <textarea
                  className={styles.reviewEditTextarea}
                  rows={5}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              </div>

              {/* Images */}
              <div className={styles.reviewEditField}>
                <label className={styles.reviewEditLabel}>Фото</label>
                <div className={styles.reviewImgRow}>
                  {/* Current image */}
                  {editReview.image && (
                    <div
                      className={`${styles.reviewImgCard} ${deleteImage ? styles.reviewImgDeleted : ""}`}
                    >
                      <img src={editReview.image} alt="текущее фото" />
                      <button
                        type="button"
                        className={styles.reviewImgAction}
                        onClick={() => setDeleteImage((d) => !d)}
                        title={deleteImage ? "Восстановить" : "Удалить"}
                      >
                        {deleteImage ? "↩" : "✕"}
                      </button>
                      {deleteImage && (
                        <div className={styles.reviewImgBadge}>Удалить</div>
                      )}
                    </div>
                  )}

                  {/* New image previews */}
                  {editImages.map((img, i) => (
                    <div key={i} className={styles.reviewImgCard}>
                      <img src={URL.createObjectURL(img)} alt="новое фото" />
                      <button
                        type="button"
                        className={styles.reviewImgAction}
                        onClick={() =>
                          setEditImages((prev) =>
                            prev.filter((_, j) => j !== i),
                          )
                        }
                      >
                        ✕
                      </button>
                      <div className={styles.reviewImgBadgeNew}>Новое</div>
                    </div>
                  ))}

                  {/* Upload button — always visible */}
                  <button
                    type="button"
                    className={styles.reviewImgUpload}
                    onClick={() => fileRef.current?.click()}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <span>Добавить</span>
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    setEditImages((prev) => [...prev, ...files]);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={styles.reviewEditFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditReview(null)}
              >
                Отмена
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Сохраняем..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stone Categories Tab
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_STONE: StoneCategoryBody = {
  id: 0,
  label: "",
  slug: "",
  imagesMeta: [],
};

function StoneCategoriesTab() {
  const { data: stones = [], isLoading } = useStoneCategories();
  const upsertMutation = useUpsertStoneCategory();
  const deleteMutation = useDeleteStoneCategory();

  const [editStone, setEditStone] = useState<
    (StoneCategoryBody & { existingImages?: StoneCategory["images"] }) | null
  >(null);
  const [deleteStone, setDeleteStone] = useState<StoneCategory | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditStone({ ...EMPTY_STONE, existingImages: [] });
    setNewImages([]);
    setImagePreviews([]);
  };

  const openEdit = (s: StoneCategory) => {
    setEditStone({
      id: s.id,
      label: s.label,
      slug: s.slug,
      imagesMeta: (s.images ?? []).map((img) => ({
        id: img.id,
        displayOrder: img.displayOrder,
        delete: false,
      })),
      existingImages: s.images ?? [],
    });
    setNewImages([]);
    setImagePreviews([]);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setNewImages((prev) => [...prev, ...arr]);
    arr.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeExistingImage = (imgId: string) => {
    if (!editStone) return;
    setEditStone(
      (s) =>
        s && {
          ...s,
          imagesMeta: s.imagesMeta.map((m) =>
            m.id === imgId ? { ...m, delete: true } : m,
          ),
        },
    );
  };

  const removeNewImage = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!editStone) return;
    try {
      const existingMeta = editStone.imagesMeta; // existing images with delete flags
      const nextOrder = existingMeta.length + 1;
      const newImagesMeta = newImages.map((_, i) => ({
        id: null,
        displayOrder: nextOrder + i,
        delete: null,
      }));
      const fullImagesMeta = [...existingMeta, ...newImagesMeta];

      await upsertMutation.mutateAsync({
        category: {
          id: editStone.id,
          label: editStone.label,
          slug: editStone.slug,
          imagesMeta: fullImagesMeta,
        },
        images: newImages,
      });
      toast.success(
        editStone.id === 0 ? "Категория создана" : "Категория обновлена",
      );
      setEditStone(null);
      setNewImages([]);
      setImagePreviews([]);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    }
  };

  const handleDelete = async () => {
    if (!deleteStone) return;
    try {
      await deleteMutation.mutateAsync(deleteStone.id);
      toast.success("Удалено");
      setDeleteStone(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    }
  };

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>{stones.length} категорий</span>
        <button className={styles.createBtn} onClick={openCreate}>
          + Добавить
        </button>
      </div>

      {isLoading && <p className={styles.loading}>Загрузка...</p>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Slug</th>
              <th>Превью</th>
              <th>Изображений</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {stones.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.label}</td>
                <td>{s.slug}</td>
                <td>
                  {s.preview && (
                    <img
                      src={s.preview}
                      alt={s.label}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  )}
                </td>
                <td>{s.images?.length ?? 0}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEdit(s)}
                    >
                      Изменить
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteStone(s)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      {editStone && (
        <div className={styles.overlay} >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setEditStone(null)}
            >
              <span />
              <span />
            </button>
            <h2 className={styles.modalTitle}>
              {editStone.id === 0
                ? "Новая категория камня"
                : `Редактировать: ${editStone.label}`}
            </h2>

            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                Название
                <input
                  className={styles.formInput}
                  value={editStone.label}
                  onChange={(e) =>
                    setEditStone((s) => s && { ...s, label: e.target.value })
                  }
                />
              </label>
              <label className={styles.formLabel}>
                Slug (для URL)
                <input
                  className={styles.formInput}
                  value={editStone.slug}
                  onChange={(e) =>
                    setEditStone((s) => s && { ...s, slug: e.target.value })
                  }
                />
              </label>

              {/* Existing images */}
              {(editStone.existingImages?.length ?? 0) > 0 && (
                <div className={styles.formLabel}>
                  Текущие изображения
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginTop: 8,
                    }}
                  >
                    {editStone.existingImages!.map((img) => {
                      const meta = editStone.imagesMeta.find(
                        (m) => m.id === img.id,
                      );
                      const deleted = meta?.delete ?? false;
                      return (
                        <div
                          key={img.id}
                          style={{
                            position: "relative",
                            opacity: deleted ? 0.3 : 1,
                          }}
                        >
                          <img
                            src={img.url}
                            alt=""
                            style={{
                              width: 64,
                              height: 64,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img.id)}
                            style={{
                              position: "absolute",
                              top: -6,
                              right: -6,
                              background: "#af0e0e",
                              color: "#fff",
                              border: "none",
                              borderRadius: "50%",
                              width: 20,
                              height: 20,
                              cursor: "pointer",
                              fontSize: 12,
                              lineHeight: 1,
                            }}
                          >
                            {deleted ? "↩" : "×"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* New images */}
              <div className={styles.formLabel}>
                {editStone.id === 0 ? "Изображения" : "Добавить изображения"}
                <div className={styles.imageUpload}>
                  {imagePreviews.map((src, i) => (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        margin: "4px 4px 0 0",
                      }}
                    >
                      <img
                        src={src}
                        alt=""
                        style={{
                          width: 64,
                          height: 64,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          background: "#af0e0e",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className={styles.fileInput}
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <button
                    className={styles.fileBtn}
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    Выбрать файлы
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditStone(null)}
              >
                Отмена
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={upsertMutation.isPending}
              >
                {upsertMutation.isPending ? "Сохраняем..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteStone && (
        <div className={styles.overlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setDeleteStone(null)}
            >
              <span />
              <span />
            </button>
            <h2 className={styles.modalTitle}>Удалить категорию?</h2>
            <p className={styles.deleteText}>
              Вы уверены, что хотите удалить{" "}
              <strong>{deleteStone.label}</strong>? Это действие необратимо.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteStone(null)}
              >
                Отмена
              </button>
              <button
                className={styles.dangerBtn}
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Удаляем..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Gift Certificates Tab
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_CERT: GiftCertificateBody = {
  id: 0,
  name: "",
  description: "",
  price: 0,
  gradient: "",
  textColor: "",
};

function GiftCertificatesTab() {
  const { data: certs = [], isLoading } = useGiftCertificates();
  const upsertMutation = useUpsertGiftCertificate();
  const deleteMutation = useDeleteGiftCertificate();

  const [editCert, setEditCert] = useState<GiftCertificateBody | null>(null);
  const [deleteCert, setDeleteCert] = useState<GiftCertificate | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditCert({ ...EMPTY_CERT });
    setImage(null);
    setImagePreview("");
  };

  const openEdit = (c: GiftCertificate) => {
    setEditCert({
      id: c.id,
      name: c.name,
      description: c.description,
      price: c.price,
      gradient: c.gradient ?? "",
      textColor: c.textColor ?? "",
    });
    setImage(null);
    setImagePreview(c.imageUrl ?? "");
  };

  const handleFile = (f: File | null) => {
    setImage(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleSave = async () => {
    if (!editCert) return;
    try {
      await upsertMutation.mutateAsync({ certificate: editCert, image });
      toast.success("Сохранено");
      setEditCert(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    }
  };

  const handleDelete = async () => {
    if (!deleteCert) return;
    try {
      await deleteMutation.mutateAsync(deleteCert.id);
      toast.success("Удалено");
      setDeleteCert(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    }
  };

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>{certs.length} сертификатов</span>
        <button className={styles.createBtn} onClick={openCreate}>
          + Добавить
        </button>
      </div>

      {isLoading && <p className={styles.loading}>Загрузка...</p>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Превью</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>
                  {c.price} {c.currency}
                </td>
                <td>
                  {c.imageUrl ? (
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      style={{
                        width: 64,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ) : c.gradient ? (
                    <div
                      style={{
                        width: 64,
                        height: 40,
                        background: c.gradient,
                        borderRadius: 4,
                      }}
                    />
                  ) : null}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEdit(c)}
                    >
                      Изменить
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteCert(c)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      {editCert && (
        <div className={styles.overlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setEditCert(null)}
            >
              <span />
              <span />
            </button>
            <h2 className={styles.modalTitle}>
              {editCert.id === 0
                ? "Новый сертификат"
                : `Редактировать: ${editCert.name}`}
            </h2>

            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                Название
                <input
                  className={styles.formInput}
                  value={editCert.name}
                  onChange={(e) =>
                    setEditCert((s) => s && { ...s, name: e.target.value })
                  }
                />
              </label>
              <label className={styles.formLabel}>
                Цена (BYN)
                <input
                  className={styles.formInput}
                  type="number"
                  value={editCert.price}
                  onChange={(e) =>
                    setEditCert(
                      (s) => s && { ...s, price: Number(e.target.value) },
                    )
                  }
                />
              </label>
              <label
                className={styles.formLabel}
                style={{ gridColumn: "1 / -1" }}
              >
                Описание
                <input
                  className={styles.formInput}
                  value={editCert.description}
                  onChange={(e) =>
                    setEditCert(
                      (s) => s && { ...s, description: e.target.value },
                    )
                  }
                />
              </label>
              <label className={styles.formLabel}>
                Gradient CSS (если нет фото)
                <input
                  className={styles.formInput}
                  placeholder="linear-gradient(...)"
                  value={editCert.gradient ?? ""}
                  onChange={(e) =>
                    setEditCert((s) => s && { ...s, gradient: e.target.value })
                  }
                />
              </label>
              <label className={styles.formLabel}>
                Цвет текста
                <input
                  className={styles.formInput}
                  placeholder="#072761"
                  value={editCert.textColor ?? ""}
                  onChange={(e) =>
                    setEditCert((s) => s && { ...s, textColor: e.target.value })
                  }
                />
              </label>

              <div
                className={styles.formLabel}
                style={{ gridColumn: "1 / -1" }}
              >
                Изображение
                <div className={styles.imageUpload}>
                  {imagePreview && (
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        marginBottom: 8,
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt=""
                        style={{
                          height: 60,
                          width: 96,
                          objectFit: "cover",
                          borderRadius: 4,
                          display: "block",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview("");
                        }}
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          background: "#af0e0e",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => {
                      handleFile(e.target.files?.[0] ?? null);
                      e.target.value = "";
                    }}
                  />
                  <button
                    className={styles.fileBtn}
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    {imagePreview ? "Заменить фото" : "Выбрать фото"}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditCert(null)}
              >
                Отмена
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={upsertMutation.isPending}
              >
                {upsertMutation.isPending ? "Сохраняем..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteCert && (
        <div className={styles.overlay} >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setDeleteCert(null)}
            >
              <span />
              <span />
            </button>
            <h2 className={styles.modalTitle}>Удалить сертификат?</h2>
            <p className={styles.deleteText}>
              Вы уверены, что хотите удалить <strong>{deleteCert.name}</strong>?
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteCert(null)}
              >
                Отмена
              </button>
              <button
                className={styles.dangerBtn}
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Удаляем..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("users");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Админ-панель</h1>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "users" ? styles.tabActive : ""}`}
          onClick={() => setTab("users")}
        >
          Пользователи
        </button>
        <button
          className={`${styles.tab} ${tab === "categories" ? styles.tabActive : ""}`}
          onClick={() => setTab("categories")}
        >
          Категории
        </button>
        <button
          className={`${styles.tab} ${tab === "ads" ? styles.tabActive : ""}`}
          onClick={() => setTab("ads")}
        >
          Реклама
        </button>
        <button
          className={`${styles.tab} ${tab === "products" ? styles.tabActive : ""}`}
          onClick={() => setTab("products")}
        >
          Товары
        </button><button
  className={`${styles.tab} ${tab === 'installment' ? styles.tabActive : ''}`}
  onClick={() => setTab('installment')}
>
  Рассрочка
</button>
        <button
          className={`${styles.tab} ${tab === "orders" ? styles.tabActive : ""}`}
          onClick={() => setTab("orders")}
        >
          Заказы
        </button>
        <button
          className={`${styles.tab} ${tab === "reviews" ? styles.tabActive : ""}`}
          onClick={() => setTab("reviews")}
        >
          Отзывы
        </button>
        <button
          className={`${styles.tab} ${tab === "stones" ? styles.tabActive : ""}`}
          onClick={() => setTab("stones")}
        >
          Камни
        </button>
        <button
          className={`${styles.tab} ${tab === "certificates" ? styles.tabActive : ""}`}
          onClick={() => setTab("certificates")}
        >
          Сертификаты
        </button>
        <button
  className={`${styles.tab} ${tab === 'settings' ? styles.tabActive : ''}`}
  onClick={() => setTab('settings')}
>
  Настройки админов
</button>
      </div>

      {tab === "users" && <UsersTab />}
      {tab === "ads" && <AdsTab />}
      {tab === "products" && <ProductsTab />}
      {tab === "orders" && <OrdersTab />}
      {tab === "reviews" && <ReviewsTab />}
      {tab === "stones" && <StoneCategoriesTab />}
      {tab === "certificates" && <GiftCertificatesTab />}
      {tab === 'settings' && <AdminSettingsTab />}
      {tab === "categories" && <CategoriesTab />}{tab === 'installment' && <InstallmentCardsTab />}
    </div>
  );
}
