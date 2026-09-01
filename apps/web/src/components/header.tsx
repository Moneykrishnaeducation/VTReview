import { NavLink } from "react-router";
import { Search, Globe, User, Menu } from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/reviews", label: "Broker Reviews" },
    { to: "/rankings", label: "Rankings" },
    { to: "/regulators", label: "Regulators" },
    { to: "/news", label: "News" },
    { to: "/about", label: "About" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xl">
              VT
            </div>
            <span className="hidden font-extrabold sm:inline-block text-xl tracking-tight">VTINDEX</span>
          </NavLink>
          <nav className="hidden lg:flex gap-6 text-sm font-medium">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `transition-colors hover:text-foreground/80 ${
                    isActive ? "text-foreground font-bold" : "text-foreground/60"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex relative">
             <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
             <input
               type="search"
               placeholder="Search Broker 🔍"
               className="h-8 w-56 rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
             />
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Globe className="h-4 w-4" />
          </Button>
          <ModeToggle />
          <div className="hidden sm:flex gap-2">
             <Button variant="ghost" size="sm">
               Login
             </Button>
             <Button size="sm">
               Sign Up
             </Button>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
