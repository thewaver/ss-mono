import type { InteractionFlags, TabsOrientation } from "@thewaver/ss-components";

export type BaseTabContentValues = {
    flags: InteractionFlags;
    orientation: TabsOrientation;
    isSelected: boolean;
};

export type BaseTabContentProps = BaseTabContentValues;

export type BaseTabDecorationValues = {
    orientation: TabsOrientation;
};

export type BaseTabDecorationProps = BaseTabDecorationValues;

export type BaseTabFloaterValues = {
    orientation: TabsOrientation;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};

export type BaseTabFloaterProps = BaseTabFloaterValues;

export type BaseTabCellValues = {
    flags: InteractionFlags;
    isSelected: boolean;
};

export type BaseTabCellProps = BaseTabCellValues;
