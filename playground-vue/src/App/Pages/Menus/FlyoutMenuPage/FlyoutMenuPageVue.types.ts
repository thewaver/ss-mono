import type { FlyoutMenuEntryRecord } from "@thewaver/ss-components-vue";

export type FlyoutMenuExampleProps = {
    entries: FlyoutMenuEntryRecord<string>[];
    hoverShowDelayMs: number;
    transitionDurationMs: number;
};
