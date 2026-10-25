<script setup lang="ts">
import { shallowRef } from "vue";

import { Tooltip } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";

const anchorRef = shallowRef<HTMLElement>();
</script>

<template>
    <div :class="styles.anchorRow">
        <button id="publish" ref="anchorRef" type="button" :class="styles.anchorButton">Publish</button>

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
