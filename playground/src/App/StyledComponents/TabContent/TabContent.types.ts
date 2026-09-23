import type { AccessorProps, InteractionFlags, TabsOrientation } from "@thewaver/ss-components";

export type TabContentProps = AccessorProps<{
    flags: InteractionFlags;
    orientation: TabsOrientation;
    isSelected: boolean;
}>;

export type TabDecorationProps = AccessorProps<{
    orientation: TabsOrientation;
}>;

export type TabFloaterProps = AccessorProps<{
    orientation: TabsOrientation;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
}>;

export type TabCellProps = AccessorProps<{
    flags: InteractionFlags;
    isSelected: boolean;
}>;
