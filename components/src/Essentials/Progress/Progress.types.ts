import type { JSX } from "solid-js";

import type { AccessorProps } from "../../Utils/typeUtils";

export type ProgressSizing = "fit-content" | "fill";

export type ProgressRole = "progressbar" | "meter";

export type ProgressState = {
    value: number | undefined;
    min: number;
    max: number;
    ratio: number | undefined;
    hasError: boolean;
};

export type ProgressNameProps =
    | AccessorProps<{
          /**
           * Names the bar or gauge for assistive technology. One of this and `ariaLabelledBy` is required under
           * either role, because a value heard without a name is a number with nothing to say what it measures.
           */
          ariaLabel: string;
          ariaLabelledBy?: undefined;
      }>
    | AccessorProps<{
          ariaLabel?: undefined;
          /**
           * Points at the element whose text names the bar or gauge, for one that already shows its own label. One
           * of this and `ariaLabel` is required under either role.
           */
          ariaLabelledBy: string;
      }>;

export type ProgressRoleProps =
    | AccessorProps<{
          /**
           * Whether this is work moving towards done, or a reading of how full something is — disk space, a
           * battery, a password's strength. A meter is heard as a gauge rather than as something that will
           * finish.
           */
          role?: "progressbar";
          /**
           * How far along it is. Leave it out for work whose length is not known, which is what makes the bar
           * indeterminate.
           */
          value?: number;
      }>
    | AccessorProps<{
          /**
           * Whether this is work moving towards done, or a reading of how full something is — disk space, a
           * battery, a password's strength. A meter is heard as a gauge rather than as something that will
           * finish.
           */
          role: "meter";
          /**
           * The reading. Required under `meter`, because a gauge always reads something and has no indeterminate
           * state; a value that arrives missing anyway is read as `min`.
           */
          value: number;
      }>;

export type ProgressProps = ProgressRoleProps &
    ProgressNameProps &
    AccessorProps<{
        /** Identifies the progress bar, so a label elsewhere can point at it. */
        id?: string;
        /**
         * What the value should be read as, where the bare number would not mean anything — three of ten rather than
         * thirty.
         */
        ariaValueText?: string;
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
