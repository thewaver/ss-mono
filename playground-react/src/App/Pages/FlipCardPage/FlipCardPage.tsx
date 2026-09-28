import { useState } from "react";

import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-react";
import { FLIP_CARD_AXES, FLIP_CARD_DEFAULTS } from "@thewaver/ss-components-react";
import { FlipCardKnobs } from "@thewaver/ss-playground/App/Knobs/FlipCards.const";

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
    const [axis, setAxis] = useState<FlipCardAxis>(FLIP_CARD_DEFAULTS.axis);
    const [transitionDurationMs, setTransitionDurationMs] = useState(FLIP_CARD_DEFAULTS.transitionDurationMs);

    const pressedFlippedState = useState(false);

    const [lastTurn, setLastTurn] = useState<FlipCardTurnDirection>();

    const examples = [
        {
            key: "pressed",
            name: "Turned toward the edge pressed",
            readout: () => {
                const side = pressedFlippedState[0] ? "back" : "front";

                if (!lastTurn)
                    return `${side} — press an edge to turn the card that way, or slide to lean it without turning`;

                return `${side} — the last turn went ${lastTurn}, and the next lean follows it`;
            },
            component: () => (
                <PressedExample
                    flippedState={pressedFlippedState}
                    axis={axis}
                    transitionDurationMs={transitionDurationMs}
                    onTurn={setLastTurn}
                />
            ),
            path: `${EXAMPLES_ROOT}/Pressed.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"axis"}
                    label={"Axis"}
                    hint={"Which way the card turns over to show its other side."}
                >
                    <PageSelectField
                        value={axis}
                        values={FLIP_CARD_AXES}
                        computeLabel={(axis) => AXIS_LABELS[axis]}
                        width={SELECT_WIDTH}
                        ariaLabel={"Axis"}
                        onChange={setAxis}
                    />
                </PageProp>

                <PageProp
                    itemKey={"transitionDurationMs"}
                    label={"Turn duration (ms)"}
                    hint={"How long one turn from face to face takes."}
                >
                    <PageNumberField
                        value={transitionDurationMs}
                        min={FlipCardKnobs.MIN_DURATION_MS}
                        max={FlipCardKnobs.MAX_DURATION_MS}
                        step={FlipCardKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
