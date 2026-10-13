export const CORE_PACKAGE = "@thewaver/ss-playground/";

export const CORE_GLOB_ROOT = "../../../../../playground/src/";

export const CORE_MODULES = import.meta.glob<string>("../../../../../playground/src/**/*.{ts,tsx}", {
    query: "?source",
    import: "default",
});

export const APP_ROOT = "/src/App";

export const PAGES_ROOT = `${APP_ROOT}/Pages/`;

export const STYLED_COMPONENTS_ROOT = `${APP_ROOT}/StyledComponents/`;

export const THEME_STEM = `${APP_ROOT}/Theme`;

export const TAB_GAP = 10;

export const SOURCE_EXTENSIONS = [".tsx", ".ts"];

export const SECTION_GAP = 5;

export const MODAL_MARGIN_HEIGHT = 80;

export const SIBLING_SUFFIXES = [".types.ts", ".css.ts"];

export const FILE_KIND_ORDER = [".tsx", ".ts", ".const.ts", ".utils.ts", ".types.ts", ".css.ts"];

export const IMPORT_PATTERN = /^import\b[^;]*?["']([^"']+)["']\s*;?\s*$/gm;

export const SHOW_PAGE_SCAFFOLDING = true;
