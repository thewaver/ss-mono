<script setup lang="ts">
import { h, useModel } from "vue";

import { Toggle } from "@thewaver/ss-components-vue";
import type { BinarySwitchFlags, InteractionTooltipDefs } from "@thewaver/ss-components-vue";

import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.vue";
import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.vue";
import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { ToggleMixedExampleProps } from "../TogglePage.types";

type Props = ToggleMixedExampleProps;

const props = defineProps<Props>();

const all = useModel(props, "all");
const firstChild = useModel(props, "firstChild");
const secondChild = useModel(props, "secondChild");

const tooltipDefs: InteractionTooltipDefs<BinarySwitchFlags> = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs, flags }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () =>
                `Mixed while the two toggles on the right disagree, and clicking it sets both. A switch cannot announce "mixed", so this control drops role="switch" and reads as a mixed checkbox exactly while mixed. checkedState: ${String(flags.checkedState)}.`,
        ),
};

const setBoth = (isChecked: boolean) => {
    firstChild.value = isChecked;
    secondChild.value = isChecked;
};
</script>

<template>
    <PageControlRow>
        <Toggle
            id="allSettings"
            v-model:checked="all"
            :is-mixed="isMixed"
            ariaLabel="All settings"
            :tooltip-defs="tooltipDefs"
            @change="setBoth"
        >
            <template #renderContent="flags">
                <PageToggleContent :flags="flags" />
            </template>
        </Toggle>

        <PageControlRowLabel>controls</PageControlRowLabel>

        <Toggle id="firstSetting" v-model:checked="firstChild" ariaLabel="First setting">
            <template #renderContent="flags">
                <PageToggleContent :flags="flags" />
            </template>
        </Toggle>

        <Toggle v-model:checked="secondChild" ariaLabel="Second setting">
            <template #renderContent="flags">
                <PageToggleContent :flags="flags" />
            </template>
        </Toggle>
    </PageControlRow>
</template>
