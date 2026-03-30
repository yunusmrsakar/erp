"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { createOrderAction } from "./actions";

type Customer = { id: string; name: string; email: string };
type Product = { id: string; name: string; price: number; stock: number };

export default function OrderForm({ customers, products }: { customers: Customer[], products: Product[] }) {
  const [customerId, setCustomerId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);

  const addToCart = () => {
    if (!selectedProduct) return;
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) return;
    
    if (quantity > prod.stock) {
      alert(`Stok yetersiz! Sadece ${prod.stock} adet mevcut.`);
      return;
    }
    
    setCart([...cart, { product: prod, quantity }]);
    setSelectedProduct("");
    setQuantity(1);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Müşteri & Belge Tipi</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium leading-none text-foreground">Kayıtlı Müşteri</label>
              <select 
                value={customerId} 
                onChange={(e) => setCustomerId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                required
              >
                <option value="" disabled>-- Müşteri Seçin --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Ürün Ekle</h3>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Stoktan Ürün Seç</label>
              <select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <option value="" disabled>-- Ürün Seçin --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - ₺{p.price.toFixed(2)} (Stok: {p.stock})</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-24 space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Adet</label>
              <input 
                type="number" 
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
            <button 
              type="button" 
              onClick={addToCart}
              className="inline-flex items-center justify-center rounded-lg bg-secondary px-6 h-10 text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2 sm:mr-0" />
              <span className="sm:hidden">Sepete Ekle</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:w-96">
        <div className="rounded-xl border border-border bg-card p-0 shadow-sm sticky top-24 overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/20">
            <h3 className="font-semibold text-foreground">Sipariş Sepeti</h3>
          </div>
          
          <div className="p-4 space-y-4 min-h-[250px] max-h-[400px] overflow-y-auto w-full">
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">Sepet boş. Ürün ekleyin.</p>
            ) : (
              <ul className="space-y-3">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-muted/30 p-3 rounded-md border border-border/50">
                    <div className="flex-1 pr-2">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.quantity} x ₺{item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">₺{(item.product.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(idx)} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive p-1.5 rounded-md transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-5 border-t border-border bg-muted/10">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-muted-foreground">Genel Toplam</span>
              <span className="text-2xl font-bold text-foreground tracking-tight">₺{totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="space-y-3 mb-6 pt-4 border-t border-border">
               <div className="space-y-1">
                 <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Belge Tipi</label>
                 <select name="type" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                    <option value="QUOTATION">Müşteriye Teklif Ver (Quotation)</option>
                    <option value="ORDER">Doğrudan Sipariş Aç (Sales Order)</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Geçerlilik (Teklif İse)</label>
                 <input type="date" name="validUntil" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none" />
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Müşteri Notu</label>
                 <textarea name="notes" rows={2} placeholder="İndirim vb." className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"/>
               </div>
            </div>

            <form action={createOrderAction}>
              <input type="hidden" name="customerId" value={customerId} />
              <input type="hidden" name="cartData" value={JSON.stringify(cart)} />
              <input type="hidden" name="total" value={totalAmount} />
              
              <button 
                type="submit" 
                disabled={cart.length === 0 || !customerId}
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary h-12 px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="mr-2 h-4 w-4" />
                Oluştur
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
