<script setup lang="ts">
import { shallowRef } from "vue";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import CrowdedDocsExample from "./Docs/Crowded.vue";
import EmptyDocsExample from "./Docs/Empty.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";
import UniqueDocsExample from "./Docs/Unique.vue";

const NAMING_CONTENT =
    'A tag is a button, and pressing it removes it. Its visible word alone does not say that, so a screen reader would hear only "solid, button" and not what the button is for ([wcag id="2.4.6"]WCAG 2.4.6[/wcag]). Every example here names its tags through [prop]computeTagAriaLabel[/prop], which is handed the tag and answers in the page\'s language: here "solid, remove". The tag\'s own word comes first, so someone speaking to their computer can still say what they see ([wcag id="2.5.3"]WCAG 2.5.3[/wcag]).';

const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsSection title="Naming each tag" :content="NAMING_CONTENT" />

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="hasError"
                label="Error"
                hint="Marks the field invalid, for screen readers as well as for the painter."
                controls="Sets TagInputProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the field off: no tag can be added, none can be removed, and the Tab key skips it."
                controls="Sets TagInputProps.isDisabled"
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
        title="Placeholder"
        content="While the field holds no tags and nothing is typed, it draws [prop]renderPlaceholder[/prop]; the first letter typed hides it, and so does a tag."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Empty.vue`">
        <EmptyDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Refusing a word"
        content="Every word passes through [prop]computeTag[/prop] before it becomes a tag, which can trim it, change it, or refuse it by answering with nothing. Here words are trimmed and lower-cased, and one already in the list is refused and stays in the field to be edited."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Unique.vue`">
        <UniqueDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Many tags in a narrow box"
        content="Tags that do not fit on one line wrap onto the next, and the box grows to hold them: nothing is cut off and nothing scrolls. The field always takes a row of its own beneath the tags."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Crowded.vue`">
        <CrowdedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the tags run from the right, and the arrows are mirrored: from the empty field the right arrow steps back into the tags, and the left arrow walks back toward the field."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Tooltip"
        content="Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and typing still changes nothing."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                controls="Sets TagInputProps.isReachableWhenDisabled"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp
                item-key="tooltipIsDisabled"
                label="Disabled"
                hint="Turns the field off: no tag can be added, none can be removed, and the Tab key skips it."
                controls="Sets TagInputProps.isDisabled"
            >
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Named by a Label"
        content="Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Labeled.vue`">
        <LabeledDocsExample />
    </PageDocsExample>
</template>
