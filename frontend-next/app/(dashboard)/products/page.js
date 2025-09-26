"use client";

import { useState } from "react";
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
import { Edit, Trash } from "lucide-react";

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
	// 2. Gunakan fungsi fetcher yang benar untuk setiap hook SWR
	const { data: products, error: productsError, mutate: mutateProducts } = useSWR("/products", fetchProducts);
	const { data: categories, error: categoriesError } = useSWR("/categories", fetchCategories);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [productForm, setProductForm] = useState(initialFormState);
	const [formError, setFormError] = useState(null); // State untuk pesan error
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState(null);

	const isEditing = !!productForm.id;

	if (productsError || categoriesError) return <div>Failed to load data</div>;
	if (!products || !categories) return <div>Loading...</div>;

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
			mutate();
			setIsDeleteDialogOpen(false);
			setProductToDelete(null);
		} catch (err) {
			console.error("Failed to delete product", err);
		}
	};

	const getCategoryName = (id) => {
		const category = categories.find((cat) => cat.id === id);
		return category ? category.name : "N/A";
	};

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Manajemen Produk</h1>
				<Button onClick={() => handleOpenDialog()}>Tambah Produk</Button>
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
						<TableRow>
							<TableHead className="p-4">Nama Produk</TableHead>
							<TableHead>Kategori</TableHead>
							<TableHead>Stok</TableHead>
							<TableHead>Harga Modal</TableHead>
							<TableHead>Harga Jual</TableHead>
							<TableHead className="text-right p-4">Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{products.map((product) => (
							<TableRow key={product.id}>
								<TableCell className="p-4">{product.name}</TableCell>
								<TableCell>{getCategoryName(product.categoryId)}</TableCell>
								<TableCell>{product.stock}</TableCell>
								<TableCell>
									{new Intl.NumberFormat("id-ID", {
										style: "currency",
										currency: "IDR",
									}).format(product.costPrice)}
								</TableCell>
								<TableCell>
									{new Intl.NumberFormat("id-ID", {
										style: "currency",
										currency: "IDR",
									}).format(product.sellingPrice)}
								</TableCell>
								<TableCell className="text-right p-4">
									<Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
										<Edit className="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleOpenDeleteDialog(product)}>
										<Trash className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}
