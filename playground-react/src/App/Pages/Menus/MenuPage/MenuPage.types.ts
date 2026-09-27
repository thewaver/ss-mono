import type { Action } from "@thewaver/ss-playground-core/App/Pages/Menus/MenuPage/MenuActions.types";

export type { Action, Destination } from "@thewaver/ss-playground-core/App/Pages/Menus/MenuPage/MenuActions.types";

export type MenuExampleProps = {
    onActivate: (action: Action) => void;
};

export type MenuDrivenExampleProps = MenuExampleProps & {
    visibilityState: readonly [boolean, (isOpen: boolean) => void];
};

export type MenuCascaderExampleProps = {
    pathState: readonly [string[], (path: string[]) => void];
};
