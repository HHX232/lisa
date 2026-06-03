'use client'

import { useRef, useState } from 'react'
import { Fragment } from 'react'
import { toast } from 'sonner'
import {
  useAdminUsers, useDeleteAdminUser, useUpdateAdminUser,
  useAdminAdvertisements, useUpsertAdvertisement, useDeleteAdvertisement,
  useAdminProducts, useDeleteAdminProduct, useChangeProductStatus, useImportProductsExcel,
  useAdminOrders, useChangeAdminOrderStatus,
  useAdminReviews, useDeleteAdminReview, useChangeReviewStatus, useUpdateAdminReview,
} from '@/hooks/admin.hooks'
import { AdminUser, UpdateAdminUserBody, AdvertisementBody, AdminReview, ReviewStatus } from '@/api/services/admin.service'
import { Advertisement } from '@/types/Advertisement.types'
import { Product, ProductStatus } from '@/types/Product.types'
import { ORDER_STATUS_LABELS, OrderStatus } from '@/types/Order.types'
import { UserRole } from '@/types/user.types'
import ProductFormModal from './ProductFormModal/ProductFormModal'
import styles from './AdminPage.module.scss'

const PAGE_SIZE = 10
type Tab = 'users' | 'ads' | 'products' | 'orders' | 'reviews'

// ─────────────────────────────────────────────────────────────────────────────
// Users Tab
// ─────────────────────────────────────────────────────────────────────────────
function UsersTab() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(0)
  const [editUser, setEditUser] = useState<AdminUser | null>(null)
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null)
  const [editForm, setEditForm] = useState<UpdateAdminUserBody>({})

  const { data, isLoading, isError } = useAdminUsers({
    search: search || undefined,
    role: roleFilter || undefined,
    page,
    size: PAGE_SIZE,
  })

  const updateMutation = useUpdateAdminUser()
  const deleteMutation = useDeleteAdminUser()

  const openEdit = (user: AdminUser) => {
    setEditUser(user)
    setEditForm({
      role: user.role,
      email: user.email,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified,
      phoneNumberVerified: user.phoneNumberVerified,
      contactInfo: user.contactInfo,
    })
  }

  const handleUpdate = async () => {
    if (!editUser) return
    await updateMutation.mutateAsync({ id: editUser.id, body: editForm })
    setEditUser(null)
  }

  const handleDelete = async () => {
    if (!deleteUser) return
    await deleteMutation.mutateAsync(deleteUser.id)
    setDeleteUser(null)
  }

  const totalPages = data?.page.totalPages ?? 0
  const totalElements = data?.page.totalElements ?? 0

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
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
        />
        <select
          className={styles.select}
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(0) }}
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
                <tr><td colSpan={7} className={styles.empty}>Нет пользователей</td></tr>
              )}
              {data?.content.map((user) => (
                <tr key={user.id}>
                  <td className={styles.idCell}>{user.id}</td>
                  <td>{user.email || '—'}</td>
                  <td>{user.phoneNumber || '—'}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.roleAdmin : styles.roleUser}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.verifiedBadge} ${user.emailVerified ? styles.yes : styles.no}`}>
                      {user.emailVerified ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.verifiedBadge} ${user.phoneNumberVerified ? styles.yes : styles.no}`}>
                      {user.phoneNumberVerified ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(user)}>Изменить</button>
                      <button className={styles.deleteBtn} onClick={() => setDeleteUser(user)}>Удалить</button>
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
          <button className={styles.pageBtn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>←</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.pageBtn} ${i === page ? styles.pageBtnActive : ''}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
          <button className={styles.pageBtn} disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>→</button>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className={styles.overlay} onClick={() => setEditUser(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setEditUser(null)}><span /><span /></button>
            <h2 className={styles.modalTitle}>Редактировать пользователя #{editUser.id}</h2>
            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                Роль
                <select className={styles.formSelect} value={editForm.role}
                  onChange={(e) => setEditForm(f => ({ ...f, role: e.target.value as UserRole }))}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>
              <label className={styles.formLabel}>
                Email
                <input className={styles.formInput} type="email" value={editForm.email ?? ''}
                  onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))} />
              </label>
              <label className={styles.formLabel}>
                Телефон
                <input className={styles.formInput} type="text" value={editForm.phoneNumber ?? ''}
                  onChange={(e) => setEditForm(f => ({ ...f, phoneNumber: e.target.value }))} />
              </label>
              <label className={styles.formLabel}>
                Контактные данные
                <input className={styles.formInput} type="text" value={editForm.contactInfo ?? ''}
                  onChange={(e) => setEditForm(f => ({ ...f, contactInfo: e.target.value }))} />
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={editForm.emailVerified ?? false}
                  onChange={(e) => setEditForm(f => ({ ...f, emailVerified: e.target.checked }))} />
                Email подтверждён
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={editForm.phoneNumberVerified ?? false}
                  onChange={(e) => setEditForm(f => ({ ...f, phoneNumberVerified: e.target.checked }))} />
                Телефон подтверждён
              </label>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setEditUser(null)}>Отмена</button>
              <button className={styles.saveBtn} onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteUser && (
        <div className={styles.overlay} onClick={() => setDeleteUser(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setDeleteUser(null)}><span /><span /></button>
            <h2 className={styles.modalTitle}>Удалить пользователя?</h2>
            <p className={styles.deleteText}>
              Вы уверены, что хотите удалить <strong>{deleteUser.email || deleteUser.phoneNumber}</strong> (ID: {deleteUser.id})? Это действие необратимо.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteUser(null)}>Отмена</button>
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
// Ads Tab
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_AD: AdvertisementBody = { id: 0, title: '', description: '', specialLabel: '', edgeColor: '#072761' }

function AdsTab() {
  const { data: ads, isLoading, isError } = useAdminAdvertisements()
  const upsertMutation = useUpsertAdvertisement()
  const deleteMutation = useDeleteAdvertisement()

  const [editAd, setEditAd] = useState<AdvertisementBody | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [deleteAd, setDeleteAd] = useState<Advertisement | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const openCreate = () => {
    setEditAd({ ...EMPTY_AD })
    setCurrentImage(null)
    setImageFile(null)
    setImagePreview(null)
  }

  const openEdit = (ad: Advertisement) => {
    setEditAd({ id: ad.id, title: ad.title, description: ad.description, specialLabel: ad.specialLabel, edgeColor: ad.edgeColor })
    setCurrentImage(ad.image)
    setImageFile(null)
    setImagePreview(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleUpsert = async () => {
    if (!editAd) return
    try {
      await upsertMutation.mutateAsync({ advertisement: editAd, image: imageFile })
      toast.success(editAd.id === 0 ? 'Реклама создана' : 'Реклама обновлена')
      setEditAd(null)
      setImageFile(null)
      setImagePreview(null)
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message
      try {
        const parsed = JSON.parse(msg ?? '')
        toast.error(parsed?.message ?? msg ?? 'Ошибка')
      } catch {
        toast.error(msg ?? 'Ошибка')
      }
    }
  }

  const handleDelete = async () => {
    if (!deleteAd) return
    await deleteMutation.mutateAsync(deleteAd.id)
    setDeleteAd(null)
  }

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>{ads?.length ?? 0} записей</span>
        <button className={styles.createBtn} onClick={openCreate}>+ Создать</button>
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
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {!ads?.length && (
                <tr><td colSpan={7} className={styles.empty}>Нет рекламных блоков</td></tr>
              )}
              {ads?.map((ad) => (
                <tr key={ad.id}>
                  <td className={styles.idCell}>{ad.id}</td>
                  <td>
                    {ad.image
                      ? <img src={ad.image} alt={ad.title} className={styles.adThumb} />
                      : <span className={styles.noImage}>—</span>}
                  </td>
                  <td className={styles.adTitle}>{ad.title || '—'}</td>
                  <td className={styles.adDesc}>{ad.description || '—'}</td>
                  <td>{ad.specialLabel || '—'}</td>
                  <td>
                    <div className={styles.colorCell}>
                      <span className={styles.colorSwatch} style={{ background: ad.edgeColor }} />
                      {ad.edgeColor}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(ad)}>Изменить</button>
                      <button className={styles.deleteBtn} onClick={() => setDeleteAd(ad)}>Удалить</button>
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
        <div className={styles.overlay} onClick={() => setEditAd(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setEditAd(null)}><span /><span /></button>
            <h2 className={styles.modalTitle}>
              {editAd.id === 0 ? 'Создать рекламу' : `Редактировать рекламу #${editAd.id}`}
            </h2>

            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                Заголовок
                <input className={styles.formInput} type="text" value={editAd.title}
                  onChange={(e) => setEditAd(f => f && ({ ...f, title: e.target.value }))} />
              </label>
              <label className={styles.formLabel}>
                Описание
                <textarea className={styles.formTextarea} value={editAd.description} rows={3}
                  onChange={(e) => setEditAd(f => f && ({ ...f, description: e.target.value }))} />
              </label>
              <label className={styles.formLabel}>
                Специальная метка
                <input className={styles.formInput} type="text" value={editAd.specialLabel}
                  onChange={(e) => setEditAd(f => f && ({ ...f, specialLabel: e.target.value }))} />
              </label>
              <label className={styles.formLabel}>
                Цвет рамки
                <div className={styles.colorRow}>
                  <input type="color" className={styles.colorPicker} value={editAd.edgeColor}
                    onChange={(e) => setEditAd(f => f && ({ ...f, edgeColor: e.target.value }))} />
                  <input className={styles.formInput} type="text" value={editAd.edgeColor}
                    onChange={(e) => setEditAd(f => f && ({ ...f, edgeColor: e.target.value }))} />
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
                  <button className={styles.fileBtn} type="button" onClick={() => fileRef.current?.click()}>
                    {imageFile ? imageFile.name : 'Выбрать файл'}
                  </button>
                  {imageFile && (
                    <button className={styles.fileClear} type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = '' }}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setEditAd(null)}>Отмена</button>
              <button className={styles.saveBtn} onClick={handleUpsert} disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteAd && (
        <div className={styles.overlay} onClick={() => setDeleteAd(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setDeleteAd(null)}><span /><span /></button>
            <h2 className={styles.modalTitle}>Удалить рекламу?</h2>
            <p className={styles.deleteText}>
              Вы уверены, что хотите удалить рекламу <strong>{deleteAd.title || `#${deleteAd.id}`}</strong>? Это действие необратимо.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteAd(null)}>Отмена</button>
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
// Products Tab
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<ProductStatus, string> = {
  PENDING: 'Ожидает',
  ACTIVE: 'Активен',
  INACTIVE: 'Неактивен',
}

function ProductsTab() {
  const [search, setSearch] = useState('')
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [importResult, setImportResult] = useState<string | null>(null)
  const [formProductId, setFormProductId] = useState<number | null | 0>(null)
  const excelRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminProducts({ size: PAGE_SIZE, title: search || undefined })
  const deleteMutation = useDeleteAdminProduct()
  const statusMutation = useChangeProductStatus()
  const importMutation = useImportProductsExcel()

  const handleDelete = async () => {
    if (!deleteProduct) return
    await deleteMutation.mutateAsync(deleteProduct.id)
    setDeleteProduct(null)
  }

  const handleStatusChange = (id: number, status: ProductStatus) => {
    statusMutation.mutate({ id, status })
  }

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await importMutation.mutateAsync(file)
      setImportResult(res?.message ?? 'Импорт завершён')
    } catch {
      setImportResult('Ошибка импорта')
    } finally {
      if (excelRef.current) excelRef.current.value = ''
    }
  }

  const totalElements = data?.totalElements ?? 0
  const products = data?.content ?? []

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
            onClick={() => { setImportResult(null); excelRef.current?.click() }}
            disabled={importMutation.isPending}
          >
            {importMutation.isPending ? 'Импорт...' : 'Импорт Excel'}
          </button>
          <button className={styles.createBtn} onClick={() => setFormProductId(0)}>
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
                <tr><td colSpan={7} className={styles.empty}>Нет товаров</td></tr>
              )}
              {products.map((product) => (
                <tr key={product.id}>
                  <td className={styles.idCell}>{product.id}</td>
                  <td>
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt={product.title} className={styles.adThumb} />
                      : <span className={styles.noImage}>—</span>}
                  </td>
                  <td className={styles.adTitle}>{product.title}</td>
                  <td>{product.currentPrice} ₽</td>
                  <td>{product.sale ? `−${product.sale}%` : '—'}</td>
                  <td>
                    <select
                      className={styles.statusSelect}
                      value={product.status ?? ''}
                      onChange={(e) => handleStatusChange(product.id, e.target.value as ProductStatus)}
                      disabled={statusMutation.isPending}
                    >
                      {!product.status && <option value="" disabled>—</option>}
                      <option value="PENDING">{STATUS_LABELS.PENDING}</option>
                      <option value="ACTIVE">{STATUS_LABELS.ACTIVE}</option>
                      <option value="INACTIVE">{STATUS_LABELS.INACTIVE}</option>
                    </select>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => setFormProductId(product.id)}>
                        Изменить
                      </button>
                      <button className={styles.deleteBtn} onClick={() => setDeleteProduct(product)}>
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
            {isFetchingNextPage ? 'Загрузка...' : 'Загрузить ещё'}
          </button>
        </div>
      )}

      {/* Create / Edit form modal */}
      {formProductId !== null && (
        <ProductFormModal
          productId={formProductId === 0 ? null : formProductId}
          onClose={() => setFormProductId(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteProduct && (
        <div className={styles.overlay} onClick={() => setDeleteProduct(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setDeleteProduct(null)}><span /><span /></button>
            <h2 className={styles.modalTitle}>Удалить товар?</h2>
            <p className={styles.deleteText}>
              Вы уверены, что хотите удалить <strong>{deleteProduct.title}</strong> (ID: {deleteProduct.id})? Это действие необратимо.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteProduct(null)}>Отмена</button>
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
// Orders Tab
// ─────────────────────────────────────────────────────────────────────────────

const ALL_ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function OrdersTab() {
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const { data, isLoading, isError } = useAdminOrders({
    page,
    size: PAGE_SIZE,
    status: statusFilter || undefined,
  })
  const statusMutation = useChangeAdminOrderStatus()

  const totalPages = data?.page.totalPages ?? 0
  const totalElements = data?.page.totalElements ?? 0

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>{totalElements} заказов</span>
        <select
          className={styles.select}
          value={statusFilter}
          style={{ width: 160 }}
          onChange={e => { setStatusFilter(e.target.value); setPage(0) }}
        >
          <option value="">Все статусы</option>
          {ALL_ORDER_STATUSES.map(s => (
            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
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
                <tr><td colSpan={6} className={styles.empty}>Нет заказов</td></tr>
              )}
              {data?.content.map(order => (
                <Fragment key={order.id}>
                  <tr
                    className={styles.orderRow}
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  >
                    <td className={styles.idCell}>{order.id}</td>
                    <td>
                      <div className={styles.orderUser}>
                        <span>{order.user.email || order.user.phoneNumber || '—'}</span>
                        {order.user.email && order.user.phoneNumber && (
                          <span className={styles.orderUserSub}>{order.user.phoneNumber}</span>
                        )}
                      </div>
                    </td>
                    <td className={styles.orderAddress}>{order.address || '—'}</td>
                    <td className={styles.orderDate}>{formatDate(order.createdAt)}</td>
                    <td>
                      <span className={`${styles.itemsCount} ${expandedId === order.id ? styles.itemsCountActive : ''}`}>
                        {order.items.length} поз. {expandedId === order.id ? '▲' : '▼'}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <select
                        className={`${styles.statusSelect} ${styles[`orderStatus_${order.status}`]}`}
                        value={order.status}
                        onChange={e => statusMutation.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                        disabled={statusMutation.isPending}
                      >
                        {ALL_ORDER_STATUSES.map(s => (
                          <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
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
                                <span className={styles.orderItemTitle}>{item.product.title}</span>
                                <span className={styles.orderItemPrice}>
                                  {item.product.currentPrice} {item.product.currency}
                                  {item.product.sale > 0 && (
                                    <span className={styles.orderItemSale}> −{item.product.sale}%</span>
                                  )}
                                </span>
                              </div>
                              <span className={styles.orderItemCount}>× {item.count}</span>
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
          <button className={styles.pageBtn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>←</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.pageBtn} ${i === page ? styles.pageBtnActive : ''}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
          <button className={styles.pageBtn} disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>→</button>
        </div>
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Reviews Tab
// ─────────────────────────────────────────────────────────────────────────────

const REVIEW_STATUS_LABELS: Record<string, string> = {
  PENDING: 'На проверке',
  APPROVED: 'Опубликован',
  REJECTED: 'Отклонён',
}

function ReviewsTab() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const [editReview, setEditReview] = useState<AdminReview | null>(null)
  const [editText, setEditText] = useState('')
  const [editStars, setEditStars] = useState(5)
  const [deleteImage, setDeleteImage] = useState(false)
  const [editImage, setEditImage] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useAdminReviews({ search: search || undefined, status: statusFilter || undefined, page, size: PAGE_SIZE })
  const deleteMutation = useDeleteAdminReview()
  const statusMutation = useChangeReviewStatus()
  const updateMutation = useUpdateAdminReview()

  const reviews = data?.content ?? []
  const totalPages = data?.page.totalPages ?? 0

  const openEdit = (r: AdminReview) => {
    setEditReview(r)
    setEditText(r.text)
    setEditStars(r.stars)
    setDeleteImage(false)
    setEditImage(null)
  }

  const handleUpdate = async () => {
    if (!editReview) return
    await updateMutation.mutateAsync({ productId: editReview.id, data: { text: editText, stars: editStars, deleteImage }, image: editImage })
    toast.success('Отзыв обновлён')
    setEditReview(null)
  }

  return (
    <>
      <div className={styles.tabHeader}>
        <span className={styles.count}>{data?.page.totalElements ?? 0} отзывов</span>
      </div>

      <div className={styles.filters}>
        <input className={styles.searchInput} placeholder="Поиск..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(0) }} />
        <select className={styles.filterSelect} value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(0) }}>
          <option value="">Все статусы</option>
          <option value="PENDING">На проверке</option>
          <option value="APPROVED">Опубликован</option>
          <option value="REJECTED">Отклонён</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        {isLoading ? <div className={styles.loading}>Загрузка...</div> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th><th>Автор</th><th>Текст</th><th>Оценка</th><th>Статус</th><th>Дата</th><th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.author || '—'}</td>
                  <td className={styles.textCell}>{r.text}</td>
                  <td>{'★'.repeat(r.stars)}</td>
                  <td>
                    <select
                      value={r.status}
                      className={styles.statusSelect}
                      onChange={e => statusMutation.mutate({ id: r.id, status: e.target.value })}
                    >
                      {(['PENDING', 'APPROVED', 'REJECTED'] as ReviewStatus[]).map(s => (
                        <option key={s} value={s}>{REVIEW_STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(r.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEdit(r)}>✏️</button>
                    <button className={styles.deleteBtn} onClick={() => deleteMutation.mutate(r.id)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>←</button>
          <span>{page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>→</button>
        </div>
      )}

      {/* Edit modal */}
      {editReview && (
        <div className={styles.reviewEditOverlay} onClick={() => setEditReview(null)}>
          <div className={styles.reviewEditModal} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className={styles.reviewEditHeader}>
              <div>
                <h3 className={styles.reviewEditTitle}>Редактировать отзыв</h3>
                <span className={styles.reviewEditSub}>#{editReview.id} · {editReview.author || 'Аноним'}</span>
              </div>
              <button className={styles.reviewEditClose} onClick={() => setEditReview(null)}>
                <span /><span />
              </button>
            </div>

            <div className={styles.reviewEditBody}>
              {/* Stars */}
              <div className={styles.reviewEditField}>
                <label className={styles.reviewEditLabel}>Оценка</label>
                <div className={styles.reviewStarPicker}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button"
                      className={`${styles.reviewStar} ${n <= editStars ? styles.reviewStarOn : ''}`}
                      onClick={() => setEditStars(n)}>★</button>
                  ))}
                </div>
              </div>

              {/* Text */}
              <div className={styles.reviewEditField}>
                <label className={styles.reviewEditLabel}>Текст отзыва</label>
                <textarea className={styles.reviewEditTextarea} rows={5} value={editText}
                  onChange={e => setEditText(e.target.value)} />
              </div>

              {/* Images */}
              <div className={styles.reviewEditField}>
                <label className={styles.reviewEditLabel}>Фото</label>
                <div className={styles.reviewImgRow}>
                  {/* Current image */}
                  {editReview.image && (
                    <div className={`${styles.reviewImgCard} ${deleteImage ? styles.reviewImgDeleted : ''}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editReview.image} alt="текущее фото" />
                      <button
                        type="button"
                        className={styles.reviewImgAction}
                        onClick={() => setDeleteImage(d => !d)}
                        title={deleteImage ? 'Восстановить' : 'Удалить'}
                      >
                        {deleteImage ? '↩' : '✕'}
                      </button>
                      {deleteImage && <div className={styles.reviewImgBadge}>Удалить</div>}
                    </div>
                  )}

                  {/* New image preview */}
                  {editImage && (
                    <div className={styles.reviewImgCard}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={URL.createObjectURL(editImage)} alt="новое фото" />
                      <button type="button" className={styles.reviewImgAction}
                        onClick={() => setEditImage(null)}>✕</button>
                      <div className={styles.reviewImgBadgeNew}>Новое</div>
                    </div>
                  )}

                  {/* Upload button */}
                  {!editImage && (
                    <button type="button" className={styles.reviewImgUpload}
                      onClick={() => fileRef.current?.click()}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      <span>Загрузить</span>
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => setEditImage(e.target.files?.[0] ?? null)} />
              </div>
            </div>

            {/* Footer */}
            <div className={styles.reviewEditFooter}>
              <button className={styles.cancelBtn} onClick={() => setEditReview(null)}>Отмена</button>
              <button className={styles.saveBtn} onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('users')

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Админ-панель</h1>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'users' ? styles.tabActive : ''}`}
          onClick={() => setTab('users')}
        >
          Пользователи
        </button>
        <button
          className={`${styles.tab} ${tab === 'ads' ? styles.tabActive : ''}`}
          onClick={() => setTab('ads')}
        >
          Реклама
        </button>
        <button
          className={`${styles.tab} ${tab === 'products' ? styles.tabActive : ''}`}
          onClick={() => setTab('products')}
        >
          Товары
        </button>
        <button
          className={`${styles.tab} ${tab === 'orders' ? styles.tabActive : ''}`}
          onClick={() => setTab('orders')}
        >
          Заказы
        </button>
        <button
          className={`${styles.tab} ${tab === 'reviews' ? styles.tabActive : ''}`}
          onClick={() => setTab('reviews')}
        >
          Отзывы
        </button>
      </div>

      {tab === 'users' && <UsersTab />}
      {tab === 'ads' && <AdsTab />}
      {tab === 'products' && <ProductsTab />}
      {tab === 'orders' && <OrdersTab />}
      {tab === 'reviews' && <ReviewsTab />}
    </div>
  )
}
