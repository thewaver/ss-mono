import type { AccessorProps, FlyoutMenuEntryRecord } from "@thewaver/ss-components-solid";

export type FlyoutMenuExampleProps = AccessorProps<{
    entries: FlyoutMenuEntryRecord<string>[];
    hoverShowDelayMs: number;
    transitionDurationMs: number;
}>;
