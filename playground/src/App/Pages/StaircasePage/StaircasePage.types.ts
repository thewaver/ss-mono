import type { StaircaseDir, StaircaseIndents } from "@thewaver/ss-components";

export type BaseStaircaseExampleValues = {
    steps: string[];
    indent: number;
    gap: number;
    dir: StaircaseDir;
    indentKey: StaircaseIndents.SampleKey;
};

export type BaseStaircaseExampleProps = BaseStaircaseExampleValues;
