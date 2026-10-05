<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { ImageSwitcherProps } from "@thewaver/ss-components-vue";
import { IMAGE_SWITCHER_DEFAULTS } from "@thewaver/ss-components-vue";
import { ImageSwitcherKnobs } from "@thewaver/ss-playground/App/Knobs/ImageSwitchers.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.css";
import type { SourceType } from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.types";
import knight_date from "@thewaver/ss-playground/App/knight_date.webp";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExampleWrapper from "./DefaultExampleWrapper.vue";

const MISSING_SRC = "missing_image.webp";

const SOURCE_URLS: Record<SourceType, string | undefined> = {
    profile: knight_profile,
    date: knight_date,
    missing_file: MISSING_SRC,
    none: undefined,
};

const SOURCE_ALTS: Record<SourceType, string | undefined> = {
    profile: "A knight in profile",
    date: "A knight on a date",
    missing_file: "A picture that will not load",
    none: undefined,
};

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/ImageSwitcherPage/Examples/Default.vue";

const sourceType = shallowRef<SourceType>(ImageSwitcherKnobs.STARTING_SOURCE_TYPE);
const transitionDurationMs = shallowRef(IMAGE_SWITCHER_DEFAULTS.transitionDurationMs);
const loadCount = shallowRef(0);
const loadedName = shallowRef("none");

const onLoad = (e: Event) => {
    const loaded = (e.target as HTMLImageElement).src;

    loadCount.value++;
    loadedName.value = loaded.slice(loaded.lastIndexOf("/") + 1);
};

const commonProps = computed<ImageSwitcherProps>(() => ({
    src: SOURCE_URLS[sourceType.value],
    alt: SOURCE_ALTS[sourceType.value],
    transitionDurationMs: transitionDurationMs.value,
    onLoad,
}));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `loads: ${loadCount.value} | last loaded: ${loadedName.value}`,
        path: DEFAULT_EXAMPLE_PATH,
    },
];
</script>

<template>
    <div :class="styles.root">
        <PagePropsPanel scope="global">
            <PageProp
                item-key="sourceType"
                label="Source"
                hint="Where the pictures come from, which is what decides how long each one takes to load."
            >
                <PageSelectField
                    :value="sourceType"
                    :values="ImageSwitcherKnobs.SOURCE_TYPES"
                    ariaLabel="Source"
                    @change="(value: SourceType) => (sourceType = value)"
                />
            </PageProp>

            <PageProp
                item-key="transitionDurationMs"
                label="Transition duration (ms)"
                hint="How long the crossfade from one picture to the next takes."
            >
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="ImageSwitcherKnobs.MIN_DURATION_MS"
                    :max="ImageSwitcherKnobs.MAX_DURATION_MS"
                    :step="ImageSwitcherKnobs.DURATION_STEP_MS"
                    ariaLabel="Transition duration"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>
        </PagePropsPanel>

        <PageExamples :items="examples" layout="flow">
            <template #default>
                <DefaultExampleWrapper v-bind="commonProps" />
            </template>
        </PageExamples>
    </div>
</template>
