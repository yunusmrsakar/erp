import { Search, Bell, User as UserIcon } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center">
          <form className="max-w-md w-full relative group">
            <div className="relative transition-all duration-300 group-focus-within:drop-shadow-sm group-focus-within:scale-[1.01]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="search" 
                className="block w-full rounded-full border border-border bg-muted/30 py-2.5 pl-11 pr-4 text-sm text-foreground focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all" 
                placeholder="Modüllerde, ürünlerde veya faturalarda ara [Cmd + K]" 
              />
            </div>
          </form>
        </div>
        
        <div className="flex items-center gap-5">
          <button className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200">
            <Bell className="h-[22px] w-[22px]" />
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background animate-pulse"></span>
          </button>
          
          <div className="flex items-center gap-3 border-l border-border pl-5 cursor-pointer group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary border border-border group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="hidden flex-col md:flex">
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Yönetici</span>
              <span className="text-[11px] font-medium text-muted-foreground -mt-0.5">admin@nexuserp.com</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
