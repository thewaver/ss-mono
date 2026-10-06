import { For, createMemo, createSignal } from "solid-js";

import { Button, SLOT_TEXT_DEFAULTS, SlotTextReels } from "@thewaver/ss-components-solid";
import type { SlotTextLetterRoute, SlotTextMechanism } from "@thewaver/ss-components-solid";
import { SlotTextKnobs } from "@thewaver/ss-playground/App/Knobs/SlotTexts.const";
import { WORDS } from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageControlButtonContent } from "../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { CounterExample } from "./Examples/Counter";
import { ReelsExample } from "./Examples/Reels";
import { SplitFlapExample } from "./Examples/SplitFlap";
import { WordsExample } from "./Examples/Words";
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

const STEPS = [
    { id: "stepDown", flapId: "flapStepDown", label: `take ${SMALL_STEP}`, delta: -SMALL_STEP },
    { id: "stepUp", flapId: "flapStepUp", label: `add ${SMALL_STEP}`, delta: SMALL_STEP },
    { id: "jumpUp", flapId: "flapJumpUp", label: `add ${BIG_STEP}`, delta: BIG_STEP },
];

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
    const [getValue, setValue] = createSignal(SlotTextKnobs.STARTING_VALUE);
    const [getTurnMs, setTurnMs] = createSignal(SLOT_TEXT_DEFAULTS.turnDurationMs);
    const [getTurnDelayMs, setTurnDelayMs] = createSignal(SLOT_TEXT_DEFAULTS.turnDelayMs);
    const [getReelValue, setReelValue] = createSignal(STARTING_REEL_VALUE);
    const [getReelKey, setReelKey] = createSignal<SlotTextReels.SampleKey>(SlotTextKnobs.STARTING_REEL_KEY);
    const [getWordIndex, setWordIndex] = createSignal(FIRST);
    const [getWordMechanism, setWordMechanism] = createSignal<SlotTextMechanism>(SlotTextKnobs.STARTING_WORD_MECHANISM);
    const [getLetterRoute, setLetterRoute] = createSignal<SlotTextLetterRoute>(SlotTextKnobs.STARTING_LETTER_ROUTE);

    const step = (delta: number) =>
        setValue((value) => Math.min(Math.max(value + delta, SlotTextKnobs.MIN_VALUE), SlotTextKnobs.MAX_VALUE));

    const renderStepControls = (isFlap: boolean) => (
        <div class={styles.controls}>
            <For each={STEPS}>
                {(entry) => (
                    <Button
                        id={isFlap ? entry.flapId : entry.id}
                        renderContent={(getFlags) => (
                            <PageControlButtonContent flags={getFlags}>{entry.label}</PageControlButtonContent>
                        )}
                        onClick={() => {
                            step(entry.delta);
                        }}
                    />
                )}
            </For>
        </div>
    );

    const getExamples = createMemo(() => {
        const commonProps: SlotTextExampleProps = {
            text: () => group(getValue()),
            turnDurationMs: getTurnMs,
            turnDelayMs: getTurnDelayMs,
        };

        return [
            {
                key: "counter",
                name: "Counter",
                readout: () =>
                    "every column that has to carry waits for the one to its right, a column going nine to zero keeps turning forward rather than rewinding, and crossing zero turns the whole number back the other way, and a digit or separator arriving or going grows in or shrinks away while it fades",
                component: () => (
                    <div class={styles.stack}>
                        <PageMeasureBox>
                            <div class={styles.line}>
                                <CounterExample {...commonProps} />
                            </div>
                        </PageMeasureBox>

                        {renderStepControls(false)}
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
                        <div class={styles.stack}>
                            <PageMeasureBox>
                                <div class={styles.line}>
                                    <ReelsExample text={() => pad(getReelValue())} reelKey={getReelKey} />
                                </div>
                            </PageMeasureBox>

                            <div class={styles.controls}>
                                <Button
                                    id={"pullReels"}
                                    renderContent={(getFlags) => (
                                        <PageControlButtonContent flags={getFlags}>Pull</PageControlButtonContent>
                                    )}
                                    onClick={() => {
                                        setReelValue(pull);
                                    }}
                                />
                            </div>
                        </div>

                        <PageExampleKnobs>
                            <PageProp
                                key={"reelKey"}
                                label={"Reel"}
                                hint={
                                    "How many extra turns each column makes and how long it takes, which decides the order the columns stop in."
                                }
                            >
                                <PageSelectField
                                    value={getReelKey}
                                    values={() => SlotTextReels.SAMPLE_KEYS}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Reel"}
                                    onChange={(key) => setReelKey(() => key)}
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
                    "the counter's number on flaps: each column drops one flap after another through every digit between the old one and the new, the top half of the digit going falling to uncover the bottom half of the digit coming; a column that carries waits for the one to its right, and a column whose digit has not changed does not flip",
                component: () => (
                    <div class={styles.stack}>
                        <PageMeasureBox>
                            <div class={styles.line}>
                                <SplitFlapExample {...commonProps} />
                            </div>
                        </PageMeasureBox>

                        {renderStepControls(true)}
                    </div>
                ),
                path: `${EXAMPLES_ROOT}/SplitFlap.tsx`,
            },
            {
                key: "words",
                name: "Words, a letter at a time",
                readout: () =>
                    `showing: ${WORDS[getWordIndex()].trim()} — every letter is a column of its own that turns through the alphabet to its next letter, with the words padded by spaces so no column comes or goes; forward always goes on round, as a departures board does, and shortest takes the nearer way`,
                component: () => (
                    <>
                        <div class={styles.stack}>
                            <PageMeasureBox>
                                <div class={styles.line}>
                                    <WordsExample
                                        {...commonProps}
                                        text={() => WORDS[getWordIndex()]}
                                        mechanism={getWordMechanism}
                                        letterRoute={getLetterRoute}
                                    />
                                </div>
                            </PageMeasureBox>

                            <div class={styles.controls}>
                                <Button
                                    id={"nextWord"}
                                    ariaLabel={"Next word"}
                                    renderContent={(getFlags) => (
                                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.next} />
                                    )}
                                    onClick={() => {
                                        setWordIndex((index) => (index + 1) % WORDS.length);
                                    }}
                                />
                            </div>
                        </div>

                        <PageExampleKnobs>
                            <PageProp
                                key={"mechanism"}
                                label={"Mechanism"}
                                hint={"Whether each letter turns on a drum or drops through flaps."}
                            >
                                <PageSelectField
                                    value={getWordMechanism}
                                    values={() => SlotTextKnobs.MECHANISMS}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Mechanism"}
                                    onChange={(mechanism) => setWordMechanism(() => mechanism)}
                                />
                            </PageProp>

                            <PageProp
                                key={"letterRoute"}
                                label={"Letter route"}
                                hint={
                                    "Forward always goes on round the alphabet, so C to Z passes every letter between; shortest takes the nearer way, so C to Z goes back three."
                                }
                            >
                                <PageSelectField
                                    value={getLetterRoute}
                                    values={() => SlotTextKnobs.LETTER_ROUTES}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Letter route"}
                                    onChange={(route) => setLetterRoute(() => route)}
                                />
                            </PageProp>
                        </PageExampleKnobs>
                    </>
                ),
                path: `${EXAMPLES_ROOT}/Words.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"value"}
                    label={"Value"}
                    hint={
                        "The number the counter and the departures board show. Changing it is what starts them turning."
                    }
                >
                    <PageNumberField
                        value={getValue}
                        min={() => SlotTextKnobs.MIN_VALUE}
                        max={() => SlotTextKnobs.MAX_VALUE}
                        step={() => SMALL_STEP}
                        ariaLabel={"Value"}
                        onInput={setValue}
                    />
                </PageProp>

                <PageProp
                    key={"turnDurationMs"}
                    label={"Turn (ms)"}
                    hint={"How long one column takes to turn from its old character to its new one."}
                >
                    <PageNumberField
                        value={getTurnMs}
                        min={() => SlotTextKnobs.MIN_TURN_MS}
                        max={() => SlotTextKnobs.MAX_TURN_MS}
                        step={() => SlotTextKnobs.TURN_STEP_MS}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTurnMs}
                    />
                </PageProp>

                <PageProp
                    key={"turnDelayMs"}
                    label={"Turn delay (ms)"}
                    hint={
                        "How long each column waits after the turning column beside it starts, which is what makes the turn ripple along."
                    }
                >
                    <PageNumberField
                        value={getTurnDelayMs}
                        min={() => SlotTextKnobs.MIN_CASCADE_MS}
                        max={() => SlotTextKnobs.MAX_CASCADE_MS}
                        step={() => SlotTextKnobs.CASCADE_STEP_MS}
                        ariaLabel={"Turn delay in milliseconds"}
                        onInput={setTurnDelayMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
