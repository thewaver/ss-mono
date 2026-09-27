import { useEffect } from "react";

import { PROGRESS_DEFAULTS, ProgressStyles, ProgressUtils } from "@thewaver/ss-components";

import type { ProgressProps } from "./Progress.types";

export const Progress = (props: ProgressProps) => {
    const sizing = props.sizing ?? PROGRESS_DEFAULTS.sizing;
    const min = props.min ?? PROGRESS_DEFAULTS.min;
    const max = props.max ?? PROGRESS_DEFAULTS.max;
    const role = props.role ?? PROGRESS_DEFAULTS.role;

    const state = ProgressUtils.computeState({
        value: props.value,
        min,
        max,
        role,
        hasError: props.hasError ?? false,
    });

    useEffect(() => ProgressUtils.warnIfEmptyRange(min, max), []);

    return (
        <div
            id={props.id}
            className={[ProgressStyles.progressRoot, ProgressStyles.progressSizingVariants[sizing]].join(" ")}
            role={role}
            aria-label={props.ariaLabel}
            aria-labelledby={props.ariaLabelledBy}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={state.value}
            aria-valuetext={props.ariaValueText}
            aria-invalid={state.hasError || undefined}
        >
            {props.renderContent(state)}
        </div>
    );
};
