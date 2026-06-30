import { createContext, useContext, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/* The cookie the theme is persisted under. A cookie (not localStorage) so the SERVER can read
 * it during SSR and render the right class on <html> up front (see __root.tsx). */
export const THEME_COOKIE = "stisla-theme";

/* Class-based dark mode: the `dark` class on <html>, which the tokens flip against. The server
 * reads the cookie and renders the class into the raw HTML (see __root.tsx), so it's there on
 * the first paint — no flash, no client script. `initialTheme` matches what the server rendered
 * (no hydration mismatch). This provider owns the live toggle: it flips the class and rewrites
 * the cookie. Demos read `theme` from here so their iframes follow the docs theme. */
export function ThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    // Flip the class on <html> so the parent page repaints (the iframes follow via the `theme`
    // prop → postMessage). 1 year; SameSite=Lax is enough for a same-site preference cookie.
    document.documentElement.classList.toggle("dark", next === "dark");
    document.cookie = `${THEME_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
