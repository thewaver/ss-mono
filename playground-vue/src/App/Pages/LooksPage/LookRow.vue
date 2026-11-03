<script setup lang="ts">
import { Radio } from "@thewaver/ss-components-vue";
import { PLAYGROUND_LOOKS } from "@thewaver/ss-playground/App/Looks/Look.const";
import { computeLookRowId } from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.css";

import PageRadioContent from "../../StyledComponents/RadioContent/RadioContent.vue";
import LookSamples from "./LookSamples.vue";
import type { LookRowProps } from "./LooksPage.types";

defineProps<LookRowProps>();
</script>

<template>
    <Radio :value="look" :ariaLabel="label" sizing="fill">
        <template #renderContent="flags">
            <div :id="computeLookRowId(look)" :class="styles.lookRow">
                <div :class="styles.lookSampleBoundary">
                    <div :class="PLAYGROUND_LOOKS[look]">
                        <div :class="styles.lookSamples">
                            <PageRadioContent :flags="flags">{{ label }}</PageRadioContent>

                            <div :class="styles.lookColumns" inert aria-hidden="true">
                                <LookSamples :look="look" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Radio>
</template>
