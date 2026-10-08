<script setup lang="ts">
import { shallowRef } from "vue";

import { Tooltip } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";

import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { TooltipExampleProps } from "../TooltipPage.types";

type Props = TooltipExampleProps;

defineProps<Props>();

const anchorRef = shallowRef<HTMLElement>();
</script>

<template>
    <div :class="styles.sentence">
        {{ "The keep was raised by masons paid in "
        }}<span ref="anchorRef" :class="styles.anchorWord" tabindex="0">marks</span
        >{{ " rather than in coin, which is why the accounts survive at all." }}

        <Tooltip
            :anchor-ref="anchorRef"
            :placement="placement"
            :offset="offset"
            :transition-duration-ms="transitionDurationMs"
            :focus-show-delay-ms="focusShowDelayMs"
            :hover-show-delay-ms="hoverShowDelayMs"
            :skip-delay-window-ms="skipDelayWindowMs"
        >
            <template #renderContent="content">
                <PageTooltipContent
                    :visibility-target="content.visibilityTarget"
                    :transition-duration-ms="content.transitionDurationMs"
                    :reveal="reveal"
                    :arrow="arrow"
                    :arrow-width="arrowWidth"
                    :arrow-length="arrowLength"
                    :arrow-aim="content.arrowAim"
                    >A weight of silver, not a coin — eight ounces, counted rather than struck.</PageTooltipContent
                >
            </template>
        </Tooltip>
    </div>
</template>
