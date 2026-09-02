import { createMemo, createSignal } from "solid-js";

import { Button } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageNumberField } from "../../StyledComponents/Field/Field";
import { CounterExample } from "./Examples/Counter";
import type { OdometerExampleProps } from "./OdometerPage.types";

import { MEASURE_BOX_PADDING } from "../../PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "./OdometerPage.css";

const EXAMPLES_ROOT = "/src/App/Pages/OdometerPage/Examples";

const STARTING_VALUE = 199;
const ZERO = 0;
const SMALL_STEP = 1;
const BIG_STEP = 137;
const MIN_VALUE = -999999;
const MAX_VALUE = 999999;
const STARTING_TURN_MS = 600;
const MIN_TURN_MS = 50;
const MAX_TURN_MS = 3000;
const TURN_STEP_MS = 50;
const STARTING_CASCADE_MS = 90;
const MIN_CASCADE_MS = 0;
const MAX_CASCADE_MS = 500;
const CASCADE_STEP_MS = 10;
const GROUP_SIZE = 3;
const FIRST = 0;
const BOX_WIDTH = 380;
const BOX_HEIGHT = 130;

const group = (value: number) => {
    const digits = String(Math.abs(value));
    const grouped = Array.from(digits)
        .map((digit, index) => ((digits.length - index) % GROUP_SIZE === 0 && index > FIRST ? `,${digit}` : digit))
        .join("");

    return value < ZERO ? `-${grouped}` : grouped;
};

export const OdometerPage = () => {
    const [getValue, setValue] = createSignal(STARTING_VALUE);
    const [getTurnMs, setTurnMs] = createSignal(STARTING_TURN_MS);
    const [getCascadeMs, setCascadeMs] = createSignal(STARTING_CASCADE_MS);

    const step = (delta: number) => setValue((value) => Math.min(Math.max(value + delta, MIN_VALUE), MAX_VALUE));

    const getExamples = createMemo(() => {
        const commonProps: OdometerExampleProps = {
            text: () => group(getValue()),
            turnDurationMs: getTurnMs,
            cascadeDelayMs: getCascadeMs,
        };

        return [
            {
                key: "counter",
                name: "Counter",
                readout: () =>
                    "every column that has to carry waits for the one to its right, a column going nine to zero keeps turning forward rather than rewinding, and crossing zero turns the whole number back the other way",
                component: () => (
                    <div class={styles.stack}>
                        <PageMeasureBox
                            width={() => BOX_WIDTH}
                            height={() => BOX_HEIGHT}
                            padding={() => MEASURE_BOX_PADDING}
                        >
                            <CounterExample {...commonProps} />
                        </PageMeasureBox>

                        <div class={styles.controls}>
                            <Button
                                id={"stepDown"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>{`take ${SMALL_STEP}`}</PageButtonContent>
                                )}
                                onClick={() => {
                                    step(-SMALL_STEP);
                                }}
                            />

                            <Button
                                id={"stepUp"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>{`add ${SMALL_STEP}`}</PageButtonContent>
                                )}
                                onClick={() => {
                                    step(SMALL_STEP);
                                }}
                            />

                            <Button
                                id={"jumpUp"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>{`add ${BIG_STEP}`}</PageButtonContent>
                                )}
                                onClick={() => {
                                    step(BIG_STEP);
                                }}
                            />
                        </div>
                    </div>
                ),
                path: `${EXAMPLES_ROOT}/Counter.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"value"} label={"Value"}>
                    <PageNumberField
                        value={getValue}
                        min={() => MIN_VALUE}
                        max={() => MAX_VALUE}
                        step={() => SMALL_STEP}
                        ariaLabel={"Value"}
                        onInput={setValue}
                    />
                </PageProp>

                <PageProp key={"turnDurationMs"} label={"Turn (ms)"}>
                    <PageNumberField
                        value={getTurnMs}
                        min={() => MIN_TURN_MS}
                        max={() => MAX_TURN_MS}
                        step={() => TURN_STEP_MS}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTurnMs}
                    />
                </PageProp>

                <PageProp key={"cascadeDelayMs"} label={"Cascade (ms)"}>
                    <PageNumberField
                        value={getCascadeMs}
                        min={() => MIN_CASCADE_MS}
                        max={() => MAX_CASCADE_MS}
                        step={() => CASCADE_STEP_MS}
                        ariaLabel={"Cascade delay in milliseconds"}
                        onInput={setCascadeMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
