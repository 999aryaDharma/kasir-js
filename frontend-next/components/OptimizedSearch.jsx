import { useState, useRef, useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function OptimizedSearch({ onSearch, isLoading = false }) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue] = useDebounce(searchValue, 1000);
  const inputRef = useRef(null);
  const isSearching = useRef(false);

  // Kirim search query ke parent hanya ketika debounced value berubah
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  // Handler untuk perubahan input (tidak memicu re-render parent)
  const handleChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  // Maintain focus during typing
  useEffect(() => {
    if (isSearching.current && inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  });

  const handleFocus = useCallback(() => {
    isSearching.current = true;
  }, []);

  const handleBlur = useCallback(() => {
    // Delay untuk memastikan tidak kehilangan focus saat klik di dalam
    setTimeout(() => {
      isSearching.current = false;
    }, 100);
  }, []);

  return (
    <div className="relative">
      {/* Search Icon atau Loading Spinner */}
      <Search
        className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-opacity ${
          isLoading && debouncedValue ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${
          isLoading && debouncedValue ? "opacity-100" : "opacity-0"
        }`}
        role="status"
      />
      
      {/* Input yang di-optimize */}
      <Input
        ref={inputRef}
        placeholder="Cari nama atau kode..."
        value={searchValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="pl-10"
        autoComplete="off"
      />
    </div>
  );
}