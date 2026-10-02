import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";

import { PagePaintAreaGroup } from "../../../../PageComponents/PaintAreaGroup/PaintAreaGroup";
import { TRACKED_CELLS } from "../../SVGGradients.const";
import type { TrackedGradientExampleProps } from "../../SVGGradients.types";
import { TrackedShape } from "./Default";

export const SharedExample = (props: TrackedGradientExampleProps) => (
    <PagePaintAreaGroup
        className={styles.trackedGrid}
        cellCount={TRACKED_CELLS.length}
        renderCell={(cell) => (
            <TrackedShape
                {...props}
                boxClass={styles.trackedCell}
                groupElement={cell.groupElement}
                groupSize={cell.groupSize}
            />
        )}
    />
);
