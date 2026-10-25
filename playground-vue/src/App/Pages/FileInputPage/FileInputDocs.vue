<script setup lang="ts">
import { shallowRef } from "vue";

import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DropZoneDocsExample from "./Docs/DropZone.vue";
import ImagesDocsExample from "./Docs/Images.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import MultipleDocsExample from "./Docs/Multiple.vue";
import RefusingDocsExample from "./Docs/Refusing.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="hasError"
                label="Error"
                hint="Marks the control invalid, for screen readers as well as for the painter."
                controls="Sets FileInputProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the control off: pressing it opens no dialog, a dropped file is refused, and the Tab key skips it."
                controls="Sets FileInputProps.isDisabled"
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
        title="Several files"
        content="Set [prop]isMultiple[/prop] and the dialog lets several files be picked at once. The value is a list either way; without it, the list holds one file or none."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Multiple.vue`">
        <MultipleDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Only some kinds of file"
        content="The dialog offers only the kinds of file [prop]accept[/prop] names, here images. The control checks every file again as it arrives, since the dialog can be switched to show everything, so a file of another kind is refused rather than kept."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Images.vue`">
        <ImagesDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Refusing a pick"
        content="Every pick also runs [prop]onChange[/prop], and the control shows whatever its files then hold, so a pick can be refused by writing an empty list back. That is the place for a rule only you know, which no limit on the control can express. Here the files are bound for a system that cannot take a space in a name, so such a file is refused, the control shows its error, and the readout says why. Limits on type, size and count need no code: the control applies them itself, as the next section shows."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Refusing.vue`">
        <RefusingDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Dropping files, within limits"
        content="Files can also be dropped anywhere on the control, and arrive exactly as a pick does. Each arrival is checked against [prop]accept[/prop], then [prop]maxSizeBytes[/prop], then [prop]maxFiles[/prop]: the files that pass are kept, and the ones refused go to [prop]onReject[/prop] together, each with the limit it failed. The painter is told [prop]isDragOver[/prop] while files are held over the control, so it can show where they will land."
    />

    <PageDocsAlert severity="alert">
        Keep the control pressable, and say so in what it shows. A drop is a drag, which not everyone can make, so
        pressing the control to open the dialog must reach the same files (<a :href="WCAG_URLS['2.5.7']">WCAG 2.5.7</a
        >). Never cover the control with a drop area, or paint it as a place to drop alone.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/DropZone.vue`">
        <DropZoneDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Tooltip"
        content="Give a control [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the control's description. A disabled control shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and pressing it still opens nothing."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Keeps a disabled control's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled control shows no tooltip at all. It only matters while Disabled is on."
                controls="Sets FileInputProps.isReachableWhenDisabled"
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
                hint="Turns the control off: pressing it opens no dialog, a dropped file is refused, and the Tab key skips it."
                controls="Sets FileInputProps.isDisabled"
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
        content="Inside a Label, the control takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text opens the dialog."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Labeled.vue`">
        <LabeledDocsExample />
    </PageDocsExample>
</template>
