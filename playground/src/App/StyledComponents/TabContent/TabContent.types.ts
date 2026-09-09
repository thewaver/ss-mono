import type { AccessorProps, InteractionFlags, TabsDir } from "@thewaver/ss-components";

export type TabContentProps = AccessorProps<{
    flags: InteractionFlags;
    dir: TabsDir;
    isSelected: boolean;
}>;

export type TabDecorationProps = AccessorProps<{
    dir: TabsDir;
}>;

export type TabFloaterProps = AccessorProps<{
    dir: TabsDir;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
}>;

export type TabCellProps = AccessorProps<{
    flags: InteractionFlags;
    isSelected: boolean;
}>;
