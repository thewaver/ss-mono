<script setup lang="ts">
import { shallowRef } from "vue";

import { Tooltip } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";

const anchorRef = shallowRef<HTMLElement>();
</script>

<template>
    <div :class="styles.sentence">
        {{ "The keep was raised by masons paid in "
        }}<span id="marks" ref="anchorRef" :class="styles.anchorWord" tabindex="0">marks</span
        >{{ " rather than in coin, which is why the accounts survive at all." }}

        <Tooltip
            :anchor-ref="anchorRef"
            :placement="{ x: 'center', y: 'top_out' }"
            :offset="{ x: 0, y: 10 }"
            :hover-show-delay-ms="TOOLTIP_HOVER_DELAY_MS"
        >
            <template #renderContent="content">
                <PageTooltipContent
                    :visibility-target="content.visibilityTarget"
                    :transition-duration-ms="content.transitionDurationMs"
                    >A weight of silver, not a coin — eight ounces, counted rather than struck.</PageTooltipContent
                >
            </template>
        </Tooltip>
    </div>
</template>
