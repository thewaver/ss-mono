import { createMemo, createSignal } from "solid-js";

import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components";
import { FLIP_CARD_AXES, FLIP_CARD_DEFAULTS } from "@thewaver/ss-components";

import { FlipCardKnobs } from "../../Knobs/FlipCards.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PressedExample } from "./Examples/Pressed";

const AXIS_LABELS: Record<FlipCardAxis, string> = {
    row: "About the upright axis",
    column: "About the horizontal axis",
};

const FIELD_WIDTH = 110;
const SELECT_WIDTH = 220;
const EXAMPLES_ROOT = "/src/App/Pages/FlipCardPage/Examples";

export const FlipCardPage = () => {
    const [getAxis, setAxis] = createSignal<FlipCardAxis>(FLIP_CARD_DEFAULTS.axis);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(FLIP_CARD_DEFAULTS.transitionDurationMs);

    const pressedFlippedSignal = createSignal(false);

    const [getLastTurn, setLastTurn] = createSignal<FlipCardTurnDirection>();

    const getExamples = createMemo(() => [
        {
            key: "pressed",
            name: "Turned toward the edge pressed",
            readout: () => {
                const side = pressedFlippedSignal[0]() ? "back" : "front";
                const lastTurn = getLastTurn();

                if (!lastTurn)
                    return `${side} — press an edge to turn the card that way, or slide to lean it without turning`;

                return `${side} — the last turn went ${lastTurn}, and the next lean follows it`;
            },
            component: () => (
                <PressedExample
                    flippedSignal={pressedFlippedSignal}
                    axis={getAxis}
                    transitionDurationMs={getTransitionDurationMs}
                    onTurn={setLastTurn}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pressed.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"axis"} label={"Axis"} hint={"Which way the card turns over to show its other side."}>
                    <PageSelectField
                        value={getAxis}
                        values={FLIP_CARD_AXES}
                        computeLabel={(axis) => AXIS_LABELS[axis]}
                        width={() => SELECT_WIDTH}
                        ariaLabel={"Axis"}
                        onChange={setAxis}
                    />
                </PageProp>

                <PageProp
                    key={"transitionDurationMs"}
                    label={"Turn duration (ms)"}
                    hint={"How long one turn from face to face takes."}
                >
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={() => FlipCardKnobs.MIN_DURATION_MS}
                        max={() => FlipCardKnobs.MAX_DURATION_MS}
                        step={() => FlipCardKnobs.DURATION_STEP_MS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
