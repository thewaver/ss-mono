import type { FlyoutMenuEntryRecord } from "@thewaver/ss-components-react";

export type FlyoutMenuExampleProps = {
    entries: FlyoutMenuEntryRecord<string>[];
    hoverShowDelayMs: number;
    transitionDurationMs: number;
};
