"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { createPurchaseOrderAction } from "./actions";

type Vendor = { id: string; name: string };
type Product = { id: string; name: string; price: number };

export default function POForm({ vendors, products }: { vendors: Vendor[], products: Product[] }) {
  const [vendorId, setVendorId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [cart, setCart] = useState<{product: Product, quantity: number, unitCost: number}[]>([]);

  const onProductChange = (val: string) => {
    setSelectedProduct(val);
    const prod = products.find(p => p.id === val);
    if (prod) {
      setUnitCost(prod.price * 0.7); // default 30% margin cost assumption
    }
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) return;
    
    setCart([...cart, { product: prod, quantity, unitCost }]);
    setSelectedProduct("");
    setQuantity(1);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.unitCost * item.quantity), 0);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Tedarikçi Bilgisi</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-foreground">Kayıtlı Tedarikçi</label>
            <select 
              value={vendorId} 
              onChange={(e) => setVendorId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              required
            >
              <option value="" disabled>-- Seçin --</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Alınacak Ürünleri Ekle</h3>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Ürün</label>
              <select 
                value={selectedProduct} 
                onChange={(e) => onProductChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <option value="" disabled>-- Seçin --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-24 space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Birim Mlyt(₺)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={unitCost}
                onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
             <div className="w-full sm:w-20 space-y-2">
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
              <span className="sm:hidden">Ekle</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:w-96">
        <div className="rounded-xl border border-border bg-card p-0 shadow-sm sticky top-24 overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/20">
            <h3 className="font-semibold text-foreground">PO Taslağı</h3>
          </div>
          
          <div className="p-4 space-y-4 min-h-[250px] max-h-[400px] overflow-y-auto w-full">
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">Liste boş. Kalem ekleyin.</p>
            ) : (
              <ul className="space-y-3">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-muted/30 p-3 rounded-md border border-border/50">
                    <div className="flex-1 pr-2">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.quantity} x ₺{item.unitCost.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">₺{(item.unitCost * item.quantity).toFixed(2)}</span>
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
              <span className="font-medium text-muted-foreground">PO Toplamı</span>
              <span className="text-2xl font-bold text-foreground tracking-tight">₺{totalAmount.toFixed(2)}</span>
            </div>
            
            <form action={createPurchaseOrderAction}>
              <input type="hidden" name="vendorId" value={vendorId} />
              <input type="hidden" name="cartData" value={JSON.stringify(cart)} />
              <input type="hidden" name="total" value={totalAmount} />
              
              <button 
                type="submit" 
                disabled={cart.length === 0 || !vendorId}
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary h-12 px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="mr-2 h-4 w-4" />
                Siparişi İlet (DRAFT)
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
