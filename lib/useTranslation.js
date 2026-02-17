// import { useRouter } from "next/router";
// import nl from "../locales/nl/common.json";
// import en from "../locales/en/common.json";

// export const useTranslation = () => {
//   const { locale } = useRouter();

//   const translations = {
//     nl,
//     en
//   };

//   const t = (key) => {
//     return translations[locale]?.[key] || key;
//   };

//   return { t };
// };

import { useRouter } from "next/router";
import nl from "@/locales/nl/common";
import en from "@/locales/en/common";

export const useTranslation = () => {
  const { locale } = useRouter();

  const translations = {
    nl,
    en
  };

  const t = (path) => {
    const keys = path.split(".");
    let result = translations[locale];

    keys.forEach((key) => {
      result = result?.[key];
    });

    return result || path;
  };

  return { t };
};
