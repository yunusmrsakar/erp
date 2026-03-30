import { Save, User, Shield, BellRing, Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 pb-8 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sistem Ayarları</h1>
        <p className="text-muted-foreground mt-1 text-sm">ERP tercihlerinizi, profilinizi ve güvenlik ayarlarınızı yönetin.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1 space-y-2">
          <button className="flex items-center w-full gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-colors text-left">
            <User className="h-4 w-4" /> Profil Ayarları
          </button>
          <button className="flex items-center w-full gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-colors text-left">
            <Shield className="h-4 w-4" /> Güvenlik
          </button>
          <button className="flex items-center w-full gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-colors text-left">
            <BellRing className="h-4 w-4" /> Bildirimler
          </button>
          <button className="flex items-center w-full gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-colors text-left">
            <Settings className="h-4 w-4" /> Genel
          </button>
        </div>

        <div className="md:col-span-3">
          <div className="rounded-xl border border-border bg-card shadow-sm h-full">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Kişisel Bilgiler</h3>
              <p className="text-sm text-muted-foreground mt-1">Sistemdeki temel bilgilerinizi buradan güncelleyebilirsiniz.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tam İsim</label>
                  <input type="text" defaultValue="Yönetici" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">E-posta</label>
                  <input type="email" defaultValue="admin@nexuserp.com" disabled className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground ring-offset-background" />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground">Tercihler</h4>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                  <div>
                    <p className="font-medium text-sm">Karanlık Mod (Dark Mode)</p>
                    <p className="text-xs text-muted-foreground">Sistem şu anda varsayılan olarak karanlık temadadır.</p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-primary relative cursor-not-allowed opacity-80">
                    <div className="h-4 w-4 rounded-full bg-background absolute top-1 right-1 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end">
              <button className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
                <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
