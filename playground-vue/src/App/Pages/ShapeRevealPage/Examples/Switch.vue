<script setup lang="ts">
import { nextTick, shallowRef } from "vue";

import { Button, ShapeRevealUtils } from "@thewaver/ss-components-vue";
import { ShapeRevealKnobs } from "@thewaver/ss-playground/App/Knobs/ShapeReveals.const";
import {
    NEXT_PANEL,
    PANEL_LINES,
    PANEL_TITLES,
    STARTING_PANEL,
    SWITCH_ID,
    toComputePoints,
} from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.css";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { ShapeRevealExampleProps } from "../ShapeRevealPage.types";

type Props = ShapeRevealExampleProps;

const props = defineProps<Props>();

const panel = shallowRef(STARTING_PANEL);

const switchPanel = async () => {
    const shape = props.shape;
    const origin = props.origin;
    const next = NEXT_PANEL[panel.value];

    const hasAnimated = await ShapeRevealUtils.reveal(
        async () => {
            panel.value = next;
            await nextTick();
        },
        {
            origin: origin === ShapeRevealKnobs.BUTTON ? (document.getElementById(SWITCH_ID) ?? undefined) : origin,
            durationMs: props.durationMs,
            blur: props.blur,
            computePoints: toComputePoints(shape),
        },
    );

    props.onRun({ shape, origin, hasAnimated, panel: next });
};
</script>

<template>
    <div :class="styles.stage">
        <div :class="[styles.panel, panel === 'dawn' ? styles.panelDawn : styles.panelDusk]">
            <span :class="styles.panelTitle">{{ PANEL_TITLES[panel] }}</span>
            <span :class="styles.panelLine">{{ PANEL_LINES[panel] }}</span>
        </div>

        <Button :id="SWITCH_ID" @click="switchPanel">
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags">Switch</PageControlButtonContent>
            </template>
        </Button>
    </div>
</template>
