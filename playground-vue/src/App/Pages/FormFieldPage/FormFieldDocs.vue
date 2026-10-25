<script setup lang="ts">
import { shallowRef } from "vue";

import type { FormFieldOrientation } from "@thewaver/ss-components-vue";
import { FORM_FIELD_DEFAULTS, FORM_FIELD_ORIENTATIONS } from "@thewaver/ss-components-vue";
import { FormFieldKnobs } from "@thewaver/ss-playground/App/Knobs/FormFields.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageTextField from "../../PageComponents/Field/PageTextField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import ForeignDocsExample from "./Docs/Foreign.vue";
import InFormDocsExample from "./Docs/InForm.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const FOREIGN_CONTENT =
    "The library's own controls find the field's caption and message by themselves. A control of your own, here a plain input, gets the same wiring from two calls: FormFieldVueUtils.useAriaLabelledBy answers with the caption's id to put in its aria-labelledby, which names it, and FormFieldVueUtils.useAriaDescribedBy with the message's id to put in its aria-describedby, or with nothing while there is no message.";

const orientation = shallowRef<FormFieldOrientation>(FORM_FIELD_DEFAULTS.orientation);
const gap = shallowRef(FORM_FIELD_DEFAULTS.gap);
const message = shallowRef(FormFieldKnobs.STARTING_MESSAGE);
const isRequired = shallowRef(false);
const hasError = shallowRef(FormFieldKnobs.STARTING_HAS_ERROR);
const inFormHasError = shallowRef(true);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :orientation="orientation"
            :gap="gap"
            :message="message"
            :is-required="isRequired"
            :has-error="hasError"
        />

        <template #renderKnobs>
            <PageProp
                item-key="orientation"
                label="Orientation"
                hint="Whether the caption sits above the control or beside it."
                controls="Sets FormFieldProps.orientation"
            >
                <PageSelectField
                    :value="orientation"
                    :values="FORM_FIELD_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: FormFieldOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp
                item-key="gap"
                label="Gap (px)"
                hint="The space between the caption, the control and the message."
                controls="Sets FormFieldProps.gap"
            >
                <PageNumberField
                    :value="gap"
                    :min="FormFieldKnobs.MIN_GAP"
                    :max="FormFieldKnobs.MAX_GAP"
                    :step="FormFieldKnobs.GAP_STEP"
                    ariaLabel="Gap in pixels"
                    @input="(value: number) => (gap = value)"
                />
            </PageProp>

            <PageProp
                item-key="message"
                label="Message"
                hint="The line shown under the control. Leave it empty and no line is rendered at all."
                controls="Sets FormFieldProps.message"
            >
                <PageTextField
                    :value="message"
                    placeholder="No message"
                    ariaLabel="Message"
                    @input="(value: string) => (message = value)"
                />
            </PageProp>

            <PageProp
                item-key="isRequired"
                label="Required"
                hint="Tells screen readers a value is expected, and hands the caption the state to mark it. Nothing is enforced."
                controls="Sets FormFieldProps.isRequired"
            >
                <PageCheckField
                    :value="isRequired"
                    ariaLabel="Required"
                    @change="(value: boolean) => (isRequired = value)"
                />
            </PageProp>

            <PageProp
                item-key="hasError"
                label="Error"
                hint="Puts the field into its error look and reads the message out as the error rather than as help."
                controls="Sets FormFieldProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the caption, the field and the message line up on the right, and what is typed starts from the right of the field. With [prop]orientation[/prop] set to horizontal, the caption sits to the right of the field instead."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection title="Around a control of your own" :content="FOREIGN_CONTENT" />

    <PageDocsExample :path="`${DOCS_ROOT}/Foreign.vue`">
        <ForeignDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Inside a form"
        content="A field inside a Form reports to it, so the form's [prop]isValid[/prop] is false while the field's [prop]hasError[/prop] is on, and the line under the button says so; nothing here hands the field's state to the form. Saving while the error is on moves focus to the field."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/InForm.vue`">
        <InFormDocsExample :has-error="inFormHasError" />

        <template #renderKnobs>
            <PageProp
                item-key="inFormHasError"
                label="Error"
                hint="Puts the field in error, which the form hears without being told."
                controls="Sets FormFieldProps.hasError"
            >
                <PageCheckField
                    :value="inFormHasError"
                    ariaLabel="Error"
                    @change="(value: boolean) => (inFormHasError = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
