import type { MenubarEntry } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarEntry.types";

export type { MenubarEntry } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarEntry.types";

export type MenubarExampleProps = {
    checked: MenubarEntry[];
    onActivate: (entry: MenubarEntry) => void;
};
