import type { StaircaseDir, StaircaseIndents } from "@thewaver/ss-components-svelte";

export type StaircaseExampleProps = {
    steps: string[];
    indent: number;
    gap: number;
    dir: StaircaseDir;
    indentKey: StaircaseIndents.SampleKey;
};
