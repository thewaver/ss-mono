import { For, createSignal } from "solid-js";

import { Button, SpotlightHint } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTooltipContent } from "../../../../StyledComponents/TooltipContent/TooltipContent";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";
import type { SpotlightBasicDocsExampleProps } from "../../SpotlightsSolid.types";

const ANCHORS = [
    { id: "hintAcross", tooltip: "Slides across" },
    { id: "hintDown", tooltip: "Slides down" },
];

type Props = SpotlightBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const visibility = createSignal(false);
    const [getIndex, setIndex] = createSignal(0);

    const anchorRefs: HTMLElement[] = [];

    return (
        <div class={styles.root}>
            <PageMeasureBox width={styles.HINT_BOX_WIDTH} height={styles.HINT_BOX_HEIGHT}>
                <For each={ANCHORS}>
                    {(anchor, getAnchorIndex) => (
                        <div
                            ref={(element) => {
                                anchorRefs[getAnchorIndex()] = element;
                            }}
                            class={getAnchorIndex() === 0 ? styles.anchorSlidingH : styles.anchorSlidingV}
                        >
                            <Button
                                id={anchor.id}
                                tooltipDefs={() => ({
                                    placement: () => ({ x: "center", y: "top_out" }),
                                    offset: () => ({ x: 0, y: 10 }),
                                    renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                                        <PageTooltipContent
                                            visibilityTarget={getVisibilityTarget}
                                            transitionDurationMs={getTransitionDurationMs}
                                        >
                                            {anchor.tooltip}
                                        </PageTooltipContent>
                                    ),
                                })}
                                onClick={() => {
                                    setIndex(getAnchorIndex());
                                    visibility[1]((isOpen) => !isOpen);
                                }}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Highlight Me</PageButtonContent>
                                )}
                            />
                        </div>
                    )}
                </For>
            </PageMeasureBox>

            <SpotlightHint
                elementRef={() => anchorRefs[getIndex()]}
                padding={props.padding}
                transitionDurationMs={props.transitionDurationMs}
                visibility={visibility}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />
        </div>
    );
};
