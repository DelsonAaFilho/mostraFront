"use client";

import Link from "next/link";
import { Plus, Sun, Moon, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSite } from "@/components/site-provider";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="projeto.lab homepage">
      <span className="logo-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span>
        projeto<span className="logo-lab">.lab</span>
      </span>
    </Link>
  );
}
export function SiteHeader() {
  const { openLogin, openCreate, loggedIn, theme, toggleTheme } = useSite();
  return (
    <header className="site-header">
      <nav className="page-container navbar" aria-label="Main navigation">
        <Logo />
        <div className="nav-actions">
          <Button
            variant="outline"
            className="create-nav"
            aria-label="Create project"
            onClick={openCreate}
          >
            <Plus size={16} />
            <span>Create project</span>
          </Button>
          <Button variant="ghost" className="login-nav" onClick={openLogin}>
            {loggedIn ? "Alex Morgan" : "Log in"}
            <ArrowUpRight size={15} />
          </Button>
          <span className="nav-divider" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </nav>
    </header>
  );
}
