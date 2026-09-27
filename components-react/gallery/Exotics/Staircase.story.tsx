import type { StaircaseDir, StaircaseStepDefs } from "@thewaver/ss-components";

import { Staircase } from "../../src";

const HOST_STYLE = { width: "400px" };
const STEP_STYLE = { background: "lightsteelblue" };

const INDENTS = {
    linear: undefined,
    hourglass: (defs: StaircaseStepDefs) => Math.min(defs.index, defs.stepCount - 1 - defs.index) * defs.indent * 2,
};

type DefaultProps = {
    stepCount?: number;
    indent?: number;
    gap?: number;
    dir?: StaircaseDir;
    indentKey?: keyof typeof INDENTS;
};

export const Default = ({ stepCount = 4, indent = 12, gap, dir, indentKey = "linear" }: DefaultProps) => (
    <div data-testid="default" style={HOST_STYLE}>
        <Staircase<string>
            steps={Array.from({ length: stepCount }, (_unused, index) => `Step ${index + 1}`)}
            indent={indent}
            gap={gap}
            dir={dir}
            computeStepIndent={INDENTS[indentKey]}
            renderStep={(step, state) => <div style={STEP_STYLE}>{`${step}, indented ${state.stepIndent}`}</div>}
        />
    </div>
);
