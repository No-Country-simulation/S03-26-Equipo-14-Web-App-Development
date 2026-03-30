"use client";
import { useEffect, useState } from "react";
import { Moon, SunDim } from "../lib";

interface ThemeToggleProps {
  size?: number;
}

const ThemeToggle = ({ size }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const saveTheme = localStorage.getItem("theme");
    if (saveTheme) {
      setTheme(saveTheme);
      setMounted(true);
    } else {
      setTheme("light");
    }
  }, []);

  const changeTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  if (!mounted) return <div className="w-9.25 h-9.25" />;

  return (
    <div onClick={changeTheme} className="">
      {theme === "dark" ? (
        <Moon
          size={size || 37}
          className="hover:scale-115 transform transition-transform duration-300"
        />
      ) : (
        <SunDim
          size={size || 37}
          className="hover:scale-115 transform transition-transform duration-300"
        />
      )}
    </div>
  );
};

export default ThemeToggle;
