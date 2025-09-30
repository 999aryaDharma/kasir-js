"use client";

// Seluruh kode dari pos/page.js yang lama akan dipindahkan ke sini
import * as React from "react";
import useSWR, { mutate } from "swr";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useDebounce } from "use-debounce";

import { useCartState, useCartDispatch } from "@/app/cart/cartState";
import { UserDropdown } from "@/components/auth/UserDropdown";
import { fetchProducts, fetchCategories, createTransaction } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Search, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User } from "lucide-react";

// ... (Semua komponen helper seperti ProductsDataTable, DataTablePagination, TransactionArea tetap di sini)
// Komponen untuk Tabel Produk
function ProductsDataTable() {
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [debouncedGlobalFilter] = useDebounce(globalFilter, 500);

	const constructUrl = () => {
		const params = new URLSearchParams();
		params.append("page", pagination.pageIndex + 1);
		params.append("limit", pagination.pageSize);
		if (debouncedGlobalFilter) {
			params.append("search", debouncedGlobalFilter);
		}
		const categoryFilter = columnFilters.find((f) => f.id === "categoryName");
		if (categoryFilter && categoryFilter.value !== "all") {
			params.append("category", categoryFilter.value);
		}
		return `/products?${params.toString()}`;
	};

	const { data: paginatedData, error: productsError } = useSWR(constructUrl, fetchProducts);
	const { data: categories, error: categoriesError } = useSWR("/categories", fetchCategories);

	const products = paginatedData?.data || [];
	const totalPages = paginatedData?.meta?.totalPages || 1;
	const dispatch = useCartDispatch();
	const addToCart = (product) => {
		dispatch({ type: "ADD_ITEM", payload: product });
	};

	const columns = React.useMemo(
		() => [
			{
				accessorKey: "code",
				header: "Kode Produk",
				cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("code")}</div>,
			},
			{
				accessorKey: "name",
				header: "Nama Produk",
			},
			{
				id: "categoryName",
				accessorFn: (row) => row.category.name,
				header: "Kategori",
			},
			{
				accessorKey: "stock",
				header: () => <div className="text-center">Stok</div>,
				cell: ({ row }) => <div className="text-center">{row.original.stock}</div>,
			},
			{
				id: "sellingPrice",
				header: () => <div className="text-right">Harga</div>,
				cell: ({ row }) => {
					const amount = parseFloat(row.original.sellingPrice);
					const formatted = new Intl.NumberFormat("id-ID", {
						style: "currency",
						currency: "IDR",
						minimumFractionDigits: 0,
					}).format(amount);
					return <div className="text-right font-medium">{formatted}</div>;
				},
			},
			{
				id: "actions",
				header: () => <div className="text-right">Aksi</div>,
				cell: ({ row }) => (
					<div className="text-right">
						<Button variant="outline" size="sm" onClick={() => addToCart(row.original)}>
							<PlusCircle className="h-4 w-4 mr-2" />
							Tambah
						</Button>
					</div>
				),
			},
		],
		[dispatch]
	);

	const table = useReactTable({
		data: products,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onGlobalFilterChange: setGlobalFilter,
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		pageCount: totalPages,
		manualFiltering: true,
		manualPagination: true,
		state: {
			globalFilter,
			columnFilters,
			pagination,
		},
	});

	if (productsError || categoriesError) return <div>Gagal memuat data.</div>;
	if (!paginatedData || !categories) return <div>Memuat produk...</div>;

	const handleCategoryFilterChange = (value) => {
		table.getColumn("categoryName")?.setFilterValue(value === "all" ? undefined : value);
	};

	return (
		<Card className="flex flex-col h-[calc(100vh-8rem)]">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Daftar Produk</CardTitle>
					<UserDropdown />
				</div>

				<div className="mt-4 flex items-center space-x-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Cari nama atau kode produk..." value={globalFilter ?? ""} onChange={(event) => setGlobalFilter(event.target.value)} className="pl-10" />
					</div>
					<Select value={table.getColumn("categoryName")?.getFilterValue() ?? "all"} onValueChange={handleCategoryFilterChange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Semua Kategori" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Semua Kategori</SelectItem>
							{categories.map((cat) => (
								<SelectItem key={cat.id} value={cat.name}>
									{cat.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent className="flex-1 overflow-y-auto pr-2">
				<div className="border rounded-md">
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
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										Produk tidak ditemukan.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
			<div className="px-4">
				<DataTablePagination table={table} />
			</div>
		</Card>
	);
}

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

function TransactionArea() {
	const [cash, setCash] = React.useState(0);
	const [paymentError, setPaymentError] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [lastChange, setLastChange] = React.useState(null);
	const { items: cartItems } = useCartState();
	const dispatch = useCartDispatch();
	const handleRemoveItem = (itemId) => {
		dispatch({ type: "REMOVE_ITEM", payload: { id: itemId } });
	};
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(amount);
	};
	const total = React.useMemo(() => {
		return cartItems.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);
	}, [cartItems]);
	const change = React.useMemo(() => (cash > 0 ? cash - total : 0), [cash, total]);
	const handlePay = async () => {
		setPaymentError("");
		setLastChange(null);
		setIsLoading(true);
		const cashAmount = parseFloat(cash);
		if (!cartItems.length) {
			setPaymentError("Keranjang kosong.");
			setIsLoading(false);
			return;
		}
		if (isNaN(cashAmount) || cashAmount < total) {
			setPaymentError("Uang tunai tidak cukup.");
			setIsLoading(false);
			return;
		}
		const transactionData = {
			items: cartItems,
			total,
			pay: cashAmount,
		};
		try {
			const result = await createTransaction(transactionData);
			setLastChange(result.change);
			alert(`Transaksi berhasil! Kembalian: ${formatCurrency(result.change)}`);
			dispatch({ type: "CLEAR_CART" });
			setCash(0);
			setLastChange(null);
			mutate("/products");
		} catch (error) {
			setPaymentError(error.message || "Gagal memproses pembayaran.");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Keranjang</CardTitle>
				<CardDescription>{cartItems.length > 0 ? `Terdapat ${cartItems.length} item di keranjang.` : "Keranjang masih kosong."}</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 overflow-y-auto min-h-[150px]">
				{cartItems.length > 0 ? (
					<div className="space-y-4">
						{cartItems.map((item) => (
							<div key={item.id} className="flex justify-between items-center">
								<div>
									<p className="font-medium">{item.name}</p>
									<p className="text-sm text-muted-foreground">
										{formatCurrency(item.sellingPrice)} x {item.quantity}
									</p>
								</div>
								<div className="flex items-center space-x-2">
									<p className="font-semibold">{formatCurrency(item.sellingPrice * item.quantity)}</p>
									<Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleRemoveItem(item.id)}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center text-muted-foreground py-10">Pilih produk untuk ditambahkan ke keranjang.</div>
				)}
			</CardContent>
			<Separator />
			<CardContent className="space-y-4 pt-6">
				<div className="space-y-2">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Subtotal</span>
						<span>{formatCurrency(total)}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Pajak (0%)</span>
						<span>{formatCurrency(0)}</span>
					</div>
					<div className="flex justify-between font-bold text-lg">
						<span>Total</span>
						<span>{formatCurrency(total)}</span>
					</div>
				</div>
				<Separator />
				<div className="space-y-2">
					<Label htmlFor="cash">Uang Tunai</Label>
					<Input
						id="cash"
						type="number"
						placeholder="Masukkan jumlah uang"
						className="my-3"
						value={cash || ""}
						onChange={(e) => {
							setCash(parseFloat(e.target.value) || 0);
							setLastChange(null);
						}}
						disabled={isLoading}
					/>
					{paymentError && <p className="text-sm text-red-500 mt-1">{paymentError}</p>}
				</div>
				<div className="flex justify-between font-bold text-lg">
					<span>Kembalian</span>
					<span>{formatCurrency(lastChange !== null ? lastChange : change)}</span>
				</div>
				<Button className="w-full text-lg h-12" size="lg" onClick={handlePay} disabled={isLoading || cartItems.length === 0 || cash < total}>
					{isLoading ? "Memproses..." : "Bayar"}
				</Button>
			</CardContent>
		</Card>
	);
}

// Komponen Halaman Utama POS
export default function POSView() {
	const [isClient, setIsClient] = React.useState(false);

	React.useEffect(() => {
		// Efek ini hanya berjalan di sisi klien, setelah komponen di-mount
		setIsClient(true);
	}, []);

	return (
		<div className="grid grid-cols-20 gap-6 p-6 items-start">
			<div className="col-span-13">
				<ProductsDataTable />
			</div>
			<div className="col-span-7">
				<div className="sticky top-6">
					{/* Render TransactionArea HANYA jika kita sudah di sisi klien */}
					{isClient ? <TransactionArea /> : <div>Memuat keranjang...</div>}
				</div>
			</div>
		</div>
	);
}
