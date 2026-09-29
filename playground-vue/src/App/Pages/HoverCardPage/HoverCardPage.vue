<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { HOVER_CARD_DEFAULTS } from "@thewaver/ss-components-vue";
import { HoverCardKnobs } from "@thewaver/ss-playground/App/Knobs/HoverCards.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import NavigationMenuExample from "./Examples/NavigationMenu.vue";
import ProfileExample from "./Examples/Profile.vue";

const EXAMPLES_ROOT = "/src/App/Pages/HoverCardPage/Examples";

const FIELD_WIDTH = 110;

const offsetY = shallowRef(HoverCardKnobs.STARTING_OFFSET_Y);
const transitionDurationMs = shallowRef(HOVER_CARD_DEFAULTS.transitionDurationMs);
const focusShowDelayMs = shallowRef(HOVER_CARD_DEFAULTS.focusShowDelayMs);
const hoverShowDelayMs = shallowRef(HOVER_CARD_DEFAULTS.hoverShowDelayMs);
const skipDelayWindowMs = shallowRef(HOVER_CARD_DEFAULTS.skipDelayWindowMs);

const visibility = shallowRef(false);
const following = shallowRef(false);
const openKey = shallowRef<string | undefined>();

const offset = computed(() => ({ x: 0, y: offsetY.value }));

const examples: ExampleDefs[] = [
    {
        key: "profile",
        name: "A profile card",
        readout: () =>
            `open: ${visibility.value}, following: ${following.value} — rest on the name, or tab to it and wait, then Tab again to reach the button and the link; Escape brings focus back to the name`,
        path: `${EXAMPLES_ROOT}/Profile.vue`,
    },
    {
        key: "navigation",
        name: "A navigation menu",
        readout: () =>
            `open: ${openKey.value ?? "none"} — each flyout is a popup trigger over a popover, opened by a press or by resting on it through the same hover engine; only one is open at a time`,
        path: `${EXAMPLES_ROOT}/NavigationMenu.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="offsetY"
            label="Offset down (px)"
            hint="How far the card is held clear of its anchor. The gap is bridged, so the pointer can cross it without losing the card."
        >
            <PageNumberField
                :value="offsetY"
                :min="HoverCardKnobs.MIN_OFFSET"
                :max="HoverCardKnobs.MAX_OFFSET"
                :step="HoverCardKnobs.OFFSET_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Offset down"
                @input="(value: number) => (offsetY = value)"
            />
        </PageProp>

        <PageProp item-key="transitionDurationMs" label="Fade (ms)" hint="How long the card takes to fade in and out.">
            <PageNumberField
                :value="transitionDurationMs"
                :min="HoverCardKnobs.MIN_DURATION"
                :max="HoverCardKnobs.MAX_DURATION"
                :step="HoverCardKnobs.DURATION_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Fade in milliseconds"
                @input="(value: number) => (transitionDurationMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="focusShowDelayMs"
            label="Focus delay (ms)"
            hint="How long a keyboard focus has to rest on the anchor before the card opens."
        >
            <PageNumberField
                :value="focusShowDelayMs"
                :min="HoverCardKnobs.MIN_DURATION"
                :max="HoverCardKnobs.MAX_DURATION"
                :step="HoverCardKnobs.DURATION_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Focus delay in milliseconds"
                @input="(value: number) => (focusShowDelayMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="hoverShowDelayMs"
            label="Hover delay (ms)"
            hint="How long the pointer has to rest on the anchor before the card or a flyout opens. Leave before then and nothing opens."
        >
            <PageNumberField
                :value="hoverShowDelayMs"
                :min="HoverCardKnobs.MIN_DURATION"
                :max="HoverCardKnobs.MAX_DURATION"
                :step="HoverCardKnobs.DURATION_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Hover delay in milliseconds"
                @input="(value: number) => (hoverShowDelayMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="skipDelayWindowMs"
            label="Skip window (ms)"
            hint="How soon after one closes a hover opens the next at once. Open one flyout, then move to the other."
        >
            <PageNumberField
                :value="skipDelayWindowMs"
                :min="HoverCardKnobs.MIN_DURATION"
                :max="HoverCardKnobs.MAX_DURATION"
                :step="HoverCardKnobs.DURATION_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Skip window in milliseconds"
                @input="(value: number) => (skipDelayWindowMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #profile>
            <ProfileExample
                v-model:visibility="visibility"
                v-model:following="following"
                :offset="offset"
                :transition-duration-ms="transitionDurationMs"
                :focus-show-delay-ms="focusShowDelayMs"
                :hover-show-delay-ms="hoverShowDelayMs"
                :skip-delay-window-ms="skipDelayWindowMs"
            />
        </template>

        <template #navigation>
            <NavigationMenuExample
                v-model:openKey="openKey"
                :hover-show-delay-ms="hoverShowDelayMs"
                :skip-delay-window-ms="skipDelayWindowMs"
            />
        </template>
    </PageExamples>
</template>
