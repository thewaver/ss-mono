import { createMemo, createSignal } from "solid-js";

import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components";
import { FLIP_CARD_DEFAULTS } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import { PressedExample } from "./Examples/Pressed";

const AXES: FlipCardAxis[] = ["row", "column"];
const AXIS_LABELS: Record<FlipCardAxis, string> = {
    row: "About the upright axis",
    column: "About the horizontal axis",
};

const MIN_DURATION_MS = 0;
const MAX_DURATION_MS = 3000;
const DURATION_STEP_MS = 100;
const FIELD_WIDTH = 110;
const SELECT_WIDTH = 220;
const EXAMPLES_ROOT = "/src/App/Pages/FlipCardPage/Examples";

export const FlipCardPage = () => {
    const [getAxis, setAxis] = createSignal<FlipCardAxis>("row");
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(FLIP_CARD_DEFAULTS.transitionDurationMs);

    const flippedSignal = createSignal(false);
    const pressedFlippedSignal = createSignal(false);

    const [getLastTurn, setLastTurn] = createSignal<FlipCardTurnDirection>();

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "Two sides of one card",
            readout: () =>
                `${flippedSignal[0]() ? "back" : "front"} — the card is told which side to show, so the button that turns it belongs to the page rather than to the library`,
            component: () => (
                <DefaultExample
                    flippedSignal={flippedSignal}
                    axis={getAxis}
                    transitionDurationMs={getTransitionDurationMs}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
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
                        values={AXES}
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
                        min={() => MIN_DURATION_MS}
                        max={() => MAX_DURATION_MS}
                        step={() => DURATION_STEP_MS}
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
