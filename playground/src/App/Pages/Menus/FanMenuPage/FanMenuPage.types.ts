import type { AccessorProps, MenuItem } from "@thewaver/ss-components";

export type FanAction = {
    name: string;
    shortcut?: string;
};

export type FanMenuExampleProps = AccessorProps<{
    caption: string;
}> & {
    items: MenuItem<FanAction>[];
    onActivate: (action: FanAction) => void;
};
