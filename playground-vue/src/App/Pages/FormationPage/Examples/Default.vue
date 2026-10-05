<script setup lang="ts">
import { computed } from "vue";

import { Formation, PlacementLayoutUtils, ProximityEffectUtils } from "@thewaver/ss-components-vue";

import PageFormationItem from "../../../StyledComponents/FormationContent/FormationContent.vue";
import type { FormationExampleProps } from "../FormationPage.types";

type Props = FormationExampleProps;

const props = defineProps<Props>();

const computeLayout = computed(() => PlacementLayoutUtils.toLayoutFn(props.layoutEntry));

const computeEffect = computed(() =>
    props.effectEntry === undefined ? undefined : ProximityEffectUtils.toEffectFn(props.effectEntry),
);
</script>

<template>
    <Formation
        :items="items"
        :is-stacked-in-reverse="isStackedInReverse"
        :transition-duration-ms="transitionDurationMs"
        :transition-delay-ms="transitionDelayMs"
        :compute-layout="computeLayout"
        :compute-effect="computeEffect"
    >
        <template #renderItem="{ item, state }">
            <PageFormationItem :state="state" :shape-kind="shapeKind">{{ item }}</PageFormationItem>
        </template>
    </Formation>
</template>
