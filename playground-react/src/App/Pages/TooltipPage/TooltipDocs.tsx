import { useMemo, useState } from "react";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-react";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-react";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import {
    type ArrowBedArrow,
    type ArrowBedShape,
    DOCS_ROOT,
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
                        <PageProp
                            itemKey={"reveal"}
                            label={"Reveal"}
                            hint={
                                "How the tooltip appears and goes, which is the drawing's own: the tooltip only says whether it is showing and for how long the change takes."
                            }
                            controls={"Picks how the example content drawn by TooltipProps.renderContent appears"}
                        >
                            <PageSelectField
                                value={reveal}
                                values={TOOLTIP_REVEALS}
                                computeLabel={(reveal) => TOOLTIP_REVEAL_LABELS[reveal]}
                                width={FIELD_WIDTH}
                                ariaLabel={"Reveal"}
                                onChange={(reveal) => setReveal(reveal)}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"arrow"}
                            label={"Arrow"}
                            hint={
                                "An arrow grown out of the tooltip's body to point at its anchor. It comes out of the side facing the anchor, or out of the nearest corner when the tooltip sits off a corner, and there is none while the tooltip overlaps its anchor. The offset is what makes room for it."
                            }
                            controls={"Picks the arrow on the example content drawn by TooltipProps.renderContent"}
                        >
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
                                <PageProp
                                    itemKey={"arrowWidth"}
                                    label={"Arrow width (px)"}
                                    hint={
                                        "How wide the arrow is across its base. The lightning bolt spans this much from where its base starts to its tip."
                                    }
                                    controls={
                                        "Sets the arrow width on the example content drawn by TooltipProps.renderContent"
                                    }
                                >
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

                                <PageProp
                                    itemKey={"arrowLength"}
                                    label={"Arrow length (px)"}
                                    hint={
                                        "How far the arrow's tip stands off the tooltip. Longer than the offset, and the tip reaches over the anchor."
                                    }
                                    controls={
                                        "Sets the arrow length on the example content drawn by TooltipProps.renderContent"
                                    }
                                >
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

                        <PageProp
                            itemKey={"hPlacement"}
                            label={"Placement across"}
                            hint={
                                "Where the tooltip sits across its anchor: inside an edge, centered, or outside it altogether."
                            }
                            controls={"Sets TooltipProps.placement.x"}
                        >
                            <PageSelectField
                                value={hPlacement}
                                values={ANCHOR_H_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement across"}
                                onChange={(placement) => setHPlacement(placement)}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"vPlacement"}
                            label={"Placement down"}
                            hint={
                                "Where the tooltip sits above or below its anchor: inside an edge, centered, or outside it altogether."
                            }
                            controls={"Sets TooltipProps.placement.y"}
                        >
                            <PageSelectField
                                value={vPlacement}
                                values={ANCHOR_V_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement down"}
                                onChange={(placement) => setVPlacement(placement)}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"offsetX"}
                            label={"Offset across (px)"}
                            hint={"How far the tooltip is nudged sideways from where the placement put it."}
                            controls={"Sets TooltipProps.offset.x"}
                        >
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

                        <PageProp
                            itemKey={"offsetY"}
                            label={"Offset down (px)"}
                            hint={"How far the tooltip is nudged up or down from where the placement put it."}
                            controls={"Sets TooltipProps.offset.y"}
                        >
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

                        <PageProp
                            itemKey={"transitionDurationMs"}
                            label={"Reveal (ms)"}
                            hint={"How long the tooltip takes to appear and to go."}
                            controls={"Sets TooltipProps.transitionDurationMs"}
                        >
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

                        <PageProp
                            itemKey={"focusShowDelayMs"}
                            label={"Focus delay (ms)"}
                            hint={"How long a keyboard focus has to rest on the anchor before the tooltip appears."}
                            controls={"Sets TooltipProps.focusShowDelayMs"}
                        >
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

                        <PageProp
                            itemKey={"hoverShowDelayMs"}
                            label={"Hover delay (ms)"}
                            hint={
                                "How long the pointer has to rest on the anchor before the tooltip appears. Leave before then and nothing shows."
                            }
                            controls={"Sets TooltipProps.hoverShowDelayMs"}
                        >
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

            <PageDocsSection
                title={"On a word in running text"}
                content={
                    "The tooltip is handed the element it describes through [prop]anchorRef[/prop] rather than wrapping it, so anything with a ref can carry one, here a word in the middle of a sentence."
                }
            />

            <PageDocsAlert severity={"alert"}>
                A word is not a tab stop, so this one is given tabindex="0". Without it the keyboard never reaches the
                word, and its tooltip shows to a pointer alone (<a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a>).
            </PageDocsAlert>

            <PageDocsExample path={`${DOCS_ROOT}/Word.tsx`}>
                <WordDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"More than a line"}
                content={
                    "What the tooltip shows is whatever [prop]renderContent[/prop] draws, here a title over a paragraph, and it sits where its [prop]placement[/prop] puts it however tall that makes it. It is still read out as the anchor's description, in one run, so nothing in it can be pressed; a link or a button belongs in a HoverCard."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Rich.tsx`}>
                <RichDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the tooltip takes the box's direction although it is drawn outside it, so its lines read from the right. Its [prop]placement[/prop] is used as it stands: one asked to sit on the left still sits on the left."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"An arrow going round"}
                content={
                    "An arrow is the drawing's too: [prop]renderContent[/prop] is handed where one should point, and ShapeUtils.attachArrow grows it out of any contour. Move the slider to aim it all the way round: it leaves straight out of the edge it faces, and turns through the diagonal as it rounds a corner."
                }
            />

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

            <PageDocsSection
                title={"Every arrow at once"}
                content={
                    "Eight tooltips round one anchor, one on each side and at each corner, every arrow aimed by the rule a live tooltip's is aimed by, AnchorUtils.computeArrowAim. The corners are where a wide arrow goes wrong: past twice its length, its sides lean 45° or more."
                }
            />

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
