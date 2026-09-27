import type { Signal } from "solid-js";

import type { Action } from "@thewaver/ss-playground-core/App/Pages/Menus/MenuPage/MenuActions.types";

export type { Action, Destination } from "@thewaver/ss-playground-core/App/Pages/Menus/MenuPage/MenuActions.types";

export type MenuExampleProps = {
    onActivate: (action: Action) => void;
};

export type MenuDrivenExampleProps = MenuExampleProps & {
    visibilitySignal: Signal<boolean>;
};

export type MenuCascaderExampleProps = {
    pathSignal: Signal<string[]>;
};
