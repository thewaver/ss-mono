<script setup lang="ts">
import { shallowRef } from "vue";

import { CARD_STACK_DEFAULTS } from "@thewaver/ss-components-vue";
import { CardStackKnobs } from "@thewaver/ss-playground/App/Knobs/CardStacks.const";
import type { SwipeDirection } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DeckExample from "./Examples/Deck.vue";
import EndlessExample from "./Examples/Endless.vue";

const EXAMPLES_ROOT = "/src/App/Pages/CardStackPage/Examples";

const FIELD_WIDTH = 110;

const isDisabled = shallowRef(CardStackKnobs.STARTING_IS_DISABLED);
const commitRatio = shallowRef(CARD_STACK_DEFAULTS.commitRatio);
const transitionDurationMs = shallowRef(CARD_STACK_DEFAULTS.transitionDurationMs);
const mountedCount = shallowRef(CARD_STACK_DEFAULTS.mountedCount);
const cardGap = shallowRef(CARD_STACK_DEFAULTS.cardGap);
const funnelRatio = shallowRef(CARD_STACK_DEFAULTS.funnelRatio);

const lastSend = shallowRef<{ direction: SwipeDirection; card: string }>();
const isEmpty = shallowRef(false);

const lastEndlessSend = shallowRef<{ direction: SwipeDirection; card: string }>();
const loadedCount = shallowRef(0);

const deal = () => {
    isEmpty.value = false;
    lastSend.value = undefined;
};

const examples: ExampleDefs[] = [
    {
        key: "deck",
        name: "Deck of cards",
        readout: () => {
            if (isEmpty.value) return "the pile is empty — deal again to put every card back";

            if (!lastSend.value) return "push the top card any of the four ways, or use the buttons or the arrow keys";

            return `${lastSend.value.card} went ${lastSend.value.direction}`;
        },
        path: `${EXAMPLES_ROOT}/Deck.vue`,
    },
    {
        key: "endless",
        name: "A deck that never runs out",
        readout: () => {
            if (!lastEndlessSend.value)
                return "left or right only — an upward push springs back, and on a touch screen it scrolls the page instead";

            return `${lastEndlessSend.value.card} went ${lastEndlessSend.value.direction} — ${loadedCount.value} cards loaded so far, more arrive as the pile runs low`;
        },
        path: `${EXAMPLES_ROOT}/Endless.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Turns the stack off, so no card moves by gesture, button or key."
        >
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>

        <PageProp
            item-key="commitRatio"
            label="Commit ratio"
            hint="How far across the stack a card has to be pushed before it leaves. Let go short of it and it springs back."
        >
            <PageNumberField
                :value="commitRatio"
                :min="CardStackKnobs.MIN_COMMIT_RATIO"
                :max="CardStackKnobs.MAX_COMMIT_RATIO"
                :step="CardStackKnobs.COMMIT_RATIO_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Commit ratio"
                @input="(value: number) => (commitRatio = value)"
            />
        </PageProp>

        <PageProp
            item-key="transitionDurationMs"
            label="Duration (ms)"
            hint="How long a card takes to fly out, and how long one that fell short takes to settle back."
        >
            <PageNumberField
                :value="transitionDurationMs"
                :min="CardStackKnobs.MIN_DURATION_MS"
                :max="CardStackKnobs.MAX_DURATION_MS"
                :step="CardStackKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Duration in milliseconds"
                @input="(value: number) => (transitionDurationMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="mountedCount"
            label="Mounted cards"
            hint="How many cards are in the document at once, counting the top one."
        >
            <PageNumberField
                :value="mountedCount"
                :min="CardStackKnobs.MIN_MOUNTED_COUNT"
                :max="CardStackKnobs.MAX_MOUNTED_COUNT"
                :step="CardStackKnobs.MOUNTED_COUNT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Mounted cards"
                @input="(value: number) => (mountedCount = value)"
            />
        </PageProp>

        <PageProp
            item-key="cardGap"
            label="Card gap (px)"
            hint="How far apart the cards in the pile sit. The bottom one fills the stack's box, and each card above it is lifted by one more of these."
        >
            <PageNumberField
                :value="cardGap"
                :min="CardStackKnobs.MIN_CARD_GAP"
                :max="CardStackKnobs.MAX_CARD_GAP"
                :step="CardStackKnobs.CARD_GAP_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Card gap in pixels"
                @input="(value: number) => (cardGap = value)"
            />
        </PageProp>

        <PageProp
            item-key="funnelRatio"
            label="Funnel"
            hint="How much narrower each card is than the one in front of it. The top card is the widest and fills the stack; 0 stacks cards of equal width."
        >
            <PageNumberField
                :value="funnelRatio"
                :min="CardStackKnobs.MIN_FUNNEL_RATIO"
                :max="CardStackKnobs.MAX_FUNNEL_RATIO"
                :step="CardStackKnobs.FUNNEL_RATIO_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Funnel"
                @input="(value: number) => (funnelRatio = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #deck>
            <DeckExample
                :is-disabled="isDisabled"
                :commit-ratio="commitRatio"
                :transition-duration-ms="transitionDurationMs"
                :mounted-count="mountedCount"
                :card-gap="cardGap"
                :funnel-ratio="funnelRatio"
                @send="(direction: SwipeDirection, card: string) => (lastSend = { direction, card })"
                @empty="isEmpty = true"
                @deal="deal"
                @recall="isEmpty = false"
            />
        </template>

        <template #endless>
            <EndlessExample
                :is-disabled="isDisabled"
                :commit-ratio="commitRatio"
                :transition-duration-ms="transitionDurationMs"
                :mounted-count="mountedCount"
                :card-gap="cardGap"
                :funnel-ratio="funnelRatio"
                @send="(direction: SwipeDirection, card: string) => (lastEndlessSend = { direction, card })"
                @load="(count: number) => (loadedCount = count)"
            />
        </template>
    </PageExamples>
</template>
