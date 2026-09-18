import type { JSX } from "solid-js";

import type { AccessorProps } from "../../Utils/typeUtils";

export type ProgressSizing = "fit-content" | "fill";

export type ProgressState = {
    value: number | undefined;
    min: number;
    max: number;
    ratio: number | undefined;
    hasError: boolean;
};

export type ProgressProps = AccessorProps<{
    /** Identifies the progress bar, so a label elsewhere can point at it. */
    id?: string;
    /** Names the progress bar for assistive technology. */
    ariaLabel?: string;
    /** Points at the element whose text names the progress bar, for a bar that already shows its own label. */
    ariaLabelledBy?: string;
    /**
     * What the value should be read as, where the bare number would not mean anything — three of ten rather than
     * thirty.
     */
    ariaValueText?: string;
    /**
     * How far along it is. Leave it out for work whose length is not known, which is what makes the bar indeterminate.
     */
    value?: number;
    /** The value that counts as not started. */
    min?: number;
    /** The value that counts as finished. */
    max?: number;
    /** Puts the bar into its error look, for work that has failed rather than finished. */
    hasError?: boolean;
    /** Whether the bar takes only the room it needs or fills what it is given. */
    sizing?: ProgressSizing;
    /** Draws the bar, and is told how far along it is. */
    renderContent: (getState: () => ProgressState) => JSX.Element;
}>;
