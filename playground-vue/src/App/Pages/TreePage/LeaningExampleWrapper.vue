<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { TreeKnobs } from "@thewaver/ss-playground/App/Knobs/Trees.const";
import type { TreeFalloff } from "@thewaver/ss-playground/App/Pages/TreePage/TreeFalloffs.types";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import LeaningExample from "./Examples/Leaning.vue";
import type { TreeExampleProps } from "./TreePage.types";

const props = defineProps<TreeExampleProps>();

const value = useModel(props, "value");
const expanded = useModel(props, "expanded");

const falloff = shallowRef(TreeKnobs.STARTING_FALLOFF);
</script>

<template>
    <LeaningExample v-model:value="value" v-model:expanded="expanded" :falloff="falloff" />

    <PageExampleKnobs>
        <PageProp
            item-key="falloff"
            label="Falloff"
            hint="How the lean fades with distance from the pointer: smoothly, in a straight line, or sharply, so only the nearest items move."
        >
            <PageSelectField
                :value="falloff"
                :values="TreeKnobs.FALLOFFS"
                ariaLabel="Falloff"
                @change="(next: TreeFalloff) => (falloff = next)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
