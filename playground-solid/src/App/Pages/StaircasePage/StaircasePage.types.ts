import type { AccessorProps, StaircaseDir, StaircaseIndents } from "@thewaver/ss-components-solid";

export type StaircaseExampleProps = AccessorProps<{
    steps: string[];
    indent: number;
    gap: number;
    dir: StaircaseDir;
    indentKey: StaircaseIndents.SampleKey;
}>;
