<script setup lang="ts">
import { shallowRef } from "vue";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import ArcDocsExample from "./Docs/Arc.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DecoratedDocsExample from "./Docs/Decorated.vue";
import DisabledOptionDocsExample from "./Docs/DisabledOption.vue";
import RatingDocsExample from "./Docs/Rating.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SegmentedDocsExample from "./Docs/Segmented.vue";

const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="hasError"
                label="Error"
                hint="Marks the group and its radios invalid, for screen readers as well as for the painter."
                controls="Sets RadioGroupProps.hasError and RadioProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns every radio off: none can be picked, and the Tab key skips the group."
                controls="Sets RadioProps.isDisabled on every radio"
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
        content="Inside a box whose text runs right to left, the radios run from the right too, and the left arrow moves on to the next one, while up and down keep their meaning."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Segmented"
        content="Set [prop]orientation[/prop] to horizontal and the radios sit side by side; [prop]renderSelectionFloater[/prop] then draws a marker that slides to the picked one, which is the look of a segmented control."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Segmented.vue`">
        <SegmentedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A rating"
        content="Any value can stand behind a radio, numbers included, and the painter decides what each one looks like: here the stars fill up to the one under the pointer, or up to the pick."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Rating.vue`">
        <RatingDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Bent into an arc"
        content="Give the group [prop]computeLayout[/prop] and the radios are placed by a layout instead of laid in a row or a column, here along an arc. The arrow keys still walk them in the order they are written."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Arc.vue`">
        <ArcDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Decoration"
        content="Anything drawn over a radio goes through [prop]renderDecoration[/prop], which is handed the radio's state like the painter is: here a corner highlight marks the one picked."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Decorated.vue`">
        <DecoratedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A disabled option"
        content="One radio can be off while the rest work: the arrow keys skip it and it cannot be picked. Kept reachable when disabled, the arrow keys stop on it without picking it, so its tooltip can say why it is off."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/DisabledOption.vue`">
        <DisabledOptionDocsExample :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="isReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Lets the arrow keys stop on the disabled radio, which then shows its tooltip."
                controls="Sets RadioProps.isReachableWhenDisabled"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
