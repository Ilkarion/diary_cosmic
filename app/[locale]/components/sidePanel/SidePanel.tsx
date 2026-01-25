'use client'

import Image from "next/image";
import lightIcon from "@/public/imgs/light.svg";
import darkIcon from "@/public/imgs/dark.svg";
import langIcon from "@/public/imgs/lang.svg";
import userIcon from "@/public/imgs/user.svg";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import "./sidePanel.scss";

export default function SidePanel({
  onAuthClick = () => {},
  className = "",
}) {
  const [openLangMenu, setOpenLangMenu] = useState(false);

  const { theme, setTheme } = useTheme();

  const path = usePathname();
  const locale = useLocale();

// Wait until the component is rendered on the client to read the theme from localStorage
  function useIsClient() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);
    return isClient;
  }
  const isClient = useIsClient();
  if (!isClient) return null;
  //--------------------------


  function handleOptions(option: string) {
    if (option === "theme") {
      setTheme(theme === "dark" ? "light" : "dark");
    } else if (option === "lang") {
      setOpenLangMenu(!openLangMenu);
    }
  }

  return (
    <aside className={`panel ${className}`}>
      <div className="container">
        <button
          className="iconBtn"
          onClick={() => handleOptions("lang")}
          aria-label="language"
          title="Language"
        >
          <Image src={langIcon} alt="change Language" />
        </button>

        {openLangMenu && (
          <div className="langMenu">
            <Link
              href={path}
              locale="en"
              className={`langBtn ${locale === "en" ? "active" : ""}`}
            >
              EN
            </Link>

            <Link
              href={path}
              locale="ru"
              className={`langBtn ${locale === "ru" ? "active" : ""}`}
            >
              RU
            </Link>
          </div>
        )}

        <button
          className="iconBtn"
          onClick={onAuthClick}
          aria-label="auth"
          title="Account"
        >
          <Image src={userIcon} alt="user" />
        </button>

        <button
          className="iconBtn"
          onClick={() => handleOptions("theme")}
          aria-label="toggle-theme"
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <Image src={darkIcon} alt="dark theme" />
          ) : (
            <Image src={lightIcon} alt="light theme" />
          )}
        </button>
      </div>
    </aside>
  );
}
