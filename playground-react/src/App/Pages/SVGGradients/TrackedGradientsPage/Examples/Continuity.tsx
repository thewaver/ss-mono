import { TRACKED_CELLS } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";

import type { TrackedGradientExampleProps } from "../../SVGGradientsReact.types";
import { TrackedShape } from "./Default";

export const ContinuityExample = (props: TrackedGradientExampleProps) => (
    <div className={styles.trackedGrid}>
        {TRACKED_CELLS.map((cell) => (
            <TrackedShape key={cell} {...props} boxClass={styles.trackedCell} />
        ))}
    </div>
);
