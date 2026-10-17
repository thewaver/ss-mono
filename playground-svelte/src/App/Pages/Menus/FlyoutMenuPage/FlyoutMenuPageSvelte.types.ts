import type { FlyoutMenuEntryRecord } from "@thewaver/ss-components-svelte";

export type FlyoutMenuExampleProps = {
    entries: FlyoutMenuEntryRecord<string>[];
    hoverShowDelayMs: number;
    transitionDurationMs: number;
};
