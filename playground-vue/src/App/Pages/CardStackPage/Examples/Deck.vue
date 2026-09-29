<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button, CardStack } from "@thewaver/ss-components-vue";
import type { CardStackControls } from "@thewaver/ss-components-vue";
import { computeCardTilt } from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CardStackPage/CardStackPage.css";
import type { SwipeDirection } from "@thewaver/ss-utils";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { CardStackDeckExampleProps } from "../CardStackExamples.types";

const CARDS = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven", "Six", "Five", "Four", "Three", "Two"];
const DIRECTIONS: SwipeDirection[] = ["left", "right", "up", "down"];
const DIRECTION_LABELS: Record<SwipeDirection, string> = {
    left: "Left",
    right: "Right",
    up: "Up",
    down: "Down",
};

const BOX_HEIGHT = 240;

const SHOWN = 1;
const FIRST_INDEX = 0;
const GONE = 0;

type Props = CardStackDeckExampleProps;

const props = defineProps<Props>();

const controls = shallowRef<CardStackControls>();

const isEmpty = computed(() => controls.value?.getIsEmpty());
const topIndex = computed(() => controls.value?.getTopIndex() ?? FIRST_INDEX);

const computeCardLabel = (card: string) => card;

const send = (direction: SwipeDirection) => {
    controls.value?.send(direction);
};

const recall = () => {
    if (controls.value?.recall()) props.onRecall();
};

const deal = () => {
    props.onDeal();
    controls.value?.deal();
};
</script>

<template>
    <div :class="styles.deckStage">
        <PageMeasureBox is-filling :height="BOX_HEIGHT">
            <CardStack
                :cards="CARDS"
                :is-disabled="isDisabled"
                :commit-ratio="commitRatio"
                :transition-duration-ms="transitionDurationMs"
                :mounted-count="mountedCount"
                :card-gap="cardGap"
                :funnel-ratio="funnelRatio"
                ariaLabel="Deck of cards"
                :compute-card-label="computeCardLabel"
                @send="props.onSend"
                @empty="props.onEmpty"
                @mount="(next: CardStackControls) => (controls = next)"
            >
                <template #renderCard="state">
                    <div
                        :class="styles.deckCard"
                        :style="{
                            transform: `rotate(${computeCardTilt(state)}deg)`,
                            opacity: state.leavingTo === undefined && state.returningFrom === undefined ? SHOWN : GONE,
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
                :id="`send-${direction}`"
                :key="direction"
                :is-disabled="isDisabled || (isEmpty ?? true)"
                :ariaLabel="`Send the top card ${direction}`"
                @click="send(direction)"
            >
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">{{ DIRECTION_LABELS[direction] }}</PageButtonContent>
                </template>
            </Button>

            <Button
                id="recall"
                :is-disabled="isDisabled || topIndex === FIRST_INDEX"
                ariaLabel="Bring the last card back"
                @click="recall"
            >
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Recall</PageButtonContent>
                </template>
            </Button>

            <Button v-if="isEmpty" id="deal" ariaLabel="Deal the cards again" @click="deal">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Deal again</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
