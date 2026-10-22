import { Fragment } from "react";

import { ARROW_BED_PLACEMENTS } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeArrowBedAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { useArrowBed } from "../ArrowBed";

const CENTER_INDEX = 4;

const CELLS = [...ARROW_BED_PLACEMENTS.slice(0, CENTER_INDEX), undefined, ...ARROW_BED_PLACEMENTS.slice(CENTER_INDEX)];

export const ArrowsExample = () => {
    const arrowBed = useArrowBed();

    return (
        <>
            <div className={styles.arrowBed}>
                {CELLS.map((placement) =>
                    placement === undefined ? (
                        <div key={"anchor"} className={styles.arrowBedAnchor} />
                    ) : (
                        <Fragment key={`${placement.x} ${placement.y}`}>
                            {arrowBed.renderTooltip(
                                (size) => computeArrowBedAim(placement, size),
                                `${placement.x} ${placement.y}`,
                            )}
                        </Fragment>
                    ),
                )}
            </div>

            <PageExampleKnobs>{arrowBed.renderKnobs()}</PageExampleKnobs>
        </>
    );
};
