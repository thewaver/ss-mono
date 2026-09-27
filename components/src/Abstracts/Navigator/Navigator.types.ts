import type { Store } from "@thewaver/ss-utils";

export type NavigatorOrientation = "horizontal" | "vertical" | "both";

export type NavigatorDirection = "ltr" | "rtl";

export type NavigatorGrid = {
    rowCount: number;
    colCount: number;
};

export type NavigatorDirectionWatcher = Store<NavigatorDirection> & {
    observe: (element: HTMLElement) => () => void;
};
