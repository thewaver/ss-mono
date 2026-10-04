<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { PlacementLayoutUtils, ProximityUtils, Tree } from "@thewaver/ss-components-vue";
import type { ProximityEffectFn } from "@thewaver/ss-components-vue";
import { MathUtils } from "@thewaver/ss-utils";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { FILES } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Falloff = "smooth" | "linear" | "sharp";

const FALLOFFS: Falloff[] = ["smooth", "linear", "sharp"];
const REACH_ITEMS = 2.5;
const SHIFT_PERCENT = 8;
const BRIGHTEN_PERCENT = 60;
const FULL_PERCENT = 100;
const SHARP_POWER = 3;

const COLUMN = PlacementLayoutUtils.createColumn({ itemWidthRatio: 0.9, itemHeightRatio: 0.14, gapRatio: 0.15 });

const toStrength = (falloff: Falloff, distance: number, reach: number) => {
    const linear = MathUtils.clamp01(1 - distance / reach);

    if (falloff === "linear") return linear;
    if (falloff === "sharp") return linear ** SHARP_POWER;

    return ProximityUtils.getDistanceFalloff(distance, reach);
};

type Props = TreeExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const expanded = useModel(props, "expanded");

const falloff = shallowRef<Falloff>("smooth");

const computeEffect: ProximityEffectFn = (defs) => {
    const strength = toStrength(falloff.value, defs.distance, defs.spacing * REACH_ITEMS);

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

    <PageExampleKnobs>
        <PageProp
            item-key="falloff"
            label="Falloff"
            hint="How the lean fades with distance from the pointer: smoothly, in a straight line, or sharply, so only the nearest items move."
        >
            <PageSelectField
                :value="falloff"
                :values="FALLOFFS"
                ariaLabel="Falloff"
                @change="(next: Falloff) => (falloff = next)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
