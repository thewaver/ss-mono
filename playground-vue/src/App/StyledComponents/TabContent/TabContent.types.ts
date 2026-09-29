import type { InteractionFlags, TabsOrientation } from "@thewaver/ss-components-vue";

export type TabContentProps = {
    flags: InteractionFlags;
    orientation: TabsOrientation;
    isSelected: boolean;
};

export type TabDecorationProps = {
    orientation: TabsOrientation;
};

export type TabFloaterProps = {
    orientation: TabsOrientation;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};

export type TabCellProps = {
    flags: InteractionFlags;
    isSelected: boolean;
};
