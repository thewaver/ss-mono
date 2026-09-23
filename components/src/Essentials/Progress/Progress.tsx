import { createMemo } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";

import { access } from "../../Utils/propUtils";
import { PROGRESS_DEFAULTS } from "./Progress.const";
import type { ProgressProps, ProgressState } from "./Progress.types";

import * as styles from "./Progress.css";

const COMPLETE_RATIO = 1;

export const Progress = (props: ProgressProps) => {
    const getSizing = createMemo(() => access(props.sizing) ?? PROGRESS_DEFAULTS.sizing);

    const getMin = createMemo(() => access(props.min) ?? PROGRESS_DEFAULTS.min);

    const getMax = createMemo(() => access(props.max) ?? PROGRESS_DEFAULTS.max);

    const getRole = createMemo(() => access(props.role) ?? PROGRESS_DEFAULTS.role);

    const getState = createMemo((): ProgressState => {
        const min = getMin();
        const max = getMax();
        const span = max - min;
        const given = access(props.value);
        const value = given === undefined && getRole() === "meter" ? min : given;

        return {
            value,
            min,
            max,
            ratio:
                value === undefined
                    ? undefined
                    : span > 0
                      ? MathUtils.clamp(MathUtils.normalize(value, min, max), 0, COMPLETE_RATIO)
                      : COMPLETE_RATIO,
            hasError: access(props.hasError) ?? false,
        };
    });

    if (getMax() <= getMin()) {
        console.warn(
            "Progress: getMax is not greater than getMin, so the range is empty and every value reads as complete. aria-valuemax must exceed aria-valuemin.",
        );
    }

    return (
        <div
            id={access(props.id)}
            class={[styles.progressRoot, styles.progressSizingVariants[getSizing()]].join(" ")}
            role={getRole()}
            aria-label={access(props.ariaLabel)}
            aria-labelledby={access(props.ariaLabelledBy)}
            aria-valuemin={getMin()}
            aria-valuemax={getMax()}
            aria-valuenow={getState().value}
            aria-valuetext={access(props.ariaValueText)}
            aria-invalid={getState().hasError || undefined}
        >
            {props.renderContent(getState)}
        </div>
    );
};
