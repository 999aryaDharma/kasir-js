"use client";

import { useState } from "react";
import useSWR from "swr";
// 1. Ganti import fetcher dan mutator dengan fungsi API yang spesifik
import { fetchCategories, createCategory, updateCategory, deleteCategoryById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";

export default function CategoriesPage() {
	// State untuk tanstack-table
	const [globalFilter, setGlobalFilter] = useState("");
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [debouncedGlobalFilter] = useDebounce(globalFilter, 1000); // Debounce 1000ms

	// 1. Buat URL dinamis yang menyertakan parameter paginasi DAN pencarian
	const constructUrl = () => {
		const params = new URLSearchParams();
		params.append("page", pagination.pageIndex + 1);
		params.append("limit", pagination.pageSize);
		if (debouncedGlobalFilter) {
			params.append("search", debouncedGlobalFilter);
		}
		return `/products?${params.toString()}`;
	};

	// 2. Gunakan `fetchCategories` langsung sebagai fetcher
	const { data: categories, error, mutate } = useSWR("/categories", fetchCategories);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [currentCategory, setCurrentCategory] = useState(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState(null);
	const [categoryName, setCategoryName] = useState("");

	const handleOpenDialog = (category = null) => {
		setCurrentCategory(category);
		setCategoryName(category ? category.name : "");
		setIsDialogOpen(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// 3. Panggil fungsi yang sesuai: update atau create
			if (currentCategory) {
				// Mode Edit
				await updateCategory(currentCategory.id, { name: categoryName });
				toast.success("Kategori berhasil diperbarui.");
			} else {
				// Mode Tambah
				await createCategory({ name: categoryName });
				toast.success("Kategori baru berhasil ditambahkan.");
			}
			mutate(); // Beri tahu SWR untuk mengambil ulang data
			setIsDialogOpen(false); // Tutup dialog
		} catch (err) {
			console.error("Failed to save category", err);
			// Tampilkan notifikasi error
			toast.error(err.message || "Gagal menyimpan kategori.");
		}
	};

	// 1. Ubah fungsi ini untuk membuka dialog, bukan langsung menghapus
	const handleOpenDeleteDialog = (category) => {
		setCategoryToDelete(category);
		setIsDeleteDialogOpen(true);
	};

	// 2. Buat fungsi baru untuk menangani konfirmasi hapus
	const confirmDelete = async () => {
		if (!categoryToDelete) return;
		try {
			await deleteCategoryById(categoryToDelete.id);
			mutate(); // Ambil ulang data
			setIsDeleteDialogOpen(false); // Tutup dialog
			toast.success(`Kategori "${categoryToDelete.name}" berhasil dihapus.`);
			setCategoryToDelete(null); // Reset state
		} catch (err) {
			console.error("Failed to delete category", err);
			toast.error(err.message || "Gagal menghapus kategori.");
		}
	};

	function CategoriesTable() {
		const { data: categories, error } = useSWR("/categories", fetchCategories);

		if (error) return <div className="text-red-500 p-4 border rounded">Gagal memuat data kategori.</div>;
		if (!categories) return <div>Memuat data...</div>;

		return (
			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px] p-4 font-sans font-bold">No</TableHead>
							<TableHead className="p-4 font-sans font-bold">Nama Kategori</TableHead>
							<TableHead className="text-right p-4 font-sans font-bold">Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categories.map((cat, index) => (
							<TableRow key={cat.id}>
								<TableCell className="font-medium pl-4">{index + 1}</TableCell>
								<TableCell className="p-4">{cat.name}</TableCell>
								<TableCell className="text-right">
									<Button variant="ghost" size="icon" onClick={() => handleOpenDialog(cat)}>
										<Edit className="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleOpenDeleteDialog(cat)}>
										<Trash className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		);
	}

	return (
		<div className="">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Manajemen Kategori</h1>
				<div className="flex items-center space-x-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Cari nama atau kode..." value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} className="pl-10" />
					</div>
				</div>

				<Button onClick={() => handleOpenDialog()}>Tambah Kategori</Button>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} className="p-6">
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{currentCategory ? "Edit Kategori" : "Tambah Kategori Baru"}</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<Label htmlFor="name" className={"mb-4"}>
								Nama Kategori
							</Label>
							<Input id="name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
						</div>
						<Button type="submit">Simpan</Button>
					</form>
				</DialogContent>
			</Dialog>

			{/* 3. Tambahkan Dialog untuk konfirmasi hapus */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Konfirmasi Hapus</DialogTitle>
					</DialogHeader>
					<p>
						Yakin ingin menghapus kategori "<strong>{categoryToDelete?.name}</strong>"?
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
			<CategoriesTable />
		</div>
	);
}
