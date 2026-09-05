import { createMemo, createSignal } from "solid-js";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import { RichExample } from "./Examples/Rich";
import { WordExample } from "./Examples/Word";
import type { TooltipExampleProps } from "./TooltipPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TooltipPage/Examples";

const H_PLACEMENTS: AnchorHPlacement[] = ["left-out", "left-in", "center", "right-in", "right-out"];
const V_PLACEMENTS: AnchorVPlacement[] = ["top-out", "top-in", "center", "bottom-in", "bottom-out"];

const MIN_OFFSET = -40;
const MAX_OFFSET = 40;
const OFFSET_STEP = 5;
const MIN_DURATION = 0;
const MAX_DURATION = 1000;
const DURATION_STEP = 50;
const FIELD_WIDTH = 110;

const STARTING_H_PLACEMENT: AnchorHPlacement = "center";
const STARTING_V_PLACEMENT: AnchorVPlacement = "top-out";
const STARTING_OFFSET_Y = 5;
const STARTING_TRANSITION_DURATION_MS = 200;
const STARTING_FOCUS_SHOW_DELAY_MS = 500;

export const TooltipPage = () => {
    const [getHPlacement, setHPlacement] = createSignal<AnchorHPlacement>(STARTING_H_PLACEMENT);
    const [getVPlacement, setVPlacement] = createSignal<AnchorVPlacement>(STARTING_V_PLACEMENT);
    const [getOffsetX, setOffsetX] = createSignal(0);
    const [getOffsetY, setOffsetY] = createSignal(STARTING_OFFSET_Y);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(STARTING_TRANSITION_DURATION_MS);
    const [getFocusShowDelayMs, setFocusShowDelayMs] = createSignal(STARTING_FOCUS_SHOW_DELAY_MS);

    const getPlacement = createMemo(() => ({ x: getHPlacement(), y: getVPlacement() }));

    const getOffset = createMemo(() => ({ x: getOffsetX(), y: getOffsetY() }));

    const getExamples = createMemo(() => {
        const commonProps: TooltipExampleProps = {
            placement: getPlacement,
            offset: getOffset,
            transitionDurationMs: getTransitionDurationMs,
            focusShowDelayMs: getFocusShowDelayMs,
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
                <PageProp key={"hPlacement"} label={"Placement across"}>
                    <PageSelectField
                        value={getHPlacement}
                        values={() => H_PLACEMENTS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Placement across"}
                        onChange={(placement) => setHPlacement(() => placement)}
                    />
                </PageProp>

                <PageProp key={"vPlacement"} label={"Placement down"}>
                    <PageSelectField
                        value={getVPlacement}
                        values={() => V_PLACEMENTS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Placement down"}
                        onChange={(placement) => setVPlacement(() => placement)}
                    />
                </PageProp>

                <PageProp key={"offsetX"} label={"Offset across (px)"}>
                    <PageNumberField
                        value={getOffsetX}
                        min={() => MIN_OFFSET}
                        max={() => MAX_OFFSET}
                        step={() => OFFSET_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Offset across"}
                        onInput={setOffsetX}
                    />
                </PageProp>

                <PageProp key={"offsetY"} label={"Offset down (px)"}>
                    <PageNumberField
                        value={getOffsetY}
                        min={() => MIN_OFFSET}
                        max={() => MAX_OFFSET}
                        step={() => OFFSET_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Offset down"}
                        onInput={setOffsetY}
                    />
                </PageProp>

                <PageProp key={"transitionDurationMs"} label={"Fade (ms)"}>
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={() => MIN_DURATION}
                        max={() => MAX_DURATION}
                        step={() => DURATION_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Fade in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>

                <PageProp key={"focusShowDelayMs"} label={"Focus delay (ms)"}>
                    <PageNumberField
                        value={getFocusShowDelayMs}
                        min={() => MIN_DURATION}
                        max={() => MAX_DURATION}
                        step={() => DURATION_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Focus delay in milliseconds"}
                        onInput={setFocusShowDelayMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
