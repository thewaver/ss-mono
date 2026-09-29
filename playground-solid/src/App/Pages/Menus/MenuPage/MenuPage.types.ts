import type { Signal } from "solid-js";

import type { Action } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.types";

export type { Action, Destination } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.types";

export type MenuExampleProps = {
    onActivate: (action: Action) => void;
};

export type MenuDrivenExampleProps = MenuExampleProps & {
    visibility: Signal<boolean>;
};

export type MenuCascaderExampleProps = {
    path: Signal<string[]>;
};
