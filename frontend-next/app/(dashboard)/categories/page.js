"use client";

import { useMemo, memo, useState, useCallback } from "react";
import useSWR from "swr";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategoryById,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import DataTablePagination from "@/components/DataTablePagination";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { OptimizedSearch } from "@/components/OptimizedSearch";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function CategoriesPage() {
  // State untuk tanstack-table
  const [searchQuery, setSearchQuery] = useState("");
  // State untuk paginasi
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // 1. Buat URL dinamis yang menyertakan parameter paginasi DAN pencarian
  const categoryUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append("page", String(pagination.pageIndex + 1));
    params.append("limit", String(pagination.pageSize));
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    return `/categories?${params.toString()}`;
  }, [pagination, searchQuery]);

  const {
    data: paginatedData,
    mutate: mutate,
    isValidating,
    error: categoriesError,
  } = useSWR(categoryUrl, fetchCategories, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
	const [categoryName, setCategoryName] = useState("");

  // Ekstrak data
  const categories = paginatedData?.data || [];
  const totalPages = paginatedData?.meta?.totalPages || 1;

  // Callback untuk search - MUST be memoized
  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // PERBAIKAN: Stabilkan fungsi dengan useCallback
  const handleOpenDialog = useCallback((category = null) => {
    setCurrentCategory(category);
    setCategoryName(category ? category.name : "");
    setIsDialogOpen(true);
  }, []);

  // PERBAIKAN: Stabilkan fungsi dengan useCallback
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCategory) {
        await updateCategory(currentCategory.id, { name: categoryName });
        toast.success("Kategori berhasil diperbarui.");
      } else {
        await createCategory({ name: categoryName });
        toast.success("Kategori baru berhasil ditambahkan.");
      }
      mutate();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save category", err);
      toast.error(err.message || "Gagal menyimpan kategori.");
    }
  };

  // PERBAIKAN: Stabilkan fungsi dengan useCallback
  const handleOpenDeleteDialog = useCallback((category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  }, []);

  // PERBAIKAN: Stabilkan fungsi dengan useCallback
  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryById(categoryToDelete.id);
      mutate();
      setIsDeleteDialogOpen(false);
      toast.success(`Kategori "${categoryToDelete.name}" berhasil dihapus.`);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Failed to delete category", err);
      toast.error(err.message || "Gagal menghapus kategori.");
    }
  };

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
        size: 10,
      },
      {
        accessorKey: "name",
        header: "Nama Kategori",
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
      },
    ],
    [
      pagination.pageIndex,
      pagination.pageSize,
      handleOpenDialog,
      handleOpenDeleteDialog,
    ]
  );

  const table = useReactTable({
    data: categories,
    columns,
    pageCount: Math.ceil((paginatedData?.meta?.total || 0) / pagination.pageSize),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      pagination,
    },
  });

  // 1. Cek error dulu
  if (categoriesError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">
            {categoriesError?.message || "Failed to load data"}
          </p>
        </div>
      </div>
    );
  }

  // 2. Loading hanya untuk initial load (data belum ada sama sekali)
  if (!paginatedData && !categoriesError && isValidating) {
    // <-- PERBAIKAN: Kondisi loading yang lebih baik
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Kategori</h1>
        <div className="flex items-center space-x-4">
          <OptimizedSearch onSearch={handleSearch} isLoading={isValidating} />
          <Button onClick={() => handleOpenDialog()}>Tambah Kategori</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className={"mb-4"}>
                Nama Kategori
              </Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Simpan</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p>
            Yakin ingin menghapus kategori "
            <strong>{categoryToDelete?.name}</strong>"?
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
        <Table>
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
