import { Show, createMemo, createSignal } from "solid-js";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-solid";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-solid";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    STARTING_CIRCLING_DEGREES,
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
import { ArrowsExample } from "./Examples/Arrows";
import { CirclingExample } from "./Examples/Circling";
import { DefaultExample } from "./Examples/Default";
import { RichExample } from "./Examples/Rich";
import { WordExample } from "./Examples/Word";
import type { TooltipExampleProps } from "./TooltipPageSolid.types";

export const TooltipPage = () => {
    const [getHPlacement, setHPlacement] = createSignal<AnchorHPlacement>(TooltipKnobs.STARTING_H_PLACEMENT);
    const [getVPlacement, setVPlacement] = createSignal<AnchorVPlacement>(TooltipKnobs.STARTING_V_PLACEMENT);
    const [getOffsetX, setOffsetX] = createSignal(TooltipKnobs.STARTING_OFFSET_X);
    const [getOffsetY, setOffsetY] = createSignal(TooltipKnobs.STARTING_OFFSET_Y);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(TOOLTIP_DEFAULTS.transitionDurationMs);
    const [getFocusShowDelayMs, setFocusShowDelayMs] = createSignal(TOOLTIP_DEFAULTS.focusShowDelayMs);
    const [getHoverShowDelayMs, setHoverShowDelayMs] = createSignal(TOOLTIP_HOVER_DELAY_MS);
    const [getSkipDelayWindowMs, setSkipDelayWindowMs] = createSignal(TOOLTIP_DEFAULTS.skipDelayWindowMs);
    const [getReveal, setReveal] = createSignal<TooltipReveal>(TooltipKnobs.STARTING_REVEAL);
    const [getArrow, setArrow] = createSignal<TooltipArrow>(TooltipKnobs.STARTING_ARROW);
    const [getArrowWidth, setArrowWidth] = createSignal(TooltipKnobs.STARTING_ARROW_WIDTH);
    const [getArrowLength, setArrowLength] = createSignal(TooltipKnobs.STARTING_ARROW_LENGTH);

    const circlingDegrees = createSignal(STARTING_CIRCLING_DEGREES);

    const getPlacement = createMemo(() => ({ x: getHPlacement(), y: getVPlacement() }));

    const getOffset = createMemo(() => ({ x: getOffsetX(), y: getOffsetY() }));

    const getExamples = createMemo(() => {
        const commonProps: TooltipExampleProps = {
            placement: getPlacement,
            offset: getOffset,
            transitionDurationMs: getTransitionDurationMs,
            focusShowDelayMs: getFocusShowDelayMs,
            hoverShowDelayMs: getHoverShowDelayMs,
            skipDelayWindowMs: getSkipDelayWindowMs,
            reveal: getReveal,
            arrow: getArrow,
            arrowWidth: getArrowWidth,
            arrowLength: getArrowLength,
        };

        return [
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
            {
                key: "circling",
                name: EXAMPLE_NAMES.circling,
                readout: () =>
                    `arrow at ${circlingDegrees[0]()}° round the tooltip — straight out from the edge it sits on, turning through the diagonal as it rounds a corner`,
                component: () => <CirclingExample degrees={circlingDegrees} />,
                path: `${EXAMPLES_ROOT}/Circling.tsx`,
            },
            {
                key: "arrows",
                name: EXAMPLE_NAMES.arrows,
                span: 2,
                readout: () =>
                    "eight tooltips round one anchor, one per side and corner, each arrow aimed by the same rule a live tooltip uses — the corner ones are where a wide arrow goes wrong",
                component: () => <ArrowsExample />,
                path: `${EXAMPLES_ROOT}/Arrows.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"reveal"}
                    label={"Reveal"}
                    hint={
                        "How the tooltip appears and goes, which is the drawing's own: the tooltip only says whether it is showing and for how long the change takes."
                    }
                    controls={"Picks how the example content drawn by TooltipProps.renderContent appears"}
                >
                    <PageSelectField
                        value={getReveal}
                        values={TOOLTIP_REVEALS}
                        computeLabel={(reveal) => TOOLTIP_REVEAL_LABELS[reveal]}
                        width={FIELD_WIDTH}
                        ariaLabel={"Reveal"}
                        onChange={(reveal) => setReveal(() => reveal)}
                    />
                </PageProp>

                <PageProp
                    key={"arrow"}
                    label={"Arrow"}
                    hint={
                        "An arrow grown out of the tooltip's body to point at its anchor. It comes out of the side facing the anchor, or out of the nearest corner when the tooltip sits off a corner, and there is none while the tooltip overlaps its anchor. The offset is what makes room for it."
                    }
                    controls={"Picks the arrow on the example content drawn by TooltipProps.renderContent"}
                >
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
                    <PageProp
                        key={"arrowWidth"}
                        label={"Arrow width (px)"}
                        hint={
                            "How wide the arrow is across its base. The lightning bolt spans this much from where its base starts to its tip."
                        }
                        controls={"Sets the arrow width on the example content drawn by TooltipProps.renderContent"}
                    >
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

                    <PageProp
                        key={"arrowLength"}
                        label={"Arrow length (px)"}
                        hint={
                            "How far the arrow's tip stands off the tooltip. Longer than the offset, and the tip reaches over the anchor."
                        }
                        controls={"Sets the arrow length on the example content drawn by TooltipProps.renderContent"}
                    >
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

                <PageProp
                    key={"hPlacement"}
                    label={"Placement across"}
                    hint={
                        "Where the tooltip sits across its anchor: inside an edge, centered, or outside it altogether."
                    }
                    controls={"Sets TooltipProps.placement.x"}
                >
                    <PageSelectField
                        value={getHPlacement}
                        values={ANCHOR_H_PLACEMENTS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Placement across"}
                        onChange={(placement) => setHPlacement(() => placement)}
                    />
                </PageProp>

                <PageProp
                    key={"vPlacement"}
                    label={"Placement down"}
                    hint={
                        "Where the tooltip sits above or below its anchor: inside an edge, centered, or outside it altogether."
                    }
                    controls={"Sets TooltipProps.placement.y"}
                >
                    <PageSelectField
                        value={getVPlacement}
                        values={ANCHOR_V_PLACEMENTS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Placement down"}
                        onChange={(placement) => setVPlacement(() => placement)}
                    />
                </PageProp>

                <PageProp
                    key={"offsetX"}
                    label={"Offset across (px)"}
                    hint={"How far the tooltip is nudged sideways from where the placement put it."}
                    controls={"Sets TooltipProps.offset.x"}
                >
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

                <PageProp
                    key={"offsetY"}
                    label={"Offset down (px)"}
                    hint={"How far the tooltip is nudged up or down from where the placement put it."}
                    controls={"Sets TooltipProps.offset.y"}
                >
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

                <PageProp
                    key={"transitionDurationMs"}
                    label={"Reveal (ms)"}
                    hint={"How long the tooltip takes to appear and to go."}
                    controls={"Sets TooltipProps.transitionDurationMs"}
                >
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

                <PageProp
                    key={"focusShowDelayMs"}
                    label={"Focus delay (ms)"}
                    hint={"How long a keyboard focus has to rest on the anchor before the tooltip appears."}
                    controls={"Sets TooltipProps.focusShowDelayMs"}
                >
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

                <PageProp
                    key={"hoverShowDelayMs"}
                    label={"Hover delay (ms)"}
                    hint={
                        "How long the pointer has to rest on the anchor before the tooltip appears. Leave before then and nothing shows."
                    }
                    controls={"Sets TooltipProps.hoverShowDelayMs"}
                >
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

                <PageProp
                    key={"skipDelayWindowMs"}
                    label={"Skip window (ms)"}
                    hint={
                        "How soon after any tooltip closes a hover opens the next one at once. Wait for one tooltip here, then move to its neighbor."
                    }
                    controls={"Sets TooltipProps.skipDelayWindowMs"}
                >
                    <PageNumberField
                        value={getSkipDelayWindowMs}
                        min={TooltipKnobs.MIN_DURATION}
                        max={TooltipKnobs.MAX_DURATION}
                        step={TooltipKnobs.DURATION_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Skip window in milliseconds"}
                        onInput={setSkipDelayWindowMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
