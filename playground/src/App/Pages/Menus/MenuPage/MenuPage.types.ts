import type { Signal } from "solid-js";

export type Action = {
    name: string;
    shortcut?: string;
};

export type MenuExampleProps = {
    onActivate: (action: Action) => void;
};

export type MenuDrivenExampleProps = MenuExampleProps & {
    visibilitySignal: Signal<boolean>;
};

export type Destination = {
    name: string;
    path: string[];
    isLeaf: boolean;
};

export type MenuCascaderExampleProps = {
    pathSignal: Signal<string[]>;
};
