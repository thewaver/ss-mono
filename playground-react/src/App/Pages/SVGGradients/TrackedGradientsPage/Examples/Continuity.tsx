import * as styles from "@thewaver/ss-playground-core/App/Pages/SVGGradients/SVGGradients.css";

import { TRACKED_CELLS } from "../../SVGGradients.const";
import type { TrackedGradientExampleProps } from "../../SVGGradients.types";
import { TrackedShape } from "./Default";

export const ContinuityExample = (props: TrackedGradientExampleProps) => (
    <div className={styles.trackedGrid}>
        {TRACKED_CELLS.map((cell) => (
            <TrackedShape key={cell} {...props} boxClass={styles.trackedCell} />
        ))}
    </div>
);
