import { createMemo, createSignal } from "solid-js";

import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-solid";
import { FLIP_CARD_AXES, FLIP_CARD_DEFAULTS } from "@thewaver/ss-components-solid";
import { FlipCardKnobs } from "@thewaver/ss-playground/App/Knobs/FlipCards.const";
import {
    AXIS_LABELS,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    SELECT_WIDTH,
} from "@thewaver/ss-playground/App/Pages/FlipCardPage/FlipCardPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PressedExample } from "./Examples/Pressed";

export const FlipCardPage = () => {
    const [getAxis, setAxis] = createSignal<FlipCardAxis>(FLIP_CARD_DEFAULTS.axis);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(FLIP_CARD_DEFAULTS.transitionDurationMs);

    const pressedFlippedSignal = createSignal(false);

    const [getLastTurn, setLastTurn] = createSignal<FlipCardTurnDirection>();

    const getExamples = createMemo(() => [
        {
            key: "pressed",
            name: EXAMPLE_NAMES.pressed,
            readout: () => {
                const side = pressedFlippedSignal[0]() ? "back" : "front";
                const lastTurn = getLastTurn();

                if (!lastTurn)
                    return `${side} — press an edge to turn the card that way, or slide to lean it without turning`;

                return `${side} — the last turn went ${lastTurn}, and the next lean follows it`;
            },
            component: () => (
                <PressedExample
                    flipped={pressedFlippedSignal}
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
                        width={SELECT_WIDTH}
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
                        min={FlipCardKnobs.MIN_DURATION_MS}
                        max={FlipCardKnobs.MAX_DURATION_MS}
                        step={FlipCardKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
