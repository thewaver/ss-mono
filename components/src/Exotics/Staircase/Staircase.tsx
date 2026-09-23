import { Index, createMemo } from "solid-js";

import { access } from "../../Utils/propUtils";
import { STAIRCASE_DEFAULTS } from "./Staircase.const";
import type { StaircaseProps, StaircaseStepDefs } from "./Staircase.types";

import * as styles from "./Staircase.css";

const computeDefaultStepIndent = (defs: StaircaseStepDefs) => defs.index * defs.indent;

export const Staircase = <T,>(props: StaircaseProps<T>) => {
    const getDir = createMemo(() => access(props.dir) ?? STAIRCASE_DEFAULTS.dir);

    const getGap = createMemo(() => access(props.gap) ?? STAIRCASE_DEFAULTS.gap);

    const getStepCount = createMemo(() => access(props.steps).length);

    const getStepDefs = (index: number): StaircaseStepDefs => ({
        index: getDir() === "down" ? index : getStepCount() - 1 - index,
        stepCount: getStepCount(),
        indent: access(props.indent),
    });

    const getStepIndent = (index: number) => {
        const defs = getStepDefs(index);

        return Math.max(0, (props.computeStepIndent ?? computeDefaultStepIndent)(defs));
    };

    return (
        <div class={styles.staircaseRoot} style={{ gap: `${getGap()}px` }}>
            <Index each={access(props.steps)}>
                {(getStep, index) => (
                    <div
                        class={styles.staircaseStep}
                        style={{
                            "padding-left": `${getStepIndent(index)}px`,
                            "padding-right": `${getStepIndent(index)}px`,
                        }}
                    >
                        {props.renderStep(getStep, () => ({
                            ...getStepDefs(index),
                            stepIndent: getStepIndent(index),
                        }))}
                    </div>
                )}
            </Index>
        </div>
    );
};
