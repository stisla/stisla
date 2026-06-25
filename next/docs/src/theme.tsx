import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/* Class-based dark mode: the toggle sets [data-theme="dark"] on <html>, which our tokens
 * flip against. Client-only (no persistence yet) — SSR renders light, hydrates. Demos read
 * `theme` from this context so their sandboxed iframes follow the docs theme. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const el = document.documentElement;
    if (theme === "dark") el.setAttribute("data-theme", "dark");
    else el.removeAttribute("data-theme");
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
