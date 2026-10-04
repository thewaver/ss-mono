<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button, ODOMETER_DEFAULTS, OdometerReels } from "@thewaver/ss-components-vue";
import { OdometerKnobs } from "@thewaver/ss-playground/App/Knobs/Odometers.const";
import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import CounterExample from "./Examples/Counter.vue";
import ReelsExample from "./Examples/Reels.vue";
import SplitFlapExample from "./Examples/SplitFlap.vue";
import type { OdometerExampleProps } from "./OdometerPage.types";

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

const value = shallowRef(OdometerKnobs.STARTING_VALUE);
const turnMs = shallowRef(ODOMETER_DEFAULTS.turnDurationMs);
const cascadeMs = shallowRef(ODOMETER_DEFAULTS.cascadeDelayMs);
const reelValue = shallowRef(STARTING_REEL_VALUE);
const reelKey = shallowRef<OdometerReels.SampleKey>(OdometerKnobs.STARTING_REEL_KEY);

const step = (delta: number) => {
    value.value = Math.min(Math.max(value.value + delta, OdometerKnobs.MIN_VALUE), OdometerKnobs.MAX_VALUE);
};

const pullReels = () => {
    reelValue.value = pull(reelValue.value);
};

const commonProps = computed<OdometerExampleProps>(() => ({
    text: group(value.value),
    turnDurationMs: turnMs.value,
    cascadeDelayMs: cascadeMs.value,
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
            "each column drops one flap after another through every digit between the old one and the new, the top half of the digit going falling to uncover the bottom half of the digit coming; a column that carries waits for the one to its right, and a column whose digit has not changed does not flip",
        path: `${EXAMPLES_ROOT}/SplitFlap.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="value"
            label="Value"
            hint="The number the odometer is counting to. Changing it is what starts the digits turning."
        >
            <PageNumberField
                :value="value"
                :min="OdometerKnobs.MIN_VALUE"
                :max="OdometerKnobs.MAX_VALUE"
                :step="SMALL_STEP"
                ariaLabel="Value"
                @input="(next: number) => (value = next)"
            />
        </PageProp>

        <PageProp
            item-key="turnDurationMs"
            label="Turn (ms)"
            hint="How long one digit takes to turn from its old face to its new one."
        >
            <PageNumberField
                :value="turnMs"
                :min="OdometerKnobs.MIN_TURN_MS"
                :max="OdometerKnobs.MAX_TURN_MS"
                :step="OdometerKnobs.TURN_STEP_MS"
                ariaLabel="Turn duration in milliseconds"
                @input="(next: number) => (turnMs = next)"
            />
        </PageProp>

        <PageProp
            item-key="cascadeDelayMs"
            label="Cascade (ms)"
            hint="How long each digit waits after the one beside it starts, which is what makes the turn ripple along."
        >
            <PageNumberField
                :value="cascadeMs"
                :min="OdometerKnobs.MIN_CASCADE_MS"
                :max="OdometerKnobs.MAX_CASCADE_MS"
                :step="OdometerKnobs.CASCADE_STEP_MS"
                ariaLabel="Cascade delay in milliseconds"
                @input="(next: number) => (cascadeMs = next)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #counter>
            <div :class="styles.stack">
                <CounterExample v-bind="commonProps" />

                <div :class="styles.controls">
                    <Button id="stepDown" @click="step(-SMALL_STEP)">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">{{ `take ${SMALL_STEP}` }}</PageButtonContent>
                        </template>
                    </Button>

                    <Button id="stepUp" @click="step(SMALL_STEP)">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">{{ `add ${SMALL_STEP}` }}</PageButtonContent>
                        </template>
                    </Button>

                    <Button id="jumpUp" @click="step(BIG_STEP)">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">{{ `add ${BIG_STEP}` }}</PageButtonContent>
                        </template>
                    </Button>
                </div>
            </div>
        </template>

        <template #reels>
            <div :class="styles.stack">
                <ReelsExample :text="pad(reelValue)" :reel-key="reelKey" />

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
                        :values="OdometerReels.SAMPLE_KEYS"
                        :width="FIELD_WIDTH"
                        ariaLabel="Reel"
                        @change="(next: OdometerReels.SampleKey) => (reelKey = next)"
                    />
                </PageProp>
            </PageExampleKnobs>
        </template>

        <template #splitFlap>
            <SplitFlapExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
