import { useState } from "react";

import { Button, SLOT_TEXT_DEFAULTS, SlotTextReels } from "@thewaver/ss-components-react";
import { SlotTextKnobs } from "@thewaver/ss-playground/App/Knobs/SlotTexts.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { CounterExample } from "./Examples/Counter";
import { ReelsExample } from "./Examples/Reels";
import { SplitFlapExample } from "./Examples/SplitFlap";
import type { SlotTextExampleProps } from "./SlotTextPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/SlotTextPage/Examples";

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

export const SlotTextPage = () => {
    const [value, setValue] = useState(SlotTextKnobs.STARTING_VALUE);
    const [turnMs, setTurnMs] = useState(SLOT_TEXT_DEFAULTS.turnDurationMs);
    const [cascadeMs, setCascadeMs] = useState(SLOT_TEXT_DEFAULTS.turnDelayMs);
    const [reelValue, setReelValue] = useState(STARTING_REEL_VALUE);
    const [reelKey, setReelKey] = useState<SlotTextReels.SampleKey>(SlotTextKnobs.STARTING_REEL_KEY);

    const step = (delta: number) =>
        setValue((prev) => Math.min(Math.max(prev + delta, SlotTextKnobs.MIN_VALUE), SlotTextKnobs.MAX_VALUE));

    const commonProps: SlotTextExampleProps = {
        text: group(value),
        turnDurationMs: turnMs,
        turnDelayMs: cascadeMs,
    };

    const examples = [
        {
            key: "counter",
            name: "Counter",
            readout: () =>
                "every column that has to carry waits for the one to its right, a column going nine to zero keeps turning forward rather than rewinding, and crossing zero turns the whole number back the other way, and a digit or separator arriving or going grows in or shrinks away while it fades",
            component: () => (
                <div className={styles.stack}>
                    <CounterExample {...commonProps} />

                    <div className={styles.controls}>
                        <Button
                            id={"stepDown"}
                            renderContent={(flags) => (
                                <PageButtonContent flags={flags}>{`take ${SMALL_STEP}`}</PageButtonContent>
                            )}
                            onClick={() => {
                                step(-SMALL_STEP);
                            }}
                        />

                        <Button
                            id={"stepUp"}
                            renderContent={(flags) => (
                                <PageButtonContent flags={flags}>{`add ${SMALL_STEP}`}</PageButtonContent>
                            )}
                            onClick={() => {
                                step(SMALL_STEP);
                            }}
                        />

                        <Button
                            id={"jumpUp"}
                            renderContent={(flags) => (
                                <PageButtonContent flags={flags}>{`add ${BIG_STEP}`}</PageButtonContent>
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
                <>
                    <div className={styles.stack}>
                        <ReelsExample text={pad(reelValue)} reelKey={reelKey} />

                        <div className={styles.controls}>
                            <Button
                                id={"pullReels"}
                                renderContent={(flags) => <PageButtonContent flags={flags}>Pull</PageButtonContent>}
                                onClick={() => {
                                    setReelValue(pull);
                                }}
                            />
                        </div>
                    </div>

                    <PageExampleKnobs>
                        <PageProp
                            itemKey={"reelKey"}
                            label={"Reel"}
                            hint={
                                "How many extra turns each column makes and how long it takes, which decides the order the columns stop in."
                            }
                        >
                            <PageSelectField
                                value={reelKey}
                                values={SlotTextReels.SAMPLE_KEYS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Reel"}
                                onChange={setReelKey}
                            />
                        </PageProp>
                    </PageExampleKnobs>
                </>
            ),
            path: `${EXAMPLES_ROOT}/Reels.tsx`,
        },
        {
            key: "splitFlap",
            name: "Departures board",
            readout: () =>
                "each column drops one flap after another through every digit between the old one and the new, the top half of the digit going falling to uncover the bottom half of the digit coming; a column that carries waits for the one to its right, and a column whose digit has not changed does not flip",
            component: () => <SplitFlapExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/SplitFlap.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"value"}
                    label={"Value"}
                    hint={"The number the odometer is counting to. Changing it is what starts the digits turning."}
                >
                    <PageNumberField
                        value={value}
                        min={SlotTextKnobs.MIN_VALUE}
                        max={SlotTextKnobs.MAX_VALUE}
                        step={SMALL_STEP}
                        ariaLabel={"Value"}
                        onInput={setValue}
                    />
                </PageProp>

                <PageProp
                    itemKey={"turnDurationMs"}
                    label={"Turn (ms)"}
                    hint={"How long one digit takes to turn from its old face to its new one."}
                >
                    <PageNumberField
                        value={turnMs}
                        min={SlotTextKnobs.MIN_TURN_MS}
                        max={SlotTextKnobs.MAX_TURN_MS}
                        step={SlotTextKnobs.TURN_STEP_MS}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTurnMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"turnDelayMs"}
                    label={"Cascade (ms)"}
                    hint={
                        "How long each digit waits after the one beside it starts, which is what makes the turn ripple along."
                    }
                >
                    <PageNumberField
                        value={cascadeMs}
                        min={SlotTextKnobs.MIN_CASCADE_MS}
                        max={SlotTextKnobs.MAX_CASCADE_MS}
                        step={SlotTextKnobs.CASCADE_STEP_MS}
                        ariaLabel={"Cascade delay in milliseconds"}
                        onInput={setCascadeMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
