import { createMemo } from "solid-js";

import { PROGRESS_DEFAULTS, ProgressUtils, ProgressStyles as styles } from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import type { ProgressProps } from "./ProgressSolid.types";

export const Progress = (props: ProgressProps) => {
    const getSizing = createMemo(() => access(props.sizing) ?? PROGRESS_DEFAULTS.sizing);

    const getMin = createMemo(() => access(props.min) ?? PROGRESS_DEFAULTS.min);

    const getMax = createMemo(() => access(props.max) ?? PROGRESS_DEFAULTS.max);

    const getRole = createMemo(() => access(props.role) ?? PROGRESS_DEFAULTS.role);

    const getState = createMemo(() =>
        ProgressUtils.computeState({
            value: access(props.value),
            min: getMin(),
            max: getMax(),
            role: getRole(),
            hasError: access(props.hasError) ?? false,
        }),
    );

    ProgressUtils.warnIfEmptyRange(getMin(), getMax());

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
