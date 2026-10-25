import { For } from "solid-js";

import { ARROW_BED_PLACEMENTS } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeArrowBedAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";

import { ArrowBedTooltip } from "../ArrowBedTooltip";
import type { ArrowBedDocsExampleProps } from "../TooltipPageSolid.types";

const CENTER_INDEX = 4;

const CELLS = [...ARROW_BED_PLACEMENTS.slice(0, CENTER_INDEX), undefined, ...ARROW_BED_PLACEMENTS.slice(CENTER_INDEX)];

type Props = ArrowBedDocsExampleProps;

export const ArrowsDocsExample = (props: Props) => (
    <div class={styles.arrowBed}>
        <For each={CELLS}>
            {(placement) =>
                placement === undefined ? (
                    <div class={styles.arrowBedAnchor} />
                ) : (
                    <ArrowBedTooltip
                        arrow={props.arrow}
                        arrowWidth={props.arrowWidth}
                        arrowLength={props.arrowLength}
                        shape={props.shape}
                        computeAim={(size) => computeArrowBedAim(placement, size)}
                        label={`${placement.x} ${placement.y}`}
                    />
                )
            }
        </For>
    </div>
);
