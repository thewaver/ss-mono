<script setup lang="ts">
import { shallowRef } from "vue";

import { SWITCHED_DIRECTION_TABS } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import type { TabsExampleProps } from "../TabsPageVue.types";
import RowExample from "./Row.vue";

type Props = TabsExampleProps;

const props = defineProps<Props>();

const isRightToLeft = shallowRef(false);
</script>

<template>
    <div :dir="isRightToLeft ? 'rtl' : 'ltr'">
        <RowExample
            :selected-value="selectedValue"
            :tabs="SWITCHED_DIRECTION_TABS"
            id-prefix="switchedDirection"
            @selection-change="props.onSelectionChange"
        />

        <PageExampleKnobs>
            <PageProp
                item-key="isRightToLeft"
                controls="Sets dir on the box around the tabs"
                label="Right to left"
                hint="Switches the box around the tabs between right-to-left and left-to-right while they are on screen."
            >
                <PageCheckField
                    :value="isRightToLeft"
                    ariaLabel="Right to left"
                    @change="(value: boolean) => (isRightToLeft = value)"
                />
            </PageProp>
        </PageExampleKnobs>
    </div>
</template>
