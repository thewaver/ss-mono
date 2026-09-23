import { createMemo, createSignal } from "solid-js";

import { Button, ODOMETER_DEFAULTS, OdometerReels } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { CounterExample } from "./Examples/Counter";
import { ReelsExample } from "./Examples/Reels";
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
const MIN_TURN_MS = 50;
const MAX_TURN_MS = 3000;
const TURN_STEP_MS = 50;
const MIN_CASCADE_MS = 0;
const MAX_CASCADE_MS = 500;
const CASCADE_STEP_MS = 10;
const GROUP_SIZE = 3;
const FIRST = 0;
const BOX_WIDTH = 380;
const BOX_HEIGHT = 130;
const REEL_DIGITS = 4;
const REEL_PAD = "0";
const REEL_RANGE = 10 ** REEL_DIGITS;
const STARTING_REEL_VALUE = 7;
const STARTING_REEL_KEY: OdometerReels.SampleKey = "leftToRight";
const FIELD_WIDTH = 130;

const group = (value: number) => {
    const digits = String(Math.abs(value));
    const grouped = Array.from(digits)
        .map((digit, index) => ((digits.length - index) % GROUP_SIZE === 0 && index > FIRST ? `,${digit}` : digit))
        .join("");

    return value < ZERO ? `-${grouped}` : grouped;
};

const pad = (value: number) => String(value).padStart(REEL_DIGITS, REEL_PAD);

const pull = (value: number) => {
    const next = Math.floor(Math.random() * REEL_RANGE);

    return next === value ? (next + SMALL_STEP) % REEL_RANGE : next;
};

export const OdometerPage = () => {
    const [getValue, setValue] = createSignal(STARTING_VALUE);
    const [getTurnMs, setTurnMs] = createSignal(ODOMETER_DEFAULTS.turnDurationMs);
    const [getCascadeMs, setCascadeMs] = createSignal(ODOMETER_DEFAULTS.cascadeDelayMs);
    const [getReelValue, setReelValue] = createSignal(STARTING_REEL_VALUE);
    const [getReelKey, setReelKey] = createSignal<OdometerReels.SampleKey>(STARTING_REEL_KEY);

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
                    "every column that has to carry waits for the one to its right, a column going nine to zero keeps turning forward rather than rewinding, and crossing zero turns the whole number back the other way, and a digit or separator arriving or going grows in or shrinks away while it fades",
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
            {
                key: "reels",
                name: "Reels",
                readout: () =>
                    "every column spins at once and stops in the order its reel gives, taking extra whole turns on the way; with less motion asked for it only turns as far as its digit needs",
                component: () => (
                    <div class={styles.stack}>
                        <PageMeasureBox
                            width={() => BOX_WIDTH}
                            height={() => BOX_HEIGHT}
                            padding={() => MEASURE_BOX_PADDING}
                        >
                            <ReelsExample text={() => pad(getReelValue())} reelKey={getReelKey} />
                        </PageMeasureBox>

                        <div class={styles.controls}>
                            <Button
                                id={"pullReels"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Pull</PageButtonContent>
                                )}
                                onClick={() => {
                                    setReelValue(pull);
                                }}
                            />
                        </div>

                        <PagePropsPanel scope={"local"}>
                            <PageProp
                                key={"reelKey"}
                                label={"Reel"}
                                hint={
                                    "How many extra turns each column makes and how long it takes, which decides the order the columns stop in."
                                }
                            >
                                <PageSelectField
                                    value={getReelKey}
                                    values={() => OdometerReels.SAMPLE_KEYS}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Reel"}
                                    onChange={(key) => setReelKey(() => key)}
                                />
                            </PageProp>
                        </PagePropsPanel>
                    </div>
                ),
                path: `${EXAMPLES_ROOT}/Reels.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"value"}
                    label={"Value"}
                    hint={"The number the odometer is counting to. Changing it is what starts the digits turning."}
                >
                    <PageNumberField
                        value={getValue}
                        min={() => MIN_VALUE}
                        max={() => MAX_VALUE}
                        step={() => SMALL_STEP}
                        ariaLabel={"Value"}
                        onInput={setValue}
                    />
                </PageProp>

                <PageProp
                    key={"turnDurationMs"}
                    label={"Turn (ms)"}
                    hint={"How long one digit takes to turn from its old face to its new one."}
                >
                    <PageNumberField
                        value={getTurnMs}
                        min={() => MIN_TURN_MS}
                        max={() => MAX_TURN_MS}
                        step={() => TURN_STEP_MS}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTurnMs}
                    />
                </PageProp>

                <PageProp
                    key={"cascadeDelayMs"}
                    label={"Cascade (ms)"}
                    hint={
                        "How long each digit waits after the one beside it starts, which is what makes the turn ripple along."
                    }
                >
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
