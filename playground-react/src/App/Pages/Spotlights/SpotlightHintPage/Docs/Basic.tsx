import { useState } from "react";

import { Button, SpotlightHint } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTooltipContent } from "../../../../StyledComponents/TooltipContent/TooltipContent";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";
import type { SpotlightBasicDocsExampleProps } from "../../SpotlightsReact.types";

const ANCHORS = [
    { id: "hintAcross", tooltip: "Slides across" },
    { id: "hintDown", tooltip: "Slides down" },
];

type Props = SpotlightBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const visibility = useState(false);
    const [, setIsVisible] = visibility;
    const [index, setIndex] = useState(0);

    const [anchorRefs, setAnchorRefs] = useState<(HTMLElement | undefined)[]>(() => ANCHORS.map(() => undefined));

    const [anchorRefSetters] = useState(() =>
        ANCHORS.map((_anchor, anchorIndex) => (element: HTMLElement | null) => {
            setAnchorRefs((refs) =>
                refs.map((ref, refIndex) => (refIndex === anchorIndex ? (element ?? undefined) : ref)),
            );
        }),
    );

    return (
        <div className={styles.root}>
            <PageMeasureBox width={styles.HINT_BOX_WIDTH} height={styles.HINT_BOX_HEIGHT}>
                {ANCHORS.map((anchor, anchorIndex) => (
                    <div
                        key={anchor.id}
                        ref={anchorRefSetters[anchorIndex]}
                        className={anchorIndex === 0 ? styles.anchorSlidingH : styles.anchorSlidingV}
                    >
                        <Button
                            id={anchor.id}
                            tooltipDefs={{
                                placement: { x: "center", y: "top_out" },
                                offset: { x: 0, y: 10 },
                                renderContent: (visibilityTarget, transitionDurationMs) => (
                                    <PageTooltipContent
                                        visibilityTarget={visibilityTarget}
                                        transitionDurationMs={transitionDurationMs}
                                    >
                                        {anchor.tooltip}
                                    </PageTooltipContent>
                                ),
                            }}
                            onClick={() => {
                                setIndex(anchorIndex);
                                setIsVisible((isOpen) => !isOpen);
                            }}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Highlight Me</PageButtonContent>}
                        />
                    </div>
                ))}
            </PageMeasureBox>

            <SpotlightHint
                elementRef={anchorRefs[index]}
                padding={props.padding}
                transitionDurationMs={props.transitionDurationMs}
                visibility={visibility}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />
        </div>
    );
};
