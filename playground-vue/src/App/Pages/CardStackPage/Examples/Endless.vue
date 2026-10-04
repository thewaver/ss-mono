<script setup lang="ts">
import { onMounted, shallowRef } from "vue";

import { Button, CardStack } from "@thewaver/ss-components-vue";
import type { CardStackControls } from "@thewaver/ss-components-vue";
import { computeCardTilt } from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.css";
import type { SwipeDirection } from "@thewaver/ss-utils";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { CardStackEndlessExampleProps } from "../CardStackExamples.types";

const DIRECTIONS: SwipeDirection[] = ["left", "right"];
const DIRECTION_LABELS: Record<SwipeDirection, string> = {
    left: "Left",
    right: "Right",
    up: "Up",
    down: "Down",
};

const BATCH_SIZE = 6;
const LOW_COUNT = 3;
const NEXT = 1;
const FIRST_CARD = 0;

const BOX_HEIGHT = 240;

const SHOWN = 1;
const GONE = 0;

const computeBatch = (from: number) =>
    Array.from({ length: BATCH_SIZE }, (_, offset) => `Card ${from + offset + NEXT}`);

type Props = CardStackEndlessExampleProps;

const props = defineProps<Props>();

const controls = shallowRef<CardStackControls>();
const cards = shallowRef(computeBatch(FIRST_CARD));

const computeCardLabel = (card: string) => card;

const handleSend = (direction: SwipeDirection, card: string, index: number) => {
    props.onSend(direction, card);

    if (cards.value.length - (index + NEXT) >= LOW_COUNT) return;

    const nextCards = [...cards.value, ...computeBatch(cards.value.length)];

    cards.value = nextCards;
    props.onLoad(nextCards.length);
};

const send = (direction: SwipeDirection) => {
    controls.value?.send(direction);
};

onMounted(() => {
    props.onLoad(cards.value.length);
});
</script>

<template>
    <div :class="styles.deckStage">
        <PageMeasureBox is-filling :height="BOX_HEIGHT">
            <CardStack
                :cards="cards"
                :allowed-directions="DIRECTIONS"
                :is-disabled="isDisabled"
                :commit-ratio="commitRatio"
                :transition-duration-ms="transitionDurationMs"
                :mounted-count="mountedCount"
                :card-gap="cardGap"
                :funnel-ratio="funnelRatio"
                :pile-side="pileSide"
                ariaLabel="Endless deck"
                :compute-card-label="computeCardLabel"
                @send="handleSend"
                @mount="(next: CardStackControls) => (controls = next)"
            >
                <template #renderCard="state">
                    <div
                        :class="styles.deckCard"
                        :style="{
                            transform: `rotate(${computeCardTilt(state)}deg)`,
                            opacity: state.leavingTo === undefined ? SHOWN : GONE,
                            transitionDuration: `${transitionDurationMs}ms`,
                        }"
                    >
                        {{ state.card }}
                    </div>
                </template>
            </CardStack>
        </PageMeasureBox>

        <div :class="styles.deckControls">
            <Button
                v-for="direction in DIRECTIONS"
                :id="`endless-send-${direction}`"
                :key="direction"
                :is-disabled="isDisabled"
                :ariaLabel="`Send the top card ${direction}`"
                @click="send(direction)"
            >
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">{{ DIRECTION_LABELS[direction] }}</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
