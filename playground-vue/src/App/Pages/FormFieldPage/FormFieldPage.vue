<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { FormFieldOrientation } from "@thewaver/ss-components-vue";
import { FORM_FIELD_DEFAULTS, FORM_FIELD_ORIENTATIONS } from "@thewaver/ss-components-vue";
import { FormFieldKnobs } from "@thewaver/ss-playground/App/Knobs/FormFields.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageTextField from "../../PageComponents/Field/PageTextField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExample from "./Examples/Default.vue";
import ForeignExample from "./Examples/Foreign.vue";
import InFormExample from "./Examples/InForm.vue";
import type { FormFieldExampleProps } from "./FormFieldPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/FormFieldPage/Examples";

const FIELD_WIDTH = 110;
const MESSAGE_WIDTH = 240;

const orientation = shallowRef<FormFieldOrientation>(FORM_FIELD_DEFAULTS.orientation);
const gap = shallowRef(FORM_FIELD_DEFAULTS.gap);
const message = shallowRef(FormFieldKnobs.STARTING_MESSAGE);
const hasError = shallowRef(FormFieldKnobs.STARTING_HAS_ERROR);

const defaultValue = shallowRef("");
const foreignValue = shallowRef("");
const formValue = shallowRef("");

const commonProps = computed<Omit<FormFieldExampleProps, "value" | "onUpdate:value">>(() => ({
    orientation: orientation.value,
    gap: gap.value,
    message: message.value,
    hasError: hasError.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Around a control of the library's",
        readout: () =>
            message.value.length > 0
                ? "the message has an id of its own and the control inside is pointed at it, without either of them being told the other's name"
                : "with no message there is no element and no reference — an empty message is not an empty box",
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "foreign",
        name: "Around a control it has never seen",
        readout: () =>
            "a plain input, which knows nothing about any of this — one call to FormFieldVueUtils.useAriaDescribedBy gets it the same wiring the library's own controls get for free",
        path: `${EXAMPLES_ROOT}/Foreign.vue`,
    },
    {
        key: "inForm",
        name: "Inside a form",
        readout: () =>
            "turn the error on — the field tells the form, and the form's own validity is what disables the button; nothing here reads the other's state directly",
        path: `${EXAMPLES_ROOT}/InForm.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="orientation"
            label="Orientation"
            hint="Whether the label sits above the control or beside it."
        >
            <PageSelectField
                :value="orientation"
                :values="FORM_FIELD_ORIENTATIONS"
                :width="FIELD_WIDTH"
                ariaLabel="Orientation"
                @change="(value: FormFieldOrientation) => (orientation = value)"
            />
        </PageProp>

        <PageProp item-key="gap" label="Gap (px)" hint="The space between the label, the control and the message.">
            <PageNumberField
                :value="gap"
                :min="FormFieldKnobs.MIN_GAP"
                :max="FormFieldKnobs.MAX_GAP"
                :step="FormFieldKnobs.GAP_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Gap in pixels"
                @input="(value: number) => (gap = value)"
            />
        </PageProp>

        <PageProp
            item-key="message"
            label="Message"
            hint="The line shown under the control. Leave it empty and no line is rendered at all."
        >
            <PageTextField
                :value="message"
                :width="MESSAGE_WIDTH"
                placeholder="No message"
                ariaLabel="Message"
                @input="(value: string) => (message = value)"
            />
        </PageProp>

        <PageProp
            item-key="hasError"
            label="In error"
            hint="Puts the field into its error look and reads the message out as the error rather than as help."
        >
            <PageCheckField :value="hasError" ariaLabel="In error" @change="(value: boolean) => (hasError = value)" />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-bind="commonProps" v-model:value="defaultValue" />
        </template>

        <template #foreign>
            <ForeignExample v-bind="commonProps" v-model:value="foreignValue" />
        </template>

        <template #inForm>
            <InFormExample v-bind="commonProps" v-model:value="formValue" />
        </template>
    </PageExamples>
</template>
