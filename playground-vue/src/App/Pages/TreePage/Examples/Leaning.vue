<script setup lang="ts">
import { useModel } from "vue";

import { PlacementLayoutUtils, ProximityUtils, Tree } from "@thewaver/ss-components-vue";
import type { ProximityEffectFn } from "@thewaver/ss-components-vue";
import type { TreeFalloff } from "@thewaver/ss-playground/App/Pages/TreePage/TreeFalloffs.types";
import { MathUtils } from "@thewaver/ss-utils";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import type { TreeLeaningExampleProps } from "../TreePage.types";
import { FILES } from "../TreePageVue.const";

const REACH_ITEMS = 2.5;
const SHIFT_PERCENT = 8;
const BRIGHTEN_PERCENT = 60;
const FULL_PERCENT = 100;
const SHARP_POWER = 3;

const COLUMN = PlacementLayoutUtils.createColumn({ itemWidthRatio: 0.9, itemHeightRatio: 0.14, gapRatio: 0.15 });

const toStrength = (falloff: TreeFalloff, distance: number, reach: number) => {
    const linear = MathUtils.clamp01(1 - distance / reach);

    if (falloff === "linear") return linear;
    if (falloff === "sharp") return linear ** SHARP_POWER;

    return ProximityUtils.getDistanceFalloff(distance, reach);
};

type Props = TreeLeaningExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const expanded = useModel(props, "expanded");

const computeEffect: ProximityEffectFn = (defs) => {
    const strength = toStrength(props.falloff, defs.distance, defs.spacing * REACH_ITEMS);

    return { translateX: strength * SHIFT_PERCENT, brightness: FULL_PERCENT + strength * BRIGHTEN_PERCENT };
};
</script>

<template>
    <Tree
        v-model:value="value"
        v-model:expanded="expanded"
        :nodes="FILES"
        ariaLabel="Leaning repository"
        :compute-layout="COLUMN"
        :compute-effect="computeEffect"
    >
        <template #renderNode="{ node, renderProps }">
            <PageTreeNodeContent is-gliding :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>
    </Tree>
</template>
