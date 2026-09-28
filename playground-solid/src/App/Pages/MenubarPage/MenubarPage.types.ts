import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";
import type { MenubarEntry } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarEntry.types";

export type { MenubarEntry } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarEntry.types";

export type MenubarExampleProps = AccessorProps<{
    checkedSignal: Signal<MenubarEntry[]>;
    onActivate: (entry: MenubarEntry) => void;
}>;
