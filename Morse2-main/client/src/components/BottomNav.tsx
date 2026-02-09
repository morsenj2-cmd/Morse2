import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";

interface BottomNavProps {
  activePage?: string;
}

const hamburgerItems = [
  { name: "Broadcast", path: "/broadcast" },
  { name: "New launches", path: "/launches" },
];

const directTabs = [
  { name: "Messages", path: "/messages" },
  { name: "Communities", path: "/communities" },
];

export const BottomNav = ({ activePage }: BottomNavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const isHamburgerActive = activePage === "Broadcast" || activePage === "New launches";

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] w-full px-4 sm:px-8 py-2 sm:py-3 flex items-center justify-center gap-3 sm:gap-5 border-t border-gray-800">
        <div className="relative" ref={menuRef}>
          <Button
            variant="outline"
            className={`${isHamburgerActive ? "bg-teal-700 border-teal-600" : "bg-[#3a3a3a] border-gray-600"} text-white hover:bg-gray-600 rounded-lg px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm`}
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="button-nav-hamburger"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>

          {menuOpen && (
            <div
              className="absolute bottom-full mb-2 left-0 rounded-xl border border-white/15 px-4 py-3 flex flex-col gap-2 min-w-[160px] shadow-lg"
              style={{
                background: "rgba(30, 30, 30, 0.7)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              {hamburgerItems.map((item) => (
                <Link key={item.name} href={item.path}>
                  <span
                    className={`block text-white text-sm font-normal hover:opacity-80 transition-opacity cursor-pointer py-1 ${
                      activePage === item.name ? "text-teal-400 font-medium" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                    data-testid={`button-nav-${item.name.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {directTabs.map((tab) => (
          <Link key={tab.name} href={tab.path}>
            <Button
              variant="outline"
              className={`${activePage === tab.name ? "bg-teal-700 border-teal-600" : "bg-[#3a3a3a] border-gray-600"} text-white hover:bg-gray-600 rounded-lg px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap`}
              data-testid={`button-nav-${tab.name.toLowerCase().replace(/\s/g, '-')}`}
            >
              {tab.name}
            </Button>
          </Link>
        ))}

        <Link href="/profile">
          <Button
            variant="outline"
            className={`${activePage === "Profile" ? "bg-teal-700 border-teal-600" : "bg-[#3a3a3a] border-gray-600"} text-white hover:bg-gray-600 rounded-lg px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap`}
            data-testid="button-nav-profile"
          >
            Profile
          </Button>
        </Link>

        <UserButton afterSignOutUrl="/" />
      </footer>

      <div className="h-16 sm:h-16"></div>
    </>
  );
};
