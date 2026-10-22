import { For } from "solid-js";

import { ARROW_BED_PLACEMENTS } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeArrowBedAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { createArrowBed } from "../ArrowBed";

const CENTER_INDEX = 4;

export const ArrowsExample = () => {
    const arrowBed = createArrowBed();

    const cells = [
        ...ARROW_BED_PLACEMENTS.slice(0, CENTER_INDEX),
        undefined,
        ...ARROW_BED_PLACEMENTS.slice(CENTER_INDEX),
    ];

    return (
        <>
            <div class={styles.arrowBed}>
                <For each={cells}>
                    {(placement) =>
                        placement === undefined ? (
                            <div class={styles.arrowBedAnchor} />
                        ) : (
                            arrowBed.renderTooltip(
                                (size) => computeArrowBedAim(placement, size),
                                () => `${placement.x} ${placement.y}`,
                            )
                        )
                    }
                </For>
            </div>

            <PageExampleKnobs>{arrowBed.renderKnobs()}</PageExampleKnobs>
        </>
    );
};
