<script setup lang="ts">
import { shallowRef } from "vue";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import PickerDocsExample from "./Docs/Picker.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const isDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the square off: neither a press, a drag nor the arrow keys move it, and the Tab key skips both of its sliders."
                controls="Sets ColorAreaProps.isDisabled"
            >
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the square stays as it is. It is a picture of color rather than text, so saturation still grows to the right and brightness upward, and the right arrow still moves the handle right, as it does on screen."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A picker built around it"
        content="The square moves saturation and brightness and nothing else, so a picker adds the rest around it. Here a button opens a dialog holding the square, a Range for the hue and a field for each channel, all reading and writing one [prop]hsv[/prop] signal. The button says what it opens through [prop]ariaHasPopup[/prop] and whether it is open through [prop]ariaExpanded[/prop], so a screen reader hears both before and after the press. ColorInput is this picker ready-made."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Picker.vue`">
        <PickerDocsExample />
    </PageDocsExample>
</template>
