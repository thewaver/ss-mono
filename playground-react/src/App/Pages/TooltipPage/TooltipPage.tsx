import { useMemo, useState } from "react";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-react";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-react";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DefaultExample } from "./Examples/Default";
import { RichExample } from "./Examples/Rich";
import { WordExample } from "./Examples/Word";
import type { TooltipExampleProps } from "./TooltipPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TooltipPage/Examples";

const FIELD_WIDTH = 110;

export const TooltipPage = () => {
    const [hPlacement, setHPlacement] = useState<AnchorHPlacement>(TooltipKnobs.STARTING_H_PLACEMENT);
    const [vPlacement, setVPlacement] = useState<AnchorVPlacement>(TooltipKnobs.STARTING_V_PLACEMENT);
    const [offsetX, setOffsetX] = useState(TooltipKnobs.STARTING_OFFSET_X);
    const [offsetY, setOffsetY] = useState(TooltipKnobs.STARTING_OFFSET_Y);
    const [transitionDurationMs, setTransitionDurationMs] = useState(TOOLTIP_DEFAULTS.transitionDurationMs);
    const [focusShowDelayMs, setFocusShowDelayMs] = useState(TOOLTIP_DEFAULTS.focusShowDelayMs);
    const [hoverShowDelayMs, setHoverShowDelayMs] = useState(TOOLTIP_DEFAULTS.hoverShowDelayMs);
    const [skipDelayWindowMs, setSkipDelayWindowMs] = useState(TOOLTIP_DEFAULTS.skipDelayWindowMs);

    const placement = useMemo(() => ({ x: hPlacement, y: vPlacement }), [hPlacement, vPlacement]);

    const offset = useMemo(() => ({ x: offsetX, y: offsetY }), [offsetX, offsetY]);

    const commonProps: TooltipExampleProps = {
        placement,
        offset,
        transitionDurationMs,
        focusShowDelayMs,
        hoverShowDelayMs,
        skipDelayWindowMs,
    };

    const examples = [
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

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"hPlacement"}
                    label={"Placement across"}
                    hint={
                        "Where the tooltip sits across its anchor: inside an edge, centered, or outside it altogether."
                    }
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
                    label={"Fade (ms)"}
                    hint={"How long the tooltip takes to fade in and out."}
                >
                    <PageNumberField
                        value={transitionDurationMs}
                        min={TooltipKnobs.MIN_DURATION}
                        max={TooltipKnobs.MAX_DURATION}
                        step={TooltipKnobs.DURATION_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Fade in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"focusShowDelayMs"}
                    label={"Focus delay (ms)"}
                    hint={"How long a keyboard focus has to rest on the anchor before the tooltip appears."}
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
