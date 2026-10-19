import { useMemo, useState } from "react";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-react";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-react";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
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

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DefaultExample } from "./Examples/Default";
import { RichExample } from "./Examples/Rich";
import { WordExample } from "./Examples/Word";
import type { TooltipExampleProps } from "./TooltipPageReact.types";

export const TooltipPage = () => {
    const [hPlacement, setHPlacement] = useState<AnchorHPlacement>(TooltipKnobs.STARTING_H_PLACEMENT);
    const [vPlacement, setVPlacement] = useState<AnchorVPlacement>(TooltipKnobs.STARTING_V_PLACEMENT);
    const [offsetX, setOffsetX] = useState(TooltipKnobs.STARTING_OFFSET_X);
    const [offsetY, setOffsetY] = useState(TooltipKnobs.STARTING_OFFSET_Y);
    const [transitionDurationMs, setTransitionDurationMs] = useState(TOOLTIP_DEFAULTS.transitionDurationMs);
    const [focusShowDelayMs, setFocusShowDelayMs] = useState(TOOLTIP_DEFAULTS.focusShowDelayMs);
    const [hoverShowDelayMs, setHoverShowDelayMs] = useState(TOOLTIP_HOVER_DELAY_MS);
    const [skipDelayWindowMs, setSkipDelayWindowMs] = useState(TOOLTIP_DEFAULTS.skipDelayWindowMs);
    const [reveal, setReveal] = useState<TooltipReveal>(TooltipKnobs.STARTING_REVEAL);
    const [arrow, setArrow] = useState<TooltipArrow>(TooltipKnobs.STARTING_ARROW);
    const [arrowWidth, setArrowWidth] = useState(TooltipKnobs.STARTING_ARROW_WIDTH);
    const [arrowLength, setArrowLength] = useState(TooltipKnobs.STARTING_ARROW_LENGTH);

    const placement = useMemo(() => ({ x: hPlacement, y: vPlacement }), [hPlacement, vPlacement]);

    const offset = useMemo(() => ({ x: offsetX, y: offsetY }), [offsetX, offsetY]);

    const commonProps: TooltipExampleProps = {
        placement,
        offset,
        transitionDurationMs,
        focusShowDelayMs,
        hoverShowDelayMs,
        skipDelayWindowMs,
        reveal,
        arrow,
        arrowWidth,
        arrowLength,
    };

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                "the button is a plain one, not the library's — the tooltip is handed its element and wires the hover, the focus and the Escape itself",
            component: () => <DefaultExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "word",
            name: EXAMPLE_NAMES.word,
            readout: () =>
                "any element with a ref can carry one; this word was given a tab stop of its own, without which the tooltip would be reachable by pointer alone",
            component: () => <WordExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Word.tsx`,
        },
        {
            key: "rich",
            name: EXAMPLE_NAMES.rich,
            readout: () => "the content is whatever you render, and the anchoring is unchanged by how tall it is",
            component: () => <RichExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Rich.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
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
                        computeLabel={(option) => TOOLTIP_REVEAL_LABELS[option]}
                        width={FIELD_WIDTH}
                        ariaLabel={"Reveal"}
                        onChange={(option) => setReveal(option)}
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
                        computeLabel={(option) => TOOLTIP_ARROW_LABELS[option]}
                        width={FIELD_WIDTH}
                        ariaLabel={"Arrow"}
                        onChange={(option) => setArrow(option)}
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
                            controls={"Sets the arrow width on the example content drawn by TooltipProps.renderContent"}
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

                <PageProp
                    itemKey={"skipDelayWindowMs"}
                    label={"Skip window (ms)"}
                    hint={
                        "How soon after any tooltip closes a hover opens the next one at once. Wait for one tooltip here, then move to its neighbor."
                    }
                    controls={"Sets TooltipProps.skipDelayWindowMs"}
                >
                    <PageNumberField
                        value={skipDelayWindowMs}
                        min={TooltipKnobs.MIN_DURATION}
                        max={TooltipKnobs.MAX_DURATION}
                        step={TooltipKnobs.DURATION_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Skip window in milliseconds"}
                        onInput={setSkipDelayWindowMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
