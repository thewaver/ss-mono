<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.css";

import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import { provideFieldReset } from "../Field/Field.context";
import { useIsPreview } from "../Preview/Preview.context";
import PageProp from "../Prop/Prop.vue";
import { providePropsPanelContext } from "./PropsPanel.context";
import type { PagePropsPanelProps } from "./PropsPanel.types";

const NOTHING_TO_RESET = 0;
const SAMPLE_SELECTOR_ALONE = 1;

const props = defineProps<PagePropsPanelProps>();

const isPreview = useIsPreview();

const resets = shallowRef<(() => void)[]>([]);

provideFieldReset({
    register: (reset) => {
        resets.value = [...resets.value, reset];

        return () => {
            resets.value = resets.value.filter((entry) => entry !== reset);
        };
    },
});

providePropsPanelContext({
    get scope() {
        return props.scope;
    },
});

const isSampleScope = computed(() => props.scope === "sample");

const leastToReset = computed(() => (isSampleScope.value ? SAMPLE_SELECTOR_ALONE : NOTHING_TO_RESET));

const resettable = computed(() => (isSampleScope.value ? resets.value.slice(SAMPLE_SELECTOR_ALONE) : resets.value));

const resetAll = () => {
    resettable.value.forEach((reset) => reset());
};
</script>

<template>
    <div v-if="!isPreview" :class="styles.propsPanelScopeVariants[scope]" :data-panel="scope">
        <slot />

        <PageProp
            v-if="resets.length > leastToReset"
            item-key="resetPanel"
            label="These controls"
            hint="Puts every control in this panel back to the value it started at."
        >
            <Button @click="resetAll">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Reset</PageButtonContent>
                </template>
            </Button>
        </PageProp>
    </div>
</template>
