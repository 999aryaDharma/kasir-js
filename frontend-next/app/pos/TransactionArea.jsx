"use client";

import * as React from "react";
import { useCartState, useCartDispatch } from "@/app/pos/cart/CartState";
import { createTransaction } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

export function TransactionArea() {
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
    return cartItems.reduce(
      (acc, item) => acc + item.sellingPrice * item.quantity,
      0
    );
  }, [cartItems]);
  
  const change = React.useMemo(
    () => (cash > 0 ? cash - total : 0),
    [cash, total]
  );
  
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
      toast.success(`Transaksi berhasil!`);
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
    <Card className="flex flex-col h-[calc(100vh-3rem)]">
      <CardHeader>
        <CardTitle>Keranjang</CardTitle>
        <CardDescription>
          {cartItems.length > 0
            ? `Terdapat ${cartItems.length} item di keranjang.`
            : "Keranjang masih kosong."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto min-h-[150px]">
        {cartItems.length > 0 ? (
          <div className="space-y-4.5">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.sellingPrice)} x {item.quantity}
                    </p>
                    <div className="flex items-center ml-3 space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-5 w-5  hover:bg-green-50 mr-2"
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_QUANTITY",
                            payload: { id: item.id, quantityChange: 1 },
                          })
                        }
                      >
                        <Plus />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-5 w-5  hover:bg-red-50"
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_QUANTITY",
                            payload: { id: item.id, quantityChange: -1 },
                          })
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-sm">
                    {formatCurrency(item.sellingPrice * item.quantity)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            Pilih produk untuk ditambahkan ke keranjang.
          </div>
        )}
      </CardContent>
      <Separator />
      <CardContent className="space-y-3 pt-3.5">
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
          {paymentError && (
            <p className="text-sm text-red-500 mt-1">{paymentError}</p>
          )}
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Kembalian</span>
          <span>
            {formatCurrency(lastChange !== null ? lastChange : change)}
          </span>
        </div>
        <Button
          className="w-full text-lg h-12"
          size="lg"
          onClick={handlePay}
          disabled={isLoading || cartItems.length === 0 || cash < total}
        >
          {isLoading ? "Memproses..." : "Bayar"}
        </Button>
      </CardContent>
    </Card>
  );
}