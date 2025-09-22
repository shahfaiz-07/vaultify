export type Themes = "light" | "dark" | "cupcake" | "bumblebee" | "emerald" | "corporate" | "synthwave" | "retro" | "cyberpunk" | "valentine" | "halloween" | "garden" | "forest" | "aqua" | "lofi" | "pastel" | "fantasy" | "wireframe" | "black" | "luxury" | "dracula" | "cmyk" | "autumn" | "business" | "acid" | "lemonade" | "night" | "coffee" | "winter";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStateType = {
    theme: Themes;
}

type ThemeActionType = {
    setTheme: (theme: Themes) => void;
}

type ThemeStoreType = ThemeStateType & ThemeActionType;

const useThemeStore = create<ThemeStoreType>()(persist((set) => ({
    theme: "dark",
    setTheme: (theme: Themes) => set(() => ({ theme })),
}), {
    name: 'theme-storage'
}));

export default useThemeStore;