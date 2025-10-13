"use client";

import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const DataTablePagination = ({
  table,
  onPaginationChange,
  pagination,
  totalItems = 0,
  isLoading = false,
}) => {
  // Hitung total pages berdasarkan totalItems dan pageSize
  const totalPages = Math.ceil(totalItems / pagination.pageSize);

  // Fungsi untuk mengganti ukuran halaman
  const handlePageSizeChange = (newPageSize) => {
    const newPageSizeNum = Number(newPageSize);
    // Hitung kembali total halaman berdasarkan totalItems dan pageSize baru
    const totalPagesCount = Math.ceil(totalItems / newPageSizeNum);

    // Jika halaman saat ini melebihi jumlah halaman baru, reset ke halaman terakhir
    let newPageIndex = pagination.pageIndex;
    if (newPageIndex >= totalPagesCount && totalPagesCount > 0) {
      newPageIndex = Math.max(0, totalPagesCount - 1);
    } else if (totalPagesCount === 0) {
      newPageIndex = 0;
    }

    onPaginationChange({
      pageIndex: newPageIndex,
      pageSize: newPageSizeNum,
    });
  };

  // Fungsi untuk mengganti halaman
  const handlePageChange = (newPageIndex) => {
    onPaginationChange({
      ...pagination,
      pageIndex: newPageIndex,
    });
  };

  // Fungsi navigasi halaman
  const goToFirstPage = () => handlePageChange(0);
  const goToLastPage = () => {
    const lastPageIndex = Math.max(0, totalPages - 1);
    handlePageChange(lastPageIndex);
  };
  const goToPreviousPage = () => {
    const newPageIndex = Math.max(0, pagination.pageIndex - 1);
    handlePageChange(newPageIndex);
  };
  const goToNextPage = () => {
    const lastPageIndex = Math.max(0, totalPages - 1);
    const newPageIndex = Math.min(pagination.pageIndex + 1, lastPageIndex);
    handlePageChange(newPageIndex);
  };

  // Status tombol navigasi
  const canGoToPreviousPage = pagination.pageIndex > 0;
  const canGoToNextPage = pagination.pageIndex < totalPages - 1;

  return (
    <div className="flex items-center justify-between px-2 pt-4">
      <div className="flex-1 text-sm text-muted-foreground"></div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Baris per halaman</p>
          <Select
            value={`${pagination.pageSize}`}
            onValueChange={handlePageSizeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
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
          Halaman {pagination.pageIndex + 1} dari {totalPages || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={goToFirstPage}
            disabled={!canGoToPreviousPage || isLoading}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToPreviousPage}
            disabled={!canGoToPreviousPage || isLoading}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToNextPage}
            disabled={!canGoToNextPage || isLoading}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={goToLastPage}
            disabled={!canGoToNextPage || isLoading}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(DataTablePagination);
