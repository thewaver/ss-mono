import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

export type MenubarEntry = {
    name: string;
    shortcut?: string;
};

export type MenubarExampleProps = AccessorProps<{
    checkedSignal: Signal<MenubarEntry[]>;
    onActivate: (entry: MenubarEntry) => void;
}>;
