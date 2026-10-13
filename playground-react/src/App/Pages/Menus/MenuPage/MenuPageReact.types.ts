import type { MenuExampleProps } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.types";

export type { MenuExampleProps } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.types";

export type { Action, Destination } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.types";

export type MenuDrivenExampleProps = MenuExampleProps & {
    visibility: readonly [boolean, (isOpen: boolean) => void];
};

export type MenuCascaderExampleProps = {
    path: readonly [string[], (path: string[]) => void];
};
