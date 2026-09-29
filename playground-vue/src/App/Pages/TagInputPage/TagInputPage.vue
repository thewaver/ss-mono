<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import { TagInputKnobs } from "@thewaver/ss-playground/App/Knobs/TagInputs.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import CrowdedExample from "./Examples/Crowded.vue";
import DefaultExample from "./Examples/Default.vue";
import UniqueExample from "./Examples/Unique.vue";
import type { TagInputExampleProps } from "./TagInputPage.types";

const NARROW_WIDTH = 240;
const EXAMPLES_ROOT = "/src/App/Pages/TagInputPage/Examples";

const STARTING_TAGS = ["solid", "vanilla-extract"];
const CROWDED_TAGS = [
    "solid",
    "vanilla-extract",
    "playwright",
    "typescript",
    "vite",
    "eslint",
    "prettier",
    "vitest",
    "aria",
    "tokens",
    "signals",
    "stores",
];

const isDisabled = shallowRef(TagInputKnobs.STARTING_IS_DISABLED);
const hasError = shallowRef(TagInputKnobs.STARTING_HAS_ERROR);

const defaultTags = shallowRef(STARTING_TAGS);
const uniqueTags = shallowRef(STARTING_TAGS);
const crowdedTags = shallowRef(CROWDED_TAGS);
const emptyTags = shallowRef<string[]>([]);

const reset = () => {
    defaultTags.value = STARTING_TAGS;
    uniqueTags.value = STARTING_TAGS;
    crowdedTags.value = CROWDED_TAGS;
    emptyTags.value = [];
};

const commonProps = computed<Omit<TagInputExampleProps, "value" | "onUpdate:value">>(() => ({
    isDisabled: isDisabled.value,
    hasError: hasError.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `tags: ${defaultTags.value.join(", ") || "none"}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "empty",
        name: "Empty",
        readout: () => `tags: ${emptyTags.value.join(", ") || "none"}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "unique",
        name: "Refusing duplicates",
        readout: () => `tags: ${uniqueTags.value.join(", ") || "none"} — the same word twice is refused`,
        path: `${EXAMPLES_ROOT}/Unique.vue`,
    },
    {
        key: "crowded",
        name: "Crowded and narrow",
        readout: () => `${crowdedTags.value.length} tags in ${NARROW_WIDTH}px — they wrap and the box grows with them`,
        path: `${EXAMPLES_ROOT}/Crowded.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Turns the field off: no tag can be added, and none can be removed."
        >
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>

        <PageProp
            item-key="hasError"
            label="Error"
            hint="Puts the field into its error look, without changing what it accepts."
        >
            <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
        </PageProp>

        <PageProp item-key="tags" label="Tags" hint="Puts the examples back to the tags they started with.">
            <Button @click="async () => reset()">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Reset</PageButtonContent>
                </template>
            </Button>
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-bind="commonProps" v-model:value="defaultTags" />
        </template>

        <template #empty>
            <DefaultExample v-bind="commonProps" v-model:value="emptyTags" ariaLabel="Empty topics" />
        </template>

        <template #unique>
            <UniqueExample v-bind="commonProps" v-model:value="uniqueTags" />
        </template>

        <template #crowded>
            <CrowdedExample v-bind="commonProps" v-model:value="crowdedTags" />
        </template>
    </PageExamples>
</template>
