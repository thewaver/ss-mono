<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Button, FLIP_CARD_TURN_DIRECTIONS, FlipCard, Range } from "@thewaver/ss-components-vue";
import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components-vue";
import { computeFlipCardFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/FlipCardPage/FlipCardPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageFlipCardBack from "../../../StyledComponents/FlipCardContent/PageFlipCardBack.vue";
import PageFlipCardFront from "../../../StyledComponents/FlipCardContent/PageFlipCardFront.vue";
import PageFlipCardStack from "../../../StyledComponents/FlipCardContent/PageFlipCardStack.vue";
import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import type { FlipCardPressedExampleProps } from "../FlipCardPage.types";

const CARD_SIZE = { width: 220, height: 300 };

const EDGE_LABELS: Record<FlipCardAxis, Record<FlipCardTurnDirection, string>> = {
    row: { backward: "Press the left edge", forward: "Press the right edge" },
    column: { backward: "Press the bottom edge", forward: "Press the top edge" },
};

const PERCENT = 100;
const NO_PEEK = 0;
const PEEK_STEP = 1;

type Props = FlipCardPressedExampleProps;

const props = defineProps<Props>();

const isFlipped = useModel(props, "flipped");

const turnDirection = shallowRef<FlipCardTurnDirection>();
const peekRatio = shallowRef(NO_PEEK);

const getEdgeLabel = (direction: FlipCardTurnDirection) => EDGE_LABELS[props.axis][direction];

const turn = (direction: FlipCardTurnDirection) => {
    turnDirection.value = direction;
    peekRatio.value = NO_PEEK;
    isFlipped.value = !isFlipped.value;
    props.onTurn(direction);
};
</script>

<template>
    <PageFlipCardStack>
        <FlipCard
            v-model:flipped="isFlipped"
            :axis="axis"
            :size="CARD_SIZE"
            :transition-duration-ms="transitionDurationMs"
            :turn-direction="turnDirection"
            :peek-ratio="peekRatio"
            ariaLabel="Queen of spades"
            :compute-face-label="computeFlipCardFaceLabel"
        >
            <template #renderFront="state">
                <PageFlipCardFront :state="state">Q ♠</PageFlipCardFront>
            </template>

            <template #renderBack="state">
                <PageFlipCardBack :state="state">♥ ♦ ♣</PageFlipCardBack>
            </template>
        </FlipCard>

        <div :class="styles.controls">
            <Button
                v-for="direction in FLIP_CARD_TURN_DIRECTIONS"
                :id="`press-${direction}`"
                :key="direction"
                :ariaLabel="getEdgeLabel(direction)"
                @click="turn(direction)"
            >
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">{{ getEdgeLabel(direction) }}</PageButtonContent>
                </template>
            </Button>
        </div>

        <div :class="styles.slider">
            <Range
                id="peek"
                sizing="fill"
                ariaLabel="Peek at the other side"
                :min="NO_PEEK"
                :max="PERCENT"
                :step="PEEK_STEP"
                :value="Math.round(peekRatio * PERCENT)"
                @update:value="(value: number) => (peekRatio = value / PERCENT)"
            >
                <template #renderContent="renderProps">
                    <PageRangeContent :render-props="renderProps" :length="CARD_SIZE.width" />
                </template>
            </Range>
        </div>
    </PageFlipCardStack>
</template>
