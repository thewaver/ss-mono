<script setup lang="ts">
import { useModel } from "vue";

import { Checkbox } from "@thewaver/ss-components-vue";

import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.vue";
import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.vue";
import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import type { CheckboxRefusedWriteExampleProps } from "../CheckboxPage.types";

type Props = CheckboxRefusedWriteExampleProps;

const props = defineProps<Props>();

const email = useModel(props, "email");
const sms = useModel(props, "sms");

const keepEmail = (isChecked: boolean) => {
    if (isChecked || sms.value) return;

    email.value = true;
};

const keepSms = (isChecked: boolean) => {
    if (isChecked || email.value) return;

    sms.value = true;
};
</script>

<template>
    <PageControlRow>
        <Checkbox id="email" v-model:checked="email" ariaLabel="Email" @change="keepEmail">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags" />
            </template>
        </Checkbox>

        <PageControlRowLabel>or</PageControlRowLabel>

        <Checkbox v-model:checked="sms" ariaLabel="SMS" @change="keepSms">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags" />
            </template>
        </Checkbox>
    </PageControlRow>
</template>
