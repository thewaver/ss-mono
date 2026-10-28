<script setup lang="ts">
import { shallowRef } from "vue";

import { BracketKnobs } from "@thewaver/ss-playground/App/Knobs/Brackets.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import type { BracketFamilyExampleProps } from "./BracketPage.types";
import FamilyExample from "./Examples/Family.vue";

const props = defineProps<Omit<BracketFamilyExampleProps, "isSnappingToFamily">>();

const isSnapping = shallowRef(BracketKnobs.STARTING_IS_SNAPPING_TO_FAMILY);
</script>

<template>
    <FamilyExample v-bind="props" :is-snapping-to-family="isSnapping" />

    <PageExampleKnobs>
        <PageProp
            item-key="isSnappingToFamily"
            controls="Sets BracketProps.isSnappingToFamily"
            label="Snap to family"
            hint="Glides the window to frame the family in it once a drag, a pinch or the wheel is over."
        >
            <PageCheckField
                :value="isSnapping"
                ariaLabel="Snap to family"
                @change="(value: boolean) => (isSnapping = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
