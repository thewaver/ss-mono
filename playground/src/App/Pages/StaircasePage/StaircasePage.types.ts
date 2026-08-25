import type { AccessorProps, StaircaseDir } from "@thewaver/ss-components";

import type { StaircaseIndents } from "../../Samples/StaircaseIndents/StaircaseIndents.const";

export type StaircaseExampleProps = AccessorProps<{
    steps: string[];
    indent: number;
    gap: number;
    dir: StaircaseDir;
    indentKey: StaircaseIndents.SampleKey;
}>;
