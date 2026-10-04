<script setup lang="ts">
import { shallowRef } from "vue";

import { Tooltip } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";

const TOOLTIP_PLACEMENT = { x: "center", y: "top-out" } as const;
const TOOLTIP_OFFSET = { x: 0, y: 10 };

type TermProps = {
    tip: string;
};

defineProps<TermProps>();

const anchorRef = shallowRef<HTMLElement>();
</script>

<template>
    <span>
        <span ref="anchorRef" :class="styles.glossaryTerm" tabindex="0"><slot /></span>

        <Tooltip
            :anchor-ref="anchorRef"
            :placement="TOOLTIP_PLACEMENT"
            :offset="TOOLTIP_OFFSET"
            :hover-show-delay-ms="TOOLTIP_HOVER_DELAY_MS"
        >
            <template #renderContent="{ visibilityTarget, transitionDurationMs }">
                <PageTooltipContent
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                >
                    {{ tip }}
                </PageTooltipContent>
            </template>
        </Tooltip>
    </span>
</template>
