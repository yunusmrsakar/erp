import Link from "next/link";
import { LayoutDashboard, Users, Settings, Database, Activity, Truck, PackagePlus, ShoppingCart, BarChart2, Wallet, Briefcase, Layers, Hammer, Box, Wrench, ShieldCheck } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen border-r border-sidebar-border bg-sidebar transition-transform">
      <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
        <Link href="/" className="mb-10 flex items-center pl-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Database className="h-5 w-5" />
          </div>
          <span className="ml-3 text-xl font-bold tracking-tight text-foreground">
            Nexus ERP
          </span>
        </Link>
        <div className="text-xs font-semibold text-muted-foreground mb-4 pl-2 uppercase tracking-wider">Modüller</div>
        <ul className="space-y-1.5 font-medium">
          <li>
            <Link href="/" className="group flex items-center rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <LayoutDashboard className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
             <div className="px-4 py-2 mt-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Üretim Tesisi (PP)</div>
          </li>
          <li>
            <Link href="/bom" className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <div className="flex items-center">
                <Layers className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Ürün Reçeteleri (BOM)</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/production" className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <div className="flex items-center">
                <Hammer className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Üretim Emirleri (Prd)</span>
              </div>
            </Link>
          </li>

          <li>
             <div className="px-4 py-2 mt-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Envanter & Depo (MM)</div>
          </li>
          <li>
            <Link href="/products" className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <div className="flex items-center">
                <Box className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Ürün ve Stoklar</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/inventory" className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Depo Hareketleri</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/vendors" className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Toptancılar</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/purchase-orders" className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <div className="flex items-center">
                <PackagePlus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Satın Alma (PO)</span>
              </div>
            </Link>
          </li>

          <li>
             <div className="px-4 py-2 mt-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Toptan Satış (SD)</div>
          </li>
          <li>
            <Link href="/customers" className="group flex items-center rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <Users className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="ml-3">Müşteriler (CRM)</span>
            </Link>
          </li>
          <li>
            <Link href="/orders" className="group flex items-center rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="ml-3">Sipariş & Gönderim</span>
            </Link>
          </li>

          <li>
             <div className="px-4 py-2 mt-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Muhasebe & İK (FI/HR)</div>
          </li>
          <li>
            <Link href="/finance" className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Bilanço (FI)</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/hr" className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Personel Yönetimi</span>
              </div>
            </Link>
          </li>

          <li>
            <div className="px-4 py-2 mt-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Kalite & Bakım (QM/PM)</div>
          </li>
          <li>
            <Link href="/quality" className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Kalite Yönetimi (QM)</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/maintenance" className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
              <div className="flex items-center">
                <Wrench className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Bakım & Onarım (PM)</span>
              </div>
            </Link>
          </li>
        </ul>
        
        <div className="mt-auto pt-6">
          <Link href="/reports" className="group flex items-center rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200">
             <BarChart2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
             <span className="ml-3">Genel Rapor</span>
          </Link>
          <Link href="/settings" className="group flex items-center rounded-lg px-3 py-2.5 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200 mb-6">
            <Settings className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="ml-3">Ayarlar</span>
          </Link>
          
          <div className="rounded-xl border border-border bg-background p-4 relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <h5 className="text-sm font-semibold text-foreground">Sistem Online</h5>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Veritabanı senkronizasyonu aktif. Gecikme 12ms.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
