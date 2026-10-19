<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import { TagInputKnobs } from "@thewaver/ss-playground/App/Knobs/TagInputs.const";
import {
    CROWDED_TAGS,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    NARROW_WIDTH,
    STARTING_TAGS,
} from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";

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
        name: EXAMPLE_NAMES.default,
        readout: () => `tags: ${defaultTags.value.join(", ") || "none"}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "empty",
        name: EXAMPLE_NAMES.empty,
        readout: () => `tags: ${emptyTags.value.join(", ") || "none"}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "unique",
        name: EXAMPLE_NAMES.unique,
        readout: () => `tags: ${uniqueTags.value.join(", ") || "none"} — the same word twice is refused`,
        path: `${EXAMPLES_ROOT}/Unique.vue`,
    },
    {
        key: "crowded",
        name: EXAMPLE_NAMES.crowded,
        readout: () => `${crowdedTags.value.length} tags in ${NARROW_WIDTH}px — they wrap and the box grows with them`,
        path: `${EXAMPLES_ROOT}/Crowded.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="isDisabled"
            controls="Sets TagInputProps.isDisabled"
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
            controls="Sets TagInputProps.hasError"
            label="Error"
            hint="Puts the field into its error look, without changing what it accepts."
        >
            <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
        </PageProp>

        <PageProp
            item-key="tags"
            controls="Writes the starting tags back to TagInputProps.value"
            label="Tags"
            hint="Puts the examples back to the tags they started with."
        >
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
