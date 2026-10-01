import { STAIRCASE_DEFAULTS, StaircaseStyles, StaircaseUtils } from "@thewaver/ss-components";

import type { StaircaseProps } from "./Staircase.types";

export const Staircase = <T,>(props: StaircaseProps<T>) => {
    const dir = props.dir ?? STAIRCASE_DEFAULTS.dir;
    const gap = props.gap ?? STAIRCASE_DEFAULTS.gap;
    const stepCount = props.steps.length;

    return (
        <div className={StaircaseStyles.staircaseRoot} style={{ gap: `${gap}px` }}>
            {props.steps.map((step, index) => {
                const defs = StaircaseUtils.computeStepDefs(index, stepCount, dir, props.indent);
                const stepIndent = StaircaseUtils.computeStepIndent(defs, props.computeStepIndent);

                return (
                    <div
                        key={index}
                        className={StaircaseStyles.staircaseStep}
                        style={{ paddingLeft: `${stepIndent}px`, paddingRight: `${stepIndent}px` }}
                    >
                        {props.renderStep(step, { ...defs, stepIndent })}
                    </div>
                );
            })}
        </div>
    );
};
