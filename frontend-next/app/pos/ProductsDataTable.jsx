"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCartState, useCartDispatch } from "@/app/pos/cart/CartState";
import { PosUserDropdown } from "@/components/auth/PosUserDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Komponen untuk Tabel Produk
export function ProductsDataTable({ categoriesData, posData }) {
  // Gunakan semua data dari props
  const allProducts = posData?.products || [];

  const [categoryFilter, setCategoryFilter] = React.useState("all");

  const dispatch = useCartDispatch();
  const addToCart = (product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Kode Produk",
        cell: ({ row }) => (
          <div className="text-muted-foreground">{row.original.code}</div>
        ),
      },
      {
        accessorKey: "name",
        header: "Nama Produk",
      },
      {
        accessorKey: "category.name",
        id: "category", // Definisikan ID yang eksplisit dan sederhana
        header: "Kategori",
        filterFn: (row, id, value) => {
          return value === "all" ? true : row.getValue(id) === value;
        },
      },
      {
        accessorKey: "stock",
        header: () => <div className="text-center">Stok</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.stock}</div>
        ),
      },
      {
        accessorKey: "sellingPrice",
        header: () => <div className="text-right">Harga</div>,
        cell: ({ row }) => (
          <div className="text-right font-medium">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(row.original.sellingPrice)}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Aksi</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addToCart(row.original)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: allProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters: [{ id: "category", value: categoryFilter }],
    },
  });

  return (
    <Card className="flex flex-col h-[calc(100vh-3rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Daftar Produk</CardTitle>
          <PosUserDropdown />
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau kode produk..."
              value={table.getState().globalFilter ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              table.getColumn("category")?.setFilterValue(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder="Semua Kategori"
                className="truncate max-w-[140px]"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categoriesData?.map((cat) => (
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
                  <TableRow key={row.id}>
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
                    Produk tidak ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <div className="flex items-center justify-between px-2 pt-4 pb-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} produk ditemukan.
        </div>
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
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
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
          <div className="flex w-[120px] items-center justify-center text-xs font-medium">
            Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
