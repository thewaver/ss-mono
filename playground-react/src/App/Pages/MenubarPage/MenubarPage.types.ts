import type { MenubarEntry } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarEntry.types";

export type { MenubarEntry } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarEntry.types";

export type MenubarExampleProps = {
    checkedState: readonly [MenubarEntry[], (checked: MenubarEntry[]) => void];
    onActivate: (entry: MenubarEntry) => void;
};
