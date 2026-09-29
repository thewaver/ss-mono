import type { MenuItem } from "@thewaver/ss-components-vue";

export type FanAction = {
    name: string;
    shortcut?: string;
};

export type FanMenuExampleProps = {
    caption: string;
    items: MenuItem<FanAction>[];
    onActivate: (action: FanAction) => void;
};
