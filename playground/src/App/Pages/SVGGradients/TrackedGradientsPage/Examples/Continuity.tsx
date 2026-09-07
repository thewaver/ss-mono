import { For } from "solid-js";

import { TRACKED_CELLS } from "../../SVGGradients.const";
import type { TrackedGradientExampleProps } from "../../SVGGradients.types";
import { TrackedShape } from "./Default";

import * as styles from "../../SVGGradients.css";

export const ContinuityExample = (props: TrackedGradientExampleProps) => (
    <div class={styles.trackedGrid}>
        <For each={TRACKED_CELLS}>{() => <TrackedShape {...props} boxClass={styles.trackedCell} />}</For>
    </div>
);
