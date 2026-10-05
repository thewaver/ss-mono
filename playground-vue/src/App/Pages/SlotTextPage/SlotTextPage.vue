<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button, SLOT_TEXT_DEFAULTS, SlotTextReels } from "@thewaver/ss-components-vue";
import type { SlotTextLetterRoute, SlotTextMechanism } from "@thewaver/ss-components-vue";
import { SlotTextKnobs } from "@thewaver/ss-playground/App/Knobs/SlotTexts.const";
import { WORDS } from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import CounterExample from "./Examples/Counter.vue";
import ReelsExample from "./Examples/Reels.vue";
import SplitFlapExample from "./Examples/SplitFlap.vue";
import WordsExample from "./Examples/Words.vue";
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

const value = shallowRef(SlotTextKnobs.STARTING_VALUE);
const turnMs = shallowRef(SLOT_TEXT_DEFAULTS.turnDurationMs);
const cascadeMs = shallowRef(SLOT_TEXT_DEFAULTS.turnDelayMs);
const reelValue = shallowRef(STARTING_REEL_VALUE);
const reelKey = shallowRef<SlotTextReels.SampleKey>(SlotTextKnobs.STARTING_REEL_KEY);
const wordIndex = shallowRef(FIRST);
const wordMechanism = shallowRef<SlotTextMechanism>(SlotTextKnobs.STARTING_WORD_MECHANISM);
const letterRoute = shallowRef<SlotTextLetterRoute>(SlotTextKnobs.STARTING_LETTER_ROUTE);

const step = (delta: number) => {
    value.value = Math.min(Math.max(value.value + delta, SlotTextKnobs.MIN_VALUE), SlotTextKnobs.MAX_VALUE);
};

const pullReels = () => {
    reelValue.value = pull(reelValue.value);
};

const nextWord = () => {
    wordIndex.value = (wordIndex.value + 1) % WORDS.length;
};

const commonProps = computed<SlotTextExampleProps>(() => ({
    text: group(value.value),
    turnDurationMs: turnMs.value,
    turnDelayMs: cascadeMs.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "counter",
        name: "Counter",
        readout: () =>
            "every column that has to carry waits for the one to its right, a column going nine to zero keeps turning forward rather than rewinding, and crossing zero turns the whole number back the other way, and a digit or separator arriving or going grows in or shrinks away while it fades",
        path: `${EXAMPLES_ROOT}/Counter.vue`,
    },
    {
        key: "reels",
        name: "Reels",
        readout: () =>
            "every column spins at once and stops in the order its reel gives, taking extra whole turns on the way; with less motion asked for it only turns as far as its digit needs",
        path: `${EXAMPLES_ROOT}/Reels.vue`,
    },
    {
        key: "splitFlap",
        name: "Departures board",
        readout: () =>
            "the counter's number on flaps: each column drops one flap after another through every digit between the old one and the new, the top half of the digit going falling to uncover the bottom half of the digit coming; a column that carries waits for the one to its right, and a column whose digit has not changed does not flip",
        path: `${EXAMPLES_ROOT}/SplitFlap.vue`,
    },
    {
        key: "words",
        name: "Words, a letter at a time",
        readout: () =>
            `showing: ${WORDS[wordIndex.value].trim()} — every letter is a column of its own that turns through the alphabet to its next letter, with the words padded by spaces so no column comes or goes; forward always goes on round, as a departures board does, and shortest takes the nearer way`,
        path: `${EXAMPLES_ROOT}/Words.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="value"
            label="Value"
            hint="The number the counter and the departures board show. Changing it is what starts them turning."
        >
            <PageNumberField
                :value="value"
                :min="SlotTextKnobs.MIN_VALUE"
                :max="SlotTextKnobs.MAX_VALUE"
                :step="SMALL_STEP"
                ariaLabel="Value"
                @input="(next: number) => (value = next)"
            />
        </PageProp>

        <PageProp
            item-key="turnDurationMs"
            label="Turn (ms)"
            hint="How long one column takes to turn from its old character to its new one."
        >
            <PageNumberField
                :value="turnMs"
                :min="SlotTextKnobs.MIN_TURN_MS"
                :max="SlotTextKnobs.MAX_TURN_MS"
                :step="SlotTextKnobs.TURN_STEP_MS"
                ariaLabel="Turn duration in milliseconds"
                @input="(next: number) => (turnMs = next)"
            />
        </PageProp>

        <PageProp
            item-key="turnDelayMs"
            label="Turn delay (ms)"
            hint="How long each column waits after the turning column beside it starts, which is what makes the turn ripple along."
        >
            <PageNumberField
                :value="cascadeMs"
                :min="SlotTextKnobs.MIN_CASCADE_MS"
                :max="SlotTextKnobs.MAX_CASCADE_MS"
                :step="SlotTextKnobs.CASCADE_STEP_MS"
                ariaLabel="Turn delay in milliseconds"
                @input="(next: number) => (cascadeMs = next)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #counter>
            <div :class="styles.stack">
                <PageMeasureBox>
                    <div :class="styles.line">
                        <CounterExample v-bind="commonProps" />
                    </div>
                </PageMeasureBox>

                <div :class="styles.controls">
                    <Button v-for="entry in STEPS" :id="entry.id" :key="entry.id" @click="step(entry.delta)">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">{{ entry.label }}</PageButtonContent>
                        </template>
                    </Button>
                </div>
            </div>
        </template>

        <template #reels>
            <div :class="styles.stack">
                <PageMeasureBox>
                    <div :class="styles.line">
                        <ReelsExample :text="pad(reelValue)" :reel-key="reelKey" />
                    </div>
                </PageMeasureBox>

                <div :class="styles.controls">
                    <Button id="pullReels" @click="pullReels">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Pull</PageButtonContent>
                        </template>
                    </Button>
                </div>
            </div>

            <PageExampleKnobs>
                <PageProp
                    item-key="reelKey"
                    label="Reel"
                    hint="How many extra turns each column makes and how long it takes, which decides the order the columns stop in."
                >
                    <PageSelectField
                        :value="reelKey"
                        :values="SlotTextReels.SAMPLE_KEYS"
                        :width="FIELD_WIDTH"
                        ariaLabel="Reel"
                        @change="(next: SlotTextReels.SampleKey) => (reelKey = next)"
                    />
                </PageProp>
            </PageExampleKnobs>
        </template>

        <template #splitFlap>
            <div :class="styles.stack">
                <PageMeasureBox>
                    <div :class="styles.line">
                        <SplitFlapExample v-bind="commonProps" />
                    </div>
                </PageMeasureBox>

                <div :class="styles.controls">
                    <Button v-for="entry in STEPS" :id="entry.flapId" :key="entry.flapId" @click="step(entry.delta)">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">{{ entry.label }}</PageButtonContent>
                        </template>
                    </Button>
                </div>
            </div>
        </template>

        <template #words>
            <div :class="styles.stack">
                <PageMeasureBox>
                    <div :class="styles.line">
                        <WordsExample
                            v-bind="commonProps"
                            :text="WORDS[wordIndex]"
                            :mechanism="wordMechanism"
                            :letter-route="letterRoute"
                        />
                    </div>
                </PageMeasureBox>

                <div :class="styles.controls">
                    <Button id="nextWord" @click="nextWord">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Next word</PageButtonContent>
                        </template>
                    </Button>
                </div>
            </div>

            <PageExampleKnobs>
                <PageProp
                    item-key="mechanism"
                    label="Mechanism"
                    hint="Whether each letter turns on a drum or drops through flaps."
                >
                    <PageSelectField
                        :value="wordMechanism"
                        :values="SlotTextKnobs.MECHANISMS"
                        :width="FIELD_WIDTH"
                        ariaLabel="Mechanism"
                        @change="(next: SlotTextMechanism) => (wordMechanism = next)"
                    />
                </PageProp>

                <PageProp
                    item-key="letterRoute"
                    label="Letter route"
                    hint="Forward always goes on round the alphabet, so C to Z passes every letter between; shortest takes the nearer way, so C to Z goes back three."
                >
                    <PageSelectField
                        :value="letterRoute"
                        :values="SlotTextKnobs.LETTER_ROUTES"
                        :width="FIELD_WIDTH"
                        ariaLabel="Letter route"
                        @change="(next: SlotTextLetterRoute) => (letterRoute = next)"
                    />
                </PageProp>
            </PageExampleKnobs>
        </template>
    </PageExamples>
</template>
