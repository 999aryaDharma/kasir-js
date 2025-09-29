"use client";

import { useState, useMemo } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import useSWR, { mutate } from "swr";
// 1. Ganti fetcher dan mutator dengan fungsi API yang spesifik
import {
	fetchProducts,
	createProduct,
	updateProduct,
	deleteProductById,
	fetchCategories, // Tambahkan ini
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const initialFormState = {
	id: null,
	name: "",
	stock: "",
	costPrice: "",
	sellingPrice: "",
	categoryId: "",
	// 'code' tidak perlu ada di form state
};

export default function ProductsPage() {
	// State untuk tanstack-table
	const [globalFilter, setGlobalFilter] = useState("");
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	// 1. Buat URL dinamis untuk SWR
	const productsUrl = `/products?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`;
	const { data: paginatedData, error: productsError, mutate: mutateProducts } = useSWR(productsUrl, fetchProducts);
	const { data: categories, error: categoriesError } = useSWR("/categories", fetchCategories);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [productForm, setProductForm] = useState(initialFormState);
	const [formError, setFormError] = useState(null); // State untuk pesan error
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState(null);

	// 2. Ekstrak data produk dan informasi paginasi
	const products = paginatedData?.data || [];
	const totalPages = paginatedData?.meta?.totalPages || 1;
	const isEditing = !!productForm.id;

	const getCategoryName = (id) => {
		const category = categories?.find((cat) => cat.id === id);
		return category ? category.name : "N/A";
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Nama Produk",
			},
			{
				accessorKey: "code",
				header: "Kode Produk",
			},
			{
				accessorKey: "categoryId",
				header: "Kategori",
				cell: ({ row }) => getCategoryName(row.getValue("categoryId")),
			},
			{
				accessorKey: "stock",
				header: () => <div className="text-center">Stok</div>,
				cell: ({ row }) => <div className="text-center">{row.getValue("stock")}</div>,
			},
			{
				accessorKey: "sellingPrice",
				header: () => <div className="text-right">Harga Jual</div>,
				cell: ({ row }) => <div className="text-right">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(row.getValue("sellingPrice"))}</div>,
			},
			{
				id: "actions",
				header: () => <div className="text-right">Aksi</div>,
				cell: ({ row }) => (
					<div className="text-right">
						<Button variant="ghost" size="icon" onClick={() => handleOpenDialog(row.original)}>
							<Edit className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleOpenDeleteDialog(row.original)}>
							<Trash className="h-4 w-4" />
						</Button>
					</div>
				),
			},
		],
		[categories] // Tambahkan categories sebagai dependensi
	);

	const table = useReactTable({
		data: products, // 3. Gunakan array produk yang sudah diekstrak
		columns,
		pageCount: totalPages, // 4. Beri tahu tabel berapa total halaman
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		manualPagination: true, // 5. Aktifkan mode paginasi manual
		state: {
			globalFilter,
			pagination,
		},
	});

	if (productsError || categoriesError) return <div>Failed to load data</div>;
	if (!paginatedData || !categories) return <div>Loading...</div>;

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
		setFormError(null); // Reset error setiap kali dialog dibuka
		setIsDialogOpen(true);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProductForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormError(null); // Reset error sebelum submit

		const body = {
			name: productForm.name,
			stock: parseInt(productForm.stock, 10) || 0,
			costPrice: parseFloat(productForm.costPrice) || 0,
			sellingPrice: parseFloat(productForm.sellingPrice) || 0,
			categoryId: parseInt(productForm.categoryId, 10),
		};

		try {
			// 3. Panggil fungsi API yang sesuai: update atau create
			if (isEditing) {
				await updateProduct(productForm.id, body);
			} else {
				await createProduct(body);
			}
			mutateProducts(); // Re-fetch products
			setIsDialogOpen(false);
		} catch (err) {
			console.error("Failed to save product", err);
			setFormError(err.message || "Gagal menyimpan produk. Silakan coba lagi.");
		}
	};

	const handleOpenDeleteDialog = (product) => {
		setProductToDelete(product);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!productToDelete) return;
		try {
			await deleteProductById(productToDelete.id);
			mutateProducts();
			setIsDeleteDialogOpen(false);
			setProductToDelete(null);
		} catch (err) {
			console.error("Failed to delete product", err);
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Manajemen Produk</h1>
				<div className="flex items-center space-x-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Cari nama atau kode..." value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} className="pl-10" />
					</div>
					<Button onClick={() => handleOpenDialog()}>Tambah Produk</Button>
				</div>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{isEditing ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
					</DialogHeader>
					{formError && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
							<span className="block sm:inline">{formError}</span>
						</div>
					)}
					<form onSubmit={handleSubmit} className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Nama
							</Label>
							<Input id="name" name="name" value={productForm.name} onChange={handleInputChange} className="col-span-3" required />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="categoryId" className="text-right">
								Kategori
							</Label>
							<Select onValueChange={(value) => setProductForm((prev) => ({ ...prev, categoryId: value }))} value={productForm.categoryId}>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Pilih kategori" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((cat) => (
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
							<Input id="stock" name="stock" type="number" value={productForm.stock} onChange={handleInputChange} className="col-span-3" min="1" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="costPrice" className="text-right text-sm">
								Harga Modal
							</Label>
							<Input id="costPrice" name="costPrice" type="number" value={productForm.costPrice} onChange={handleInputChange} className="col-span-3" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="sellingPrice" className="text-right">
								Harga Jual
							</Label>
							<Input id="sellingPrice" name="sellingPrice" type="number" value={productForm.sellingPrice} onChange={handleInputChange} className="col-span-3" />
						</div>
						<Button type="submit">Simpan</Button>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Konfirmasi Hapus</DialogTitle>
					</DialogHeader>
					<p>
						Yakin ingin menghapus produk "<strong>{productToDelete?.name}</strong>"?
					</p>
					<div className="flex justify-end space-x-2 pt-4">
						<Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
							Batal
						</Button>
						<Button variant="destructive" onClick={confirmDelete}>
							Hapus
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<Card>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									Tidak ada hasil.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Card>
			<DataTablePagination table={table} />
		</div>
	);
}

// Komponen Paginasi dari ShadCN UI
function DataTablePagination({ table }) {
	return (
		<div className="flex items-center justify-between px-2 pt-4">
			<div className="flex-1 text-sm text-muted-foreground"></div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Baris per halaman</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[120px] items-center justify-center text-sm font-medium">
					Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
				</div>
				<div className="flex items-center space-x-2">
					<Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						<span className="sr-only">Go to next page</span>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
