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
    <div :class="styles.anchorRow">
        <button ref="anchorRef" type="button" :class="styles.anchorButton">Publish</button>

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
                >
                    <div :class="styles.richTitle">Everyone with the link</div>

                    <div :class="styles.richBody">
                        The page stays private until you share it. Publishing does not send anything to anybody; it only
                        stops the page refusing visitors.
                    </div>
                </PageTooltipContent>
            </template>
        </Tooltip>
    </div>
</template>
