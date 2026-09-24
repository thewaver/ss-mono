import { createMemo, createSignal } from "solid-js";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components";

import { TooltipKnobs } from "../../Knobs/Tooltips.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import { RichExample } from "./Examples/Rich";
import { WordExample } from "./Examples/Word";
import type { TooltipExampleProps } from "./TooltipPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TooltipPage/Examples";

const FIELD_WIDTH = 110;

export const TooltipPage = () => {
    const [getHPlacement, setHPlacement] = createSignal<AnchorHPlacement>(TooltipKnobs.STARTING_H_PLACEMENT);
    const [getVPlacement, setVPlacement] = createSignal<AnchorVPlacement>(TooltipKnobs.STARTING_V_PLACEMENT);
    const [getOffsetX, setOffsetX] = createSignal(TooltipKnobs.STARTING_OFFSET_X);
    const [getOffsetY, setOffsetY] = createSignal(TooltipKnobs.STARTING_OFFSET_Y);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(TOOLTIP_DEFAULTS.transitionDurationMs);
    const [getFocusShowDelayMs, setFocusShowDelayMs] = createSignal(TOOLTIP_DEFAULTS.focusShowDelayMs);
    const [getHoverShowDelayMs, setHoverShowDelayMs] = createSignal(TOOLTIP_DEFAULTS.hoverShowDelayMs);
    const [getSkipDelayWindowMs, setSkipDelayWindowMs] = createSignal(TOOLTIP_DEFAULTS.skipDelayWindowMs);

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
        };

        return [
            {
                key: "default",
                name: "On a control of your own",
                readout: () =>
                    "the button is a plain one, not the library's — the tooltip is handed its element and wires the hover, the focus and the Escape itself",
                component: () => <DefaultExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
            {
                key: "word",
                name: "On something that is not a control",
                readout: () =>
                    "any element with a ref can carry one; this word was given a tab stop of its own, without which the tooltip would be reachable by pointer alone",
                component: () => <WordExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Word.tsx`,
            },
            {
                key: "rich",
                name: "More than a line",
                readout: () => "the content is whatever you render, and the anchoring is unchanged by how tall it is",
                component: () => <RichExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Rich.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"hPlacement"}
                    label={"Placement across"}
                    hint={
                        "Where the tooltip sits across its anchor: inside an edge, centered, or outside it altogether."
                    }
                >
                    <PageSelectField
                        value={getHPlacement}
                        values={() => ANCHOR_H_PLACEMENTS}
                        width={() => FIELD_WIDTH}
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
                >
                    <PageSelectField
                        value={getVPlacement}
                        values={() => ANCHOR_V_PLACEMENTS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Placement down"}
                        onChange={(placement) => setVPlacement(() => placement)}
                    />
                </PageProp>

                <PageProp
                    key={"offsetX"}
                    label={"Offset across (px)"}
                    hint={"How far the tooltip is nudged sideways from where the placement put it."}
                >
                    <PageNumberField
                        value={getOffsetX}
                        min={() => TooltipKnobs.MIN_OFFSET}
                        max={() => TooltipKnobs.MAX_OFFSET}
                        step={() => TooltipKnobs.OFFSET_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Offset across"}
                        onInput={setOffsetX}
                    />
                </PageProp>

                <PageProp
                    key={"offsetY"}
                    label={"Offset down (px)"}
                    hint={"How far the tooltip is nudged up or down from where the placement put it."}
                >
                    <PageNumberField
                        value={getOffsetY}
                        min={() => TooltipKnobs.MIN_OFFSET}
                        max={() => TooltipKnobs.MAX_OFFSET}
                        step={() => TooltipKnobs.OFFSET_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Offset down"}
                        onInput={setOffsetY}
                    />
                </PageProp>

                <PageProp
                    key={"transitionDurationMs"}
                    label={"Fade (ms)"}
                    hint={"How long the tooltip takes to fade in and out."}
                >
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={() => TooltipKnobs.MIN_DURATION}
                        max={() => TooltipKnobs.MAX_DURATION}
                        step={() => TooltipKnobs.DURATION_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Fade in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"focusShowDelayMs"}
                    label={"Focus delay (ms)"}
                    hint={"How long a keyboard focus has to rest on the anchor before the tooltip appears."}
                >
                    <PageNumberField
                        value={getFocusShowDelayMs}
                        min={() => TooltipKnobs.MIN_DURATION}
                        max={() => TooltipKnobs.MAX_DURATION}
                        step={() => TooltipKnobs.DURATION_STEP}
                        width={() => FIELD_WIDTH}
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
                >
                    <PageNumberField
                        value={getHoverShowDelayMs}
                        min={() => TooltipKnobs.MIN_DURATION}
                        max={() => TooltipKnobs.MAX_DURATION}
                        step={() => TooltipKnobs.DURATION_STEP}
                        width={() => FIELD_WIDTH}
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
                >
                    <PageNumberField
                        value={getSkipDelayWindowMs}
                        min={() => TooltipKnobs.MIN_DURATION}
                        max={() => TooltipKnobs.MAX_DURATION}
                        step={() => TooltipKnobs.DURATION_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Skip window in milliseconds"}
                        onInput={setSkipDelayWindowMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
