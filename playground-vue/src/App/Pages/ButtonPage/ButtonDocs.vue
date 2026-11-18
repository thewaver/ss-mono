<script setup lang="ts">
import { shallowRef } from "vue";

import { ButtonKnobs } from "@thewaver/ss-playground/App/Knobs/Buttons.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DecoratedDocsExample from "./Docs/Decorated.vue";
import RepeatingDocsExample from "./Docs/Repeating.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const isDisabled = shallowRef(false);
const hasError = shallowRef(false);
const isPressed = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-disabled="isDisabled" :has-error="hasError" :is-pressed="isPressed" />

        <template #renderKnobs>
            <PageProp item-key="hasError" v-bind="ButtonKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isPressed" v-bind="ButtonKnobs.IS_PRESSED_TEXT">
                <PageCheckField
                    :value="isPressed"
                    ariaLabel="Pressed"
                    @change="(value: boolean) => (isPressed = value)"
                />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="ButtonKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="ButtonKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="ButtonKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.decoration" />

    <PageDocsExample :path="`${DOCS_ROOT}/Decorated.vue`">
        <DecoratedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.holdRepeat" />

    <PageDocsExample :path="`${DOCS_ROOT}/Repeating.vue`">
        <RepeatingDocsExample />
    </PageDocsExample>
</template>
