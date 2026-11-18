import { useMemo, useState } from "react";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-react";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-react";
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
    const [reveal, setReveal] = useState<TooltipReveal>(TooltipKnobs.STARTING_REVEAL);
    const [arrow, setArrow] = useState<TooltipArrow>(TooltipKnobs.STARTING_ARROW);
    const [arrowWidth, setArrowWidth] = useState(TooltipKnobs.STARTING_ARROW_WIDTH);
    const [arrowLength, setArrowLength] = useState(TooltipKnobs.STARTING_ARROW_LENGTH);
    const [hPlacement, setHPlacement] = useState<AnchorHPlacement>(TooltipKnobs.STARTING_H_PLACEMENT);
    const [vPlacement, setVPlacement] = useState<AnchorVPlacement>(TooltipKnobs.STARTING_V_PLACEMENT);
    const [offsetX, setOffsetX] = useState(TooltipKnobs.STARTING_OFFSET_X);
    const [offsetY, setOffsetY] = useState(TooltipKnobs.STARTING_OFFSET_Y);
    const [transitionDurationMs, setTransitionDurationMs] = useState(TOOLTIP_DEFAULTS.transitionDurationMs);
    const [focusShowDelayMs, setFocusShowDelayMs] = useState(TOOLTIP_DEFAULTS.focusShowDelayMs);
    const [hoverShowDelayMs, setHoverShowDelayMs] = useState(TOOLTIP_HOVER_DELAY_MS);

    const circlingArrow = useState<ArrowBedArrow>(TooltipKnobs.STARTING_ARROW_BED_ARROW);
    const circlingArrowWidth = useState(TooltipKnobs.STARTING_ARROW_WIDTH);
    const circlingArrowLength = useState(TooltipKnobs.STARTING_ARROW_LENGTH);
    const circlingShape = useState<ArrowBedShape>(TooltipKnobs.STARTING_ARROW_BED_SHAPE);

    const arrowBedArrow = useState<ArrowBedArrow>(TooltipKnobs.STARTING_ARROW_BED_ARROW);
    const arrowBedArrowWidth = useState(TooltipKnobs.STARTING_ARROW_WIDTH);
    const arrowBedArrowLength = useState(TooltipKnobs.STARTING_ARROW_LENGTH);
    const arrowBedShape = useState<ArrowBedShape>(TooltipKnobs.STARTING_ARROW_BED_SHAPE);

    const placement = useMemo(() => ({ x: hPlacement, y: vPlacement }), [hPlacement, vPlacement]);

    const offset = useMemo(() => ({ x: offsetX, y: offsetY }), [offsetX, offsetY]);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"reveal"} {...TooltipKnobs.REVEAL_TEXT}>
                            <PageSelectField
                                value={reveal}
                                values={TOOLTIP_REVEALS}
                                computeLabel={(reveal) => TOOLTIP_REVEAL_LABELS[reveal]}
                                width={FIELD_WIDTH}
                                ariaLabel={"Reveal"}
                                onChange={(reveal) => setReveal(reveal)}
                            />
                        </PageProp>

                        <PageProp itemKey={"arrow"} {...TooltipKnobs.ARROW_2_TEXT}>
                            <PageSelectField
                                value={arrow}
                                values={TOOLTIP_ARROWS}
                                computeLabel={(arrow) => TOOLTIP_ARROW_LABELS[arrow]}
                                width={FIELD_WIDTH}
                                ariaLabel={"Arrow"}
                                onChange={(arrow) => setArrow(arrow)}
                            />
                        </PageProp>

                        {arrow !== "none" && (
                            <>
                                <PageProp itemKey={"arrowWidth"} {...TooltipKnobs.ARROW_WIDTH_TEXT}>
                                    <PageNumberField
                                        value={arrowWidth}
                                        min={TooltipKnobs.MIN_ARROW_SIZE}
                                        max={TooltipKnobs.MAX_ARROW_SIZE}
                                        step={TooltipKnobs.ARROW_SIZE_STEP}
                                        width={FIELD_WIDTH}
                                        ariaLabel={"Arrow width"}
                                        onInput={setArrowWidth}
                                    />
                                </PageProp>

                                <PageProp itemKey={"arrowLength"} {...TooltipKnobs.ARROW_LENGTH_TEXT}>
                                    <PageNumberField
                                        value={arrowLength}
                                        min={TooltipKnobs.MIN_ARROW_SIZE}
                                        max={TooltipKnobs.MAX_ARROW_SIZE}
                                        step={TooltipKnobs.ARROW_SIZE_STEP}
                                        width={FIELD_WIDTH}
                                        ariaLabel={"Arrow length"}
                                        onInput={setArrowLength}
                                    />
                                </PageProp>
                            </>
                        )}

                        <PageProp itemKey={"hPlacement"} {...TooltipKnobs.H_PLACEMENT_TEXT}>
                            <PageSelectField
                                value={hPlacement}
                                values={ANCHOR_H_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement across"}
                                onChange={(placement) => setHPlacement(placement)}
                            />
                        </PageProp>

                        <PageProp itemKey={"vPlacement"} {...TooltipKnobs.V_PLACEMENT_TEXT}>
                            <PageSelectField
                                value={vPlacement}
                                values={ANCHOR_V_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement down"}
                                onChange={(placement) => setVPlacement(placement)}
                            />
                        </PageProp>

                        <PageProp itemKey={"offsetX"} {...TooltipKnobs.OFFSET_X_TEXT}>
                            <PageNumberField
                                value={offsetX}
                                min={TooltipKnobs.MIN_OFFSET}
                                max={TooltipKnobs.MAX_OFFSET}
                                step={TooltipKnobs.OFFSET_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Offset across"}
                                onInput={setOffsetX}
                            />
                        </PageProp>

                        <PageProp itemKey={"offsetY"} {...TooltipKnobs.OFFSET_Y_TEXT}>
                            <PageNumberField
                                value={offsetY}
                                min={TooltipKnobs.MIN_OFFSET}
                                max={TooltipKnobs.MAX_OFFSET}
                                step={TooltipKnobs.OFFSET_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Offset down"}
                                onInput={setOffsetY}
                            />
                        </PageProp>

                        <PageProp itemKey={"transitionDurationMs"} {...TooltipKnobs.TRANSITION_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={transitionDurationMs}
                                min={TooltipKnobs.MIN_DURATION}
                                max={TooltipKnobs.MAX_DURATION}
                                step={TooltipKnobs.DURATION_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Reveal in milliseconds"}
                                onInput={setTransitionDurationMs}
                            />
                        </PageProp>

                        <PageProp itemKey={"focusShowDelayMs"} {...TooltipKnobs.FOCUS_SHOW_DELAY_MS_TEXT}>
                            <PageNumberField
                                value={focusShowDelayMs}
                                min={TooltipKnobs.MIN_DURATION}
                                max={TooltipKnobs.MAX_DURATION}
                                step={TooltipKnobs.DURATION_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Focus delay in milliseconds"}
                                onInput={setFocusShowDelayMs}
                            />
                        </PageProp>

                        <PageProp itemKey={"hoverShowDelayMs"} {...TooltipKnobs.HOVER_SHOW_DELAY_MS_TEXT}>
                            <PageNumberField
                                value={hoverShowDelayMs}
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
                    placement={placement}
                    offset={offset}
                    transitionDurationMs={transitionDurationMs}
                    focusShowDelayMs={focusShowDelayMs}
                    hoverShowDelayMs={hoverShowDelayMs}
                    reveal={reveal}
                    arrow={arrow}
                    arrowWidth={arrowWidth}
                    arrowLength={arrowLength}
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
