import { MathUtils } from "@thewaver/ss-utils";

import type { ProgressRole, ProgressState } from "./Progress.types";

/** The ratio a bar reads at once it has reached its end, and the whole of an empty range. */
const COMPLETE_RATIO = 1;

/** The parts of a progress bar that are not about how it is drawn: what state its painter is handed. */
export namespace ProgressUtils {
    /**
     * The state a progress bar or meter hands its painter.
     *
     * The ratio is the value's share of the range, clamped into 0..1, so a painter can never draw past either end
     * of its track while the value itself is passed on as given. A range that is empty or inverted reads as
     * complete. A missing value is the indeterminate case and leaves the ratio `undefined` — except under `meter`,
     * which has no indeterminate state and reads a missing value as `min`, so it never goes without a reading.
     *
     * @param params The bar's value, range, role and error flag, with defaults already applied.
     * @returns The state, with `ratio` undefined exactly when the bar is indeterminate.
     */
    export const computeState = (params: {
        value: number | undefined;
        min: number;
        max: number;
        role: ProgressRole;
        hasError: boolean;
    }): ProgressState => {
        const { min, max } = params;
        const value = params.value === undefined && params.role === "meter" ? min : params.value;

        return {
            value,
            min,
            max,
            ratio:
                value === undefined
                    ? undefined
                    : max - min > 0
                      ? MathUtils.clamp(MathUtils.normalize(value, min, max), 0, COMPLETE_RATIO)
                      : COMPLETE_RATIO,
            hasError: params.hasError,
        };
    };

    /**
     * Warns when a bar's range is empty or inverted.
     *
     * `aria-valuemax` has to exceed `aria-valuemin`, and a range that does not reads every value as complete, which
     * is almost always a mistake at the call site rather than an intention.
     *
     * @param min The value that counts as not started.
     * @param max The value that counts as finished.
     */
    export const warnIfEmptyRange = (min: number, max: number) => {
        if (max > min) return;

        console.warn(
            "Progress: getMax is not greater than getMin, so the range is empty and every value reads as complete. aria-valuemax must exceed aria-valuemin.",
        );
    };
}
