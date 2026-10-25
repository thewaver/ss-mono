import { ARROW_BED_PLACEMENTS } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeArrowBedAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";

import { ArrowBedTooltip } from "../ArrowBedTooltip";
import type { ArrowBedDocsExampleProps } from "../TooltipPageReact.types";

const CENTER_INDEX = 4;

const CELLS = [...ARROW_BED_PLACEMENTS.slice(0, CENTER_INDEX), undefined, ...ARROW_BED_PLACEMENTS.slice(CENTER_INDEX)];

type Props = ArrowBedDocsExampleProps;

export const ArrowsDocsExample = (props: Props) => (
    <div className={styles.arrowBed}>
        {CELLS.map((placement) =>
            placement === undefined ? (
                <div key={"anchor"} className={styles.arrowBedAnchor} />
            ) : (
                <ArrowBedTooltip
                    key={`${placement.x} ${placement.y}`}
                    arrow={props.arrow}
                    arrowWidth={props.arrowWidth}
                    arrowLength={props.arrowLength}
                    shape={props.shape}
                    computeAim={(size) => computeArrowBedAim(placement, size)}
                    label={`${placement.x} ${placement.y}`}
                />
            ),
        )}
    </div>
);
