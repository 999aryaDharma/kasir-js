"use client";

import { useState, useMemo, memo, useCallback } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useSWR from "swr";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProductById,
  fetchCategories,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DataTablePagination from "@/components/DataTablePagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { OptimizedSearch } from "@/components/OptimizedSearch";

const initialFormState = {
  id: null,
  name: "",
  stock: "",
  costPrice: "",
  sellingPrice: "",
  categoryId: "",
};

export default function ProductsPage() {
  // State untuk pencarian (hanya menyimpan search query final)
  const [searchQuery, setSearchQuery] = useState("");
  // State untuk form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState(initialFormState);
  const [formError, setFormError] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // State untuk paginasi
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // KUNCI UTAMA: Gunakan useMemo untuk URL agar stabil
  const productsUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append("page", String(pagination.pageIndex + 1));
    params.append("limit", String(pagination.pageSize));
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    return `/products?${params.toString()}`;
  }, [pagination.pageIndex, pagination.pageSize, searchQuery]);

  // Fetch data
  const {
    data: paginatedData,
    error: productsError,
    mutate: mutateProducts,
    isValidating,
  } = useSWR(productsUrl, fetchProducts, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const { data: categoriesData } = useSWR(
    isDialogOpen ? "/categories" : null,
    fetchCategories
  );
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.data || [];

  // Ekstrak data
  const products = paginatedData?.data || [];
  const totalPages = paginatedData?.meta?.totalPages || 1;
  const isEditing = !!productForm.id;

  const handleOpenDialog = (product = null) => {
    if (product) {
      setProductForm({
        id: product.id,
        name: product.name,
        stock: String(product.stock || ""),
        costPrice: String(product.costPrice || ""),
        sellingPrice: String(product.sellingPrice || ""),
        categoryId: String(product.categoryId || ""),
      });
    } else {
      setProductForm(initialFormState);
    }
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const body = {
      name: productForm.name,
      stock: parseInt(productForm.stock, 10) || 0,
      costPrice: parseFloat(productForm.costPrice) || 0,
      sellingPrice: parseFloat(productForm.sellingPrice) || 0,
      categoryId: parseInt(productForm.categoryId, 10),
    };

    try {
      if (isEditing) {
        await updateProduct(productForm.id, body);
        toast.success("Produk berhasil diperbarui.");
      } else {
        await createProduct(body);
        toast.success("Produk baru berhasil ditambahkan.");
      }
      mutateProducts();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save product", err);
      setFormError(err.message || "Gagal menyimpan produk. Silakan coba lagi.");
      toast.error(err.message || "Gagal menyimpan produk.");
    }
  };

  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const columns = useMemo(
    () => [
      {
        id: "no",
        header: () => <div className="pl-4">No</div>,
        cell: ({ row }) => (
          <div className="pl-4">
            {row.index + 1 + pagination.pageIndex * pagination.pageSize}
          </div>
        ),
        size: 5,
        minSize: 20,
      },
      {
        accessorKey: "code",
        header: "Kode Produk",
      },
      {
        accessorKey: "name",
        header: "Nama Produk",
      },
      {
        accessorKey: "categoryId",
        header: "Kategori",
        cell: ({ row }) => row.original.category?.name || "N/A",
      },
      {
        accessorKey: "stock",
        header: () => <div className="text-center">Stok</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("stock")}</div>
        ),
        minSize: 70,
      },
      {
        accessorKey: "sellingPrice",
        header: () => <div className="text-right">Harga Jual</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(row.getValue("sellingPrice"))}
          </div>
        ),
      },
      {
        accessorKey: "costPrice",
        header: () => <div className="text-right">Harga Modal</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(row.getValue("costPrice"))}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right pr-4">Aksi</div>,
        cell: ({ row }) => (
          <div className="text-right pr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenDialog(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => handleOpenDeleteDialog(row.original)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ),
        minSize: 100,
      },
    ],
    [pagination.pageIndex, pagination.pageSize]
  );

  const table = useReactTable({
    data: products,
    columns,
    pageCount: Math.ceil(
      (paginatedData?.meta?.total || 0) / pagination.pageSize
    ),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      pagination,
    },
  });

  // PERBAIKAN: Urutan pengecekan yang benar
  // 1. Cek error dulu
  if (productsError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">
            {productsError?.message || "Failed to load data"}
          </p>
        </div>
      </div>
    );
  }

  // 2. Loading hanya untuk initial load (data belum ada sama sekali)
  if (!paginatedData && !productsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductById(productToDelete.id);
      mutateProducts();
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      toast.success(`Produk "${productToDelete.name}" berhasil dihapus.`);
    } catch (err) {
      console.error("Failed to delete product", err);
      toast.error(err.message || "Gagal menghapus produk.");
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Produk</h1>
        <div className="flex items-center space-x-4">
          <OptimizedSearch onSearch={handleSearch} isLoading={isValidating} />
          <Button onClick={() => handleOpenDialog()}>Tambah Produk</Button>
        </div>
      </div>

      {/* Dialog Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
          </DialogHeader>
          {formError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{formError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                name="name"
                value={productForm.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryId" className="text-right">
                Kategori
              </Label>
              <Select
                onValueChange={(value) =>
                  setProductForm((prev) => ({ ...prev, categoryId: value }))
                }
                value={productForm.categoryId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stok
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={productForm.stock}
                onChange={handleInputChange}
                className="col-span-3"
                min="1"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costPrice" className="text-right text-sm">
                Harga Modal
              </Label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                value={productForm.costPrice}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sellingPrice" className="text-right">
                Harga Jual
              </Label>
              <Input
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                value={productForm.sellingPrice}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <Button type="submit">Simpan</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p>
            Yakin ingin menghapus produk "
            <strong>{productToDelete?.name}</strong>"?
          </p>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <Card>
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada hasil.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <DataTablePagination
        table={table}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalItems={paginatedData?.meta?.total || 0}
        isLoading={isValidating}
      />
    </div>
  );
}
