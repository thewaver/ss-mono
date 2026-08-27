import { For } from "solid-js";

import { Button, SpotlightHint, access } from "@thewaver/ss-components";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { PADDING, renderHighlight, renderOverlay } from "../SpotlightPage.const";
import type { SpotlightHintExampleProps } from "../SpotlightPage.types";

import * as styles from "../SpotlightPage.css";

const ANCHOR_COUNT = 2;

type Props = SpotlightHintExampleProps;

export const HintExample = (props: Props) => {
    const anchorRefs: HTMLElement[] = [];

    return (
        <div class={styles.root}>
            <PageMeasureBox width={() => styles.HINT_BOX_WIDTH} height={() => styles.HINT_BOX_HEIGHT}>
                <For each={Array.from({ length: ANCHOR_COUNT }, (_unused, index) => index)}>
                    {(_unused, getIndex) => (
                        <div
                            ref={(element) => {
                                anchorRefs[getIndex()] = element;
                            }}
                            class={getIndex() === 0 ? styles.anchorSlidingH : styles.anchorSlidingV}
                        >
                            <Button
                                tooltipDefs={() => ({
                                    placement: () => ({ x: "center", y: "top-out" }),
                                    offset: () => ({ x: 0, y: 5 }),
                                    renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                                        <PageTooltipContent
                                            visibilityTarget={getVisibilityTarget}
                                            transitionDurationMs={getTransitionDurationMs}
                                        >
                                            {getIndex() === 0 ? "Slides across" : "Slides down"}
                                        </PageTooltipContent>
                                    ),
                                })}
                                onClick={async () => {
                                    props.onIndexChange(getIndex());
                                    props.visibilitySignal[1]((prev) => !prev);
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
                elementRef={() => anchorRefs[access(props.index)]}
                padding={() => PADDING}
                visibilitySignal={props.visibilitySignal}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />
        </div>
    );
};
