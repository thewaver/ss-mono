import { createMemo, createSignal } from "solid-js";

import { Button, ODOMETER_DEFAULTS, OdometerReels } from "@thewaver/ss-components";

import { OdometerKnobs } from "../../Knobs/Odometers.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { CounterExample } from "./Examples/Counter";
import { ReelsExample } from "./Examples/Reels";
import type { OdometerExampleProps } from "./OdometerPage.types";

import * as styles from "./OdometerPage.css";

const EXAMPLES_ROOT = "/src/App/Pages/OdometerPage/Examples";

const ZERO = 0;
const SMALL_STEP = 1;
const BIG_STEP = 137;
const GROUP_SIZE = 3;
const FIRST = 0;
const REEL_DIGITS = 4;
const REEL_PAD = "0";
const REEL_RANGE = 10 ** REEL_DIGITS;
const STARTING_REEL_VALUE = 7;
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
    const [getValue, setValue] = createSignal(OdometerKnobs.STARTING_VALUE);
    const [getTurnMs, setTurnMs] = createSignal(ODOMETER_DEFAULTS.turnDurationMs);
    const [getCascadeMs, setCascadeMs] = createSignal(ODOMETER_DEFAULTS.cascadeDelayMs);
    const [getReelValue, setReelValue] = createSignal(STARTING_REEL_VALUE);
    const [getReelKey, setReelKey] = createSignal<OdometerReels.SampleKey>(OdometerKnobs.STARTING_REEL_KEY);

    const step = (delta: number) =>
        setValue((value) => Math.min(Math.max(value + delta, OdometerKnobs.MIN_VALUE), OdometerKnobs.MAX_VALUE));

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
                        <CounterExample {...commonProps} />

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
                        <ReelsExample text={() => pad(getReelValue())} reelKey={getReelKey} />

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
                        min={() => OdometerKnobs.MIN_VALUE}
                        max={() => OdometerKnobs.MAX_VALUE}
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
                        min={() => OdometerKnobs.MIN_TURN_MS}
                        max={() => OdometerKnobs.MAX_TURN_MS}
                        step={() => OdometerKnobs.TURN_STEP_MS}
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
                        min={() => OdometerKnobs.MIN_CASCADE_MS}
                        max={() => OdometerKnobs.MAX_CASCADE_MS}
                        step={() => OdometerKnobs.CASCADE_STEP_MS}
                        ariaLabel={"Cascade delay in milliseconds"}
                        onInput={setCascadeMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
