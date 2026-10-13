<script setup lang="ts">
import { shallowRef } from "vue";

import { RICH_TEXT_DEFAULTS, TextArea } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    MAX_ROWS,
    MIN_ROWS,
    PREVIEW_WIDTH,
    STARTING_CONTENT,
} from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import CustomInputExample from "./Examples/CustomInput.vue";
import CustomTagsExample from "./Examples/CustomTags.vue";
import DefaultTagsExample from "./Examples/DefaultTags.vue";
import GlossaryExample from "./Examples/Glossary.vue";
import LinksExample from "./Examples/Links.vue";

const content = shallowRef(STARTING_CONTENT);
const removeOtherTags = shallowRef(RICH_TEXT_DEFAULTS.removeOtherTags);

const examples: ExampleDefs[] = [
    {
        key: "defaultTags",
        name: EXAMPLE_NAMES.defaultTags,
        path: `${EXAMPLES_ROOT}/DefaultTags.vue`,
    },
    {
        key: "customTags",
        name: EXAMPLE_NAMES.customTags,
        path: `${EXAMPLES_ROOT}/CustomTags.vue`,
    },
    {
        key: "glossary",
        name: EXAMPLE_NAMES.glossary,
        path: `${EXAMPLES_ROOT}/Glossary.vue`,
    },
    {
        key: "links",
        name: EXAMPLE_NAMES.links,
        path: `${EXAMPLES_ROOT}/Links.vue`,
    },
    {
        key: "customInput",
        name: EXAMPLE_NAMES.customInput,
        path: `${EXAMPLES_ROOT}/CustomInput.vue`,
    },
];
</script>

<template>
    <div :class="styles.root">
        <PagePropsPanel scope="global">
            <PageProp
                item-key="removeOtherTags"
                label="Remove other tags"
                hint="Strips any tag the editor was not told to keep, rather than leaving it in the markup untouched."
            >
                <PageCheckField
                    :value="removeOtherTags"
                    ariaLabel="Remove other tags"
                    @change="(value: boolean) => (removeOtherTags = value)"
                />
            </PageProp>
        </PagePropsPanel>

        <PageExamples :items="examples" layout="flow">
            <template #defaultTags>
                <DefaultTagsExample />
            </template>

            <template #customTags>
                <CustomTagsExample />
            </template>

            <template #glossary>
                <GlossaryExample />
            </template>

            <template #links>
                <LinksExample />
            </template>

            <template #customInput>
                <TextArea
                    v-model:value="content"
                    is-auto-sizing
                    :min-rows="MIN_ROWS"
                    :max-rows="MAX_ROWS"
                    :padding="FIELD_PADDING"
                    :gap="FIELD_GAP"
                    ariaLabel="Tagged text"
                    :compute-text-style="computePageTextFieldTextStyle"
                >
                    <template #renderContent="flags">
                        <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" is-stretched />
                    </template>

                    <template #renderPlaceholder="{ flags }">
                        <PageTextFieldPlaceholder :flags="flags" is-top-aligned>
                            Write something with tags in it
                        </PageTextFieldPlaceholder>
                    </template>
                </TextArea>

                <PageMeasureBox :width="PREVIEW_WIDTH" :padding="MEASURE_BOX_PADDING">
                    <CustomInputExample :content="content" :remove-other-tags="removeOtherTags" />
                </PageMeasureBox>
            </template>
        </PageExamples>
    </div>
</template>
