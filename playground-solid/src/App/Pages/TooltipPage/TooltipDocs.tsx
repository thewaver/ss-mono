import { Show, createMemo, createSignal } from "solid-js";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-solid";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-solid";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import {
    type ArrowBedArrow,
    type ArrowBedShape,
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import {
    TOOLTIP_ARROWS,
    TOOLTIP_ARROW_LABELS,
    TOOLTIP_HOVER_DELAY_MS,
    TOOLTIP_REVEALS,
    TOOLTIP_REVEAL_LABELS,
    type TooltipArrow,
    type TooltipReveal,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { ArrowBedKnobs } from "./ArrowBedKnobs";
import { ArrowsDocsExample } from "./Docs/Arrows";
import { BasicDocsExample } from "./Docs/Basic";
import { CirclingDocsExample } from "./Docs/Circling";
import { RichDocsExample } from "./Docs/Rich";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { WordDocsExample } from "./Docs/Word";

export const TooltipDocs = () => {
    const [getReveal, setReveal] = createSignal<TooltipReveal>(TooltipKnobs.STARTING_REVEAL);
    const [getArrow, setArrow] = createSignal<TooltipArrow>(TooltipKnobs.STARTING_ARROW);
    const [getArrowWidth, setArrowWidth] = createSignal(TooltipKnobs.STARTING_ARROW_WIDTH);
    const [getArrowLength, setArrowLength] = createSignal(TooltipKnobs.STARTING_ARROW_LENGTH);
    const [getHPlacement, setHPlacement] = createSignal<AnchorHPlacement>(TooltipKnobs.STARTING_H_PLACEMENT);
    const [getVPlacement, setVPlacement] = createSignal<AnchorVPlacement>(TooltipKnobs.STARTING_V_PLACEMENT);
    const [getOffsetX, setOffsetX] = createSignal(TooltipKnobs.STARTING_OFFSET_X);
    const [getOffsetY, setOffsetY] = createSignal(TooltipKnobs.STARTING_OFFSET_Y);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(TOOLTIP_DEFAULTS.transitionDurationMs);
    const [getFocusShowDelayMs, setFocusShowDelayMs] = createSignal(TOOLTIP_DEFAULTS.focusShowDelayMs);
    const [getHoverShowDelayMs, setHoverShowDelayMs] = createSignal(TOOLTIP_HOVER_DELAY_MS);

    const circlingArrow = createSignal<ArrowBedArrow>(TooltipKnobs.STARTING_ARROW_BED_ARROW);
    const circlingArrowWidth = createSignal(TooltipKnobs.STARTING_ARROW_WIDTH);
    const circlingArrowLength = createSignal(TooltipKnobs.STARTING_ARROW_LENGTH);
    const circlingShape = createSignal<ArrowBedShape>(TooltipKnobs.STARTING_ARROW_BED_SHAPE);

    const arrowBedArrow = createSignal<ArrowBedArrow>(TooltipKnobs.STARTING_ARROW_BED_ARROW);
    const arrowBedArrowWidth = createSignal(TooltipKnobs.STARTING_ARROW_WIDTH);
    const arrowBedArrowLength = createSignal(TooltipKnobs.STARTING_ARROW_LENGTH);
    const arrowBedShape = createSignal<ArrowBedShape>(TooltipKnobs.STARTING_ARROW_BED_SHAPE);

    const getPlacement = createMemo(() => ({ x: getHPlacement(), y: getVPlacement() }));

    const getOffset = createMemo(() => ({ x: getOffsetX(), y: getOffsetY() }));

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"reveal"} {...TooltipKnobs.REVEAL_TEXT}>
                            <PageSelectField
                                value={getReveal}
                                values={TOOLTIP_REVEALS}
                                computeLabel={(reveal) => TOOLTIP_REVEAL_LABELS[reveal]}
                                width={FIELD_WIDTH}
                                ariaLabel={"Reveal"}
                                onChange={(reveal) => setReveal(() => reveal)}
                            />
                        </PageProp>

                        <PageProp key={"arrow"} {...TooltipKnobs.ARROW_2_TEXT}>
                            <PageSelectField
                                value={getArrow}
                                values={TOOLTIP_ARROWS}
                                computeLabel={(arrow) => TOOLTIP_ARROW_LABELS[arrow]}
                                width={FIELD_WIDTH}
                                ariaLabel={"Arrow"}
                                onChange={(arrow) => setArrow(() => arrow)}
                            />
                        </PageProp>

                        <Show when={getArrow() !== "none"}>
                            <PageProp key={"arrowWidth"} {...TooltipKnobs.ARROW_WIDTH_TEXT}>
                                <PageNumberField
                                    value={getArrowWidth}
                                    min={TooltipKnobs.MIN_ARROW_SIZE}
                                    max={TooltipKnobs.MAX_ARROW_SIZE}
                                    step={TooltipKnobs.ARROW_SIZE_STEP}
                                    width={FIELD_WIDTH}
                                    ariaLabel={"Arrow width"}
                                    onInput={setArrowWidth}
                                />
                            </PageProp>

                            <PageProp key={"arrowLength"} {...TooltipKnobs.ARROW_LENGTH_TEXT}>
                                <PageNumberField
                                    value={getArrowLength}
                                    min={TooltipKnobs.MIN_ARROW_SIZE}
                                    max={TooltipKnobs.MAX_ARROW_SIZE}
                                    step={TooltipKnobs.ARROW_SIZE_STEP}
                                    width={FIELD_WIDTH}
                                    ariaLabel={"Arrow length"}
                                    onInput={setArrowLength}
                                />
                            </PageProp>
                        </Show>

                        <PageProp key={"hPlacement"} {...TooltipKnobs.H_PLACEMENT_TEXT}>
                            <PageSelectField
                                value={getHPlacement}
                                values={ANCHOR_H_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement across"}
                                onChange={(placement) => setHPlacement(() => placement)}
                            />
                        </PageProp>

                        <PageProp key={"vPlacement"} {...TooltipKnobs.V_PLACEMENT_TEXT}>
                            <PageSelectField
                                value={getVPlacement}
                                values={ANCHOR_V_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement down"}
                                onChange={(placement) => setVPlacement(() => placement)}
                            />
                        </PageProp>

                        <PageProp key={"offsetX"} {...TooltipKnobs.OFFSET_X_TEXT}>
                            <PageNumberField
                                value={getOffsetX}
                                min={TooltipKnobs.MIN_OFFSET}
                                max={TooltipKnobs.MAX_OFFSET}
                                step={TooltipKnobs.OFFSET_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Offset across"}
                                onInput={setOffsetX}
                            />
                        </PageProp>

                        <PageProp key={"offsetY"} {...TooltipKnobs.OFFSET_Y_TEXT}>
                            <PageNumberField
                                value={getOffsetY}
                                min={TooltipKnobs.MIN_OFFSET}
                                max={TooltipKnobs.MAX_OFFSET}
                                step={TooltipKnobs.OFFSET_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Offset down"}
                                onInput={setOffsetY}
                            />
                        </PageProp>

                        <PageProp key={"transitionDurationMs"} {...TooltipKnobs.TRANSITION_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={getTransitionDurationMs}
                                min={TooltipKnobs.MIN_DURATION}
                                max={TooltipKnobs.MAX_DURATION}
                                step={TooltipKnobs.DURATION_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Reveal in milliseconds"}
                                onInput={setTransitionDurationMs}
                            />
                        </PageProp>

                        <PageProp key={"focusShowDelayMs"} {...TooltipKnobs.FOCUS_SHOW_DELAY_MS_TEXT}>
                            <PageNumberField
                                value={getFocusShowDelayMs}
                                min={TooltipKnobs.MIN_DURATION}
                                max={TooltipKnobs.MAX_DURATION}
                                step={TooltipKnobs.DURATION_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Focus delay in milliseconds"}
                                onInput={setFocusShowDelayMs}
                            />
                        </PageProp>

                        <PageProp key={"hoverShowDelayMs"} {...TooltipKnobs.HOVER_SHOW_DELAY_MS_TEXT}>
                            <PageNumberField
                                value={getHoverShowDelayMs}
                                min={TooltipKnobs.MIN_DURATION}
                                max={TooltipKnobs.MAX_DURATION}
                                step={TooltipKnobs.DURATION_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Hover delay in milliseconds"}
                                onInput={setHoverShowDelayMs}
                            />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample
                    placement={getPlacement}
                    offset={getOffset}
                    transitionDurationMs={getTransitionDurationMs}
                    focusShowDelayMs={getFocusShowDelayMs}
                    hoverShowDelayMs={getHoverShowDelayMs}
                    reveal={getReveal}
                    arrow={getArrow}
                    arrowWidth={getArrowWidth}
                    arrowLength={getArrowLength}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.wordRunningText} />

            <PageDocsAlert severity={"alert"}>
                A word is not a tab stop, so this one is given tabindex="0". Without it the keyboard never reaches the
                word, and its tooltip shows to a pointer alone (<a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a>).
            </PageDocsAlert>

            <PageDocsExample path={`${DOCS_ROOT}/Word.tsx`}>
                <WordDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.moreThanLine} />

            <PageDocsExample path={`${DOCS_ROOT}/Rich.tsx`}>
                <RichDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.arrowGoingRound} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Circling.tsx`}
                renderKnobs={() => (
                    <ArrowBedKnobs
                        keyPrefix={"circling"}
                        arrow={circlingArrow}
                        arrowWidth={circlingArrowWidth}
                        arrowLength={circlingArrowLength}
                        shape={circlingShape}
                    />
                )}
            >
                <CirclingDocsExample
                    arrow={circlingArrow[0]}
                    arrowWidth={circlingArrowWidth[0]}
                    arrowLength={circlingArrowLength[0]}
                    shape={circlingShape[0]}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.everyArrowOnce} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Arrows.tsx`}
                renderKnobs={() => (
                    <ArrowBedKnobs
                        keyPrefix={"arrowBed"}
                        arrow={arrowBedArrow}
                        arrowWidth={arrowBedArrowWidth}
                        arrowLength={arrowBedArrowLength}
                        shape={arrowBedShape}
                    />
                )}
            >
                <ArrowsDocsExample
                    arrow={arrowBedArrow[0]}
                    arrowWidth={arrowBedArrowWidth[0]}
                    arrowLength={arrowBedArrowLength[0]}
                    shape={arrowBedShape[0]}
                />
            </PageDocsExample>
        </>
    );
};
