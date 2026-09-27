import { Index, createMemo } from "solid-js";

import {
    STAIRCASE_DEFAULTS,
    type StaircaseStepDefs,
    StaircaseUtils,
    StaircaseStyles as styles,
} from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import type { StaircaseProps } from "./StaircaseSolid.types";

export const Staircase = <T,>(props: StaircaseProps<T>) => {
    const getDir = createMemo(() => access(props.dir) ?? STAIRCASE_DEFAULTS.dir);

    const getGap = createMemo(() => access(props.gap) ?? STAIRCASE_DEFAULTS.gap);

    const getStepCount = createMemo(() => access(props.steps).length);

    const getStepDefs = (index: number): StaircaseStepDefs =>
        StaircaseUtils.computeStepDefs(index, getStepCount(), getDir(), access(props.indent));

    const getStepIndent = (index: number) =>
        StaircaseUtils.computeStepIndent(getStepDefs(index), props.computeStepIndent);

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
