import React from "react";
import i18n from "../i18n";

export type LanguageContextType = {
  locale: Intl.Locale;

  available: string[];
  current: string;
  change: (language: string) => void;
};

const LanguageContext = React.createContext<LanguageContextType>({
  locale: undefined!,

  available: undefined!,
  current: undefined!,
  change: () => {},
});

type AppProviderProps = {
  children: React.ReactNode;
};

export const LanguageProvider: React.FC<AppProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = React.useState<string>(
    () => {
      const internalAvailableLanguages = Object.getOwnPropertyNames(i18n.store.data);
      const storedLanguage = localStorage.getItem("i18nextLng");
      if (storedLanguage && internalAvailableLanguages.includes(storedLanguage)) {
        if (storedLanguage !== "en") {
          i18n.changeLanguage(storedLanguage);
        }
        return storedLanguage;
      }

      const navigatorLanguage = new Intl.Locale(navigator.language).language;
      if (internalAvailableLanguages.includes(navigatorLanguage)) {
        if (navigatorLanguage !== "en") {
          i18n.changeLanguage(navigatorLanguage);
        }
        return navigatorLanguage;
      }
      return "en";
    },
  );

  const locale = React.useMemo(
    () => new Intl.Locale(language, {
      caseFirst: "upper",
      numeric: true,
    }),
    [language],
  );

  const available = React.useMemo(
    () => Object.getOwnPropertyNames(i18n.store.data).sort((left, right) => left.localeCompare(right, locale, { usage: "sort" })),
    [locale],
  );

  const change = (to: string) => {
    if (!available.includes(to)) { return; }

    localStorage.setItem("i18nextLng", to);
    i18n.changeLanguage(to);
    setLanguage(to);
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,

        available,
        current: language,
        change,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
