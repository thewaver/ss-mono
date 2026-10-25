<script setup lang="ts">
import { shallowRef } from "vue";

import { IMAGE_SWITCHER_DEFAULTS } from "@thewaver/ss-components-vue";
import { ImageSwitcherKnobs } from "@thewaver/ss-playground/App/Knobs/ImageSwitchers.const";
import {
    DOCS_ROOT,
    MISSING_SRC,
    SOURCE_ALTS,
} from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.const";
import type { SourceType } from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.types";
import knight_date from "@thewaver/ss-playground/App/knight_date.webp";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";

const SOURCE_URLS: Record<SourceType, string | undefined> = {
    profile: knight_profile,
    date: knight_date,
    missing_file: MISSING_SRC,
    none: undefined,
};

const sourceType = shallowRef<SourceType>(ImageSwitcherKnobs.STARTING_SOURCE_TYPE);
const transitionDurationMs = shallowRef(IMAGE_SWITCHER_DEFAULTS.transitionDurationMs);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :src="SOURCE_URLS[sourceType]"
            :alt="SOURCE_ALTS[sourceType]"
            :transition-duration-ms="transitionDurationMs"
        />

        <template #renderKnobs>
            <PageProp
                item-key="sourceType"
                label="Source"
                hint="Which picture to show. Switching crossfades from the old one once the new one has loaded; missing_file points at a file that does not exist, and none passes no source at all."
                controls="Picks the example picture sent to ImageSwitcherProps.src and ImageSwitcherProps.alt"
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
                controls="Sets ImageSwitcherProps.transitionDurationMs"
            >
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="ImageSwitcherKnobs.MIN_DURATION_MS"
                    :max="ImageSwitcherKnobs.MAX_DURATION_MS"
                    :step="ImageSwitcherKnobs.DURATION_STEP_MS"
                    ariaLabel="Transition duration in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
