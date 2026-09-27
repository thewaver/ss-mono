import { useState } from "react";

import { Button, SpotlightHint } from "@thewaver/ss-components-react";
import { PADDING } from "@thewaver/ss-playground-core/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/Spotlights/Spotlights.css";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTooltipContent } from "../../../../StyledComponents/TooltipContent/TooltipContent";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";
import type { SpotlightHintExampleProps } from "../../Spotlights.types";

const ANCHOR_COUNT = 2;
const ANCHOR_INDICES = Array.from({ length: ANCHOR_COUNT }, (_unused, index) => index);

type Props = SpotlightHintExampleProps;

export const HintExample = (props: Props) => {
    const [anchorRefs, setAnchorRefs] = useState<(HTMLElement | undefined)[]>(() =>
        ANCHOR_INDICES.map(() => undefined),
    );

    const [anchorRefSetters] = useState(() =>
        ANCHOR_INDICES.map((index) => (element: HTMLElement | null) => {
            setAnchorRefs((refs) => refs.map((ref, refIndex) => (refIndex === index ? (element ?? undefined) : ref)));
        }),
    );

    const [isVisible, setIsVisible] = props.visibilityState;

    return (
        <div className={styles.root}>
            <PageMeasureBox width={styles.HINT_BOX_WIDTH} height={styles.HINT_BOX_HEIGHT}>
                {ANCHOR_INDICES.map((index) => (
                    <div
                        key={index}
                        ref={anchorRefSetters[index]}
                        className={index === 0 ? styles.anchorSlidingH : styles.anchorSlidingV}
                    >
                        <Button
                            tooltipDefs={{
                                placement: { x: "center", y: "top-out" },
                                offset: { x: 0, y: 10 },
                                renderContent: (visibilityTarget, transitionDurationMs) => (
                                    <PageTooltipContent
                                        visibilityTarget={visibilityTarget}
                                        transitionDurationMs={transitionDurationMs}
                                    >
                                        {index === 0 ? "Slides across" : "Slides down"}
                                    </PageTooltipContent>
                                ),
                            }}
                            onClick={async () => {
                                props.onIndexChange(index);
                                setIsVisible(!isVisible);
                            }}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Highlight Me</PageButtonContent>}
                        />
                    </div>
                ))}
            </PageMeasureBox>

            <SpotlightHint
                elementRef={anchorRefs[props.index]}
                padding={PADDING}
                visibilityState={props.visibilityState}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />
        </div>
    );
};
