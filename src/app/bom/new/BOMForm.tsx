"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { createBomAction } from "../actions";

type Product = { id: string; name: string; sku: string };

export default function BOMForm({ finishedGoods, rawMaterials }: { finishedGoods: Product[], rawMaterials: Product[] }) {
  const [finishedProductId, setFinishedProductId] = useState("");
  const [selectedRawId, setSelectedRawId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [ingredients, setIngredients] = useState<{product: Product, quantity: number}[]>([]);

  const addIngredient = () => {
    if (!selectedRawId) return;
    const raw = rawMaterials.find(r => r.id === selectedRawId);
    if (!raw) return;

    // Check if exists, sum quantity
    const existingIndex = ingredients.findIndex(i => i.product.id === selectedRawId);
    if (existingIndex > -1) {
       const newIngredients = [...ingredients];
       newIngredients[existingIndex].quantity += quantity;
       setIngredients(newIngredients);
    } else {
       setIngredients([...ingredients, { product: raw, quantity }]);
    }
    
    setSelectedRawId("");
    setQuantity(1);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">1. Hedef Ürün (Ne Üretilecek?)</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-foreground">Satılabilir (Bitmiş) Ürün Seçin</label>
            <select 
              value={finishedProductId} 
              onChange={(e) => setFinishedProductId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              required
            >
              <option value="" disabled>-- Ürün Seçin --</option>
              {finishedGoods.map(p => (
                <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">2. Reçete Karışımı (Hangi Hammaddeler Gerekli?)</h3>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Ham Madde / Malzeme Seçin</label>
              <select 
                value={selectedRawId} 
                onChange={(e) => setSelectedRawId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <option value="" disabled>-- Malzeme Seçin --</option>
                {rawMaterials.map(p => (
                  <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-24 space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Miktar/Adet</label>
              <input 
                type="number" 
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
            <button 
              type="button" 
              onClick={addIngredient}
              className="inline-flex items-center justify-center rounded-lg bg-secondary px-6 h-10 text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ekle
            </button>
          </div>
        </div>
      </div>

      <div className="lg:w-96">
        <div className="rounded-xl border border-border bg-card p-0 shadow-sm sticky top-24 overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/20">
            <h3 className="font-semibold text-foreground">Reçete Formülü (BOM)</h3>
          </div>
          
          <div className="p-4 space-y-4 min-h-[250px] max-h-[400px] overflow-y-auto w-full">
            {ingredients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">Henüz malzeme eklenmedi. Sol taraftan formüle ham madde ekleyin.</p>
            ) : (
              <ul className="space-y-3">
                {ingredients.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-muted/30 p-3 rounded-md border border-border/50">
                    <div className="flex-1 pr-2">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.product.sku}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold px-2 py-1 bg-background rounded-md border border-border">x{item.quantity}</span>
                      <button onClick={() => removeIngredient(idx)} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive p-1.5 rounded-md transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-5 border-t border-border bg-muted/10">
            <form action={createBomAction}>
              <input type="hidden" name="finishedProductId" value={finishedProductId} />
              <input type="hidden" name="rawMaterials" value={JSON.stringify(ingredients.map(i => ({ rawMaterialId: i.product.id, quantity: i.quantity })))} />
              
              <button 
                type="submit" 
                disabled={ingredients.length === 0 || !finishedProductId}
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary h-12 px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="mr-2 h-4 w-4" />
                Üretim Reçetesini Kaydet
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
