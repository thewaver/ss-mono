import { For } from "solid-js";

import * as styles from "@thewaver/ss-playground-core/App/Pages/SVGGradients/SVGGradients.css";

import { TRACKED_CELLS } from "../../SVGGradients.const";
import type { TrackedGradientExampleProps } from "../../SVGGradients.types";
import { TrackedShape } from "./Default";

export const ContinuityExample = (props: TrackedGradientExampleProps) => (
    <div class={styles.trackedGrid}>
        <For each={TRACKED_CELLS}>{() => <TrackedShape {...props} boxClass={styles.trackedCell} />}</For>
    </div>
);
