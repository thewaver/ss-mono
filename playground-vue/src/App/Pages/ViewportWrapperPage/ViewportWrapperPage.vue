<script setup lang="ts">
import { computed, h, shallowRef } from "vue";

import type { InteractionTooltipDefs, SelectFlags, Toast } from "@thewaver/ss-components-vue";
import { Button, Range, Select, ToastUtils, Toasts, ViewportWrapper } from "@thewaver/ss-components-vue";
import { ViewportWrapperKnobs } from "@thewaver/ss-playground/App/Knobs/ViewportWrappers.const";
import {
    COUNTRIES,
    EXAMPLE_NAMES,
    INNER_TOAST_GAP,
    INNER_TOAST_MARGIN,
    INNER_TOAST_MESSAGE,
    PERCENT,
    SCROLL_SIZE,
} from "@thewaver/ss-playground/App/Pages/ViewportWrapperPage/ViewportWrapperPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ViewportWrapperPage/ViewportWrapperPage.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import type { VariantDefs } from "../../PageComponents/Variants/Variants.types";
import PageVariants from "../../PageComponents/Variants/Variants.vue";
import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageGlideFloater from "../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageRangeContent from "../../StyledComponents/RangeContent/RangeContent.vue";
import PageSelectContent from "../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import PageToastContent from "../../StyledComponents/ToastContent/ToastContent.vue";
import type { ToastDefs } from "../../StyledComponents/ToastContent/ToastContentVue.types";
import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.vue";
import ViewportReadout from "./ViewportReadout.vue";

const INNER_TOAST_MARGINS = {
    marginTop: INNER_TOAST_MARGIN,
    marginRight: INNER_TOAST_MARGIN,
    marginBottom: INNER_TOAST_MARGIN,
    marginLeft: INNER_TOAST_MARGIN,
};

const renderTooltip = (text: string): InteractionTooltipDefs<SelectFlags> => ({
    placement: { x: "center", y: "top_out" } as const,
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => text),
});

const ROAMING_TOOLTIP_DEFS = renderTooltip("My tooltip has the same boundary I do.");

const variants: VariantDefs[] = [
    {
        key: "roaming",
        name: EXAMPLE_NAMES.roaming,
    },
    {
        key: "scrolled",
        name: EXAMPLE_NAMES.scrolled,
    },
];

const roamerX = shallowRef(ViewportWrapperKnobs.STARTING_ROAMER_X);
const roamerY = shallowRef(ViewportWrapperKnobs.STARTING_ROAMER_Y);
const scalePercent = shallowRef(PERCENT);
const roamingValue = shallowRef<string | undefined>();
const innerToasts = shallowRef<Toast<ToastDefs>[]>([]);
const scrolledValue = shallowRef<string | undefined>();

const stageSize = computed(() => {
    const side = Math.round((styles.HOST_SIZE * PERCENT) / scalePercent.value);

    return { width: side, height: side };
});

const raiseInnerToast = () => {
    innerToasts.value = ToastUtils.withRequestedToast(innerToasts.value, {
        value: { kind: "info", message: INNER_TOAST_MESSAGE },
        announcement: INNER_TOAST_MESSAGE,
    }).toasts;
};
</script>

<template>
    <PageVariants :min-column-width="styles.MIN_COLUMN_WIDTH" :items="variants">
        <template #roaming>
            <div :class="styles.sectionBody">
                <div>
                    The dashed square is a viewport of its own, so it is the boundary that counts. Park the control
                    against any edge of it: its tooltip and its list turn around rather than cross that edge, keep the
                    side of the control they are on, and are cut by the square when there is not enough room. The scale
                    slider changes the resolution the square is designed for, so everything inside it grows or shrinks
                    while the boundary stays where it is.
                </div>

                <div :class="styles.controls">
                    <div>Across</div>
                    <Range
                        id="roamerX"
                        v-model:value="roamerX"
                        ariaLabel="Horizontal position"
                        :thumb-size="RANGE_THUMB_SIZE"
                    >
                        <template #renderContent="renderProps">
                            <PageRangeContent :render-props="renderProps" />
                        </template>
                    </Range>

                    <div>Down</div>
                    <Range
                        id="roamerY"
                        v-model:value="roamerY"
                        ariaLabel="Vertical position"
                        :thumb-size="RANGE_THUMB_SIZE"
                    >
                        <template #renderContent="renderProps">
                            <PageRangeContent :render-props="renderProps" />
                        </template>
                    </Range>

                    <div>Scale</div>
                    <Range
                        id="viewportScale"
                        v-model:value="scalePercent"
                        ariaLabel="Viewport scale"
                        :min="ViewportWrapperKnobs.SCALE_MIN"
                        :max="ViewportWrapperKnobs.SCALE_MAX"
                        :step="ViewportWrapperKnobs.SCALE_STEP"
                        :thumb-size="RANGE_THUMB_SIZE"
                    >
                        <template #renderContent="renderProps">
                            <PageRangeContent :render-props="renderProps" />
                        </template>
                    </Range>
                </div>

                <div :class="styles.readout" data-readout="">
                    {{ `x: ${roamerX}% | y: ${roamerY}% | scale: ${scalePercent}% of ${styles.HOST_SIZE}px` }}
                </div>

                <div :class="styles.host" data-stage="">
                    <ViewportWrapper :size="stageSize">
                        <div
                            :class="styles.roamer"
                            :style="{
                                left: `${roamerX}%`,
                                top: `${roamerY}%`,
                                transform: `translate(-${roamerX}%, -${roamerY}%)`,
                            }"
                        >
                            <Select
                                id="roamingCountry"
                                v-model:value="roamingValue"
                                :options="COUNTRIES"
                                ariaLabel="Roaming country"
                                :tooltip-defs="ROAMING_TOOLTIP_DEFS"
                            >
                                <template #renderContent="{ selectedOption, flags }">
                                    <PageSelectContent :flags="flags">{{
                                        selectedOption?.value ?? "Pick one"
                                    }}</PageSelectContent>
                                </template>

                                <template #renderOption="{ option, flags }">
                                    <PageSelectOptionContent is-gliding :flags="flags">{{
                                        option.value
                                    }}</PageSelectOptionContent>
                                </template>

                                <template #renderHighlightFloater="floater">
                                    <PageGlideFloater kind="highlight" v-bind="floater" />
                                </template>

                                <template
                                    #renderPopup="{ renderOptions, visibilityTarget, transitionDurationMs, placement }"
                                >
                                    <PagePopoverSurface
                                        :visibility-target="visibilityTarget"
                                        :transition-duration-ms="transitionDurationMs"
                                        :placement="placement"
                                    >
                                        <component :is="renderOptions" />
                                    </PagePopoverSurface>
                                </template>
                            </Select>
                        </div>

                        <div :class="styles.toastRaiser">
                            <Button
                                id="raiseInnerToast"
                                ariaLabel="Notify inside the viewport"
                                @click="raiseInnerToast"
                            >
                                <template #renderContent="flags">
                                    <PageButtonContent :flags="flags">Notify</PageButtonContent>
                                </template>
                            </Button>
                        </div>

                        <Toasts
                            v-model:toasts="innerToasts"
                            ariaLabel="Viewport notifications"
                            alignment="bottom_center"
                            :margins="INNER_TOAST_MARGINS"
                        >
                            <template #renderToast="{ toast, visibilityTarget, transitionDurationMs, state, dismiss }">
                                <PageToastContent
                                    :toast="toast"
                                    :state="state"
                                    animation="fade"
                                    stacking="flow"
                                    flex-direction="column"
                                    :gap="INNER_TOAST_GAP"
                                    :visibility-target="visibilityTarget"
                                    :transition-duration-ms="transitionDurationMs"
                                    @dismiss="dismiss"
                                />
                            </template>
                        </Toasts>

                        <ViewportReadout />
                    </ViewportWrapper>
                </div>
            </div>
        </template>

        <template #scrolled>
            <div :class="styles.sectionBody">
                <div>
                    A viewport of the same size with a scrolling area inside it. Scrolling moves the anchor without
                    moving the page, so an open list has to follow it, stay off it, and stop at the square.
                </div>

                <div :class="styles.host">
                    <ViewportWrapper :size="SCROLL_SIZE">
                        <div :class="styles.scrollBox" data-scroll-box="">
                            <div :class="styles.scrollFiller" />

                            <Select
                                id="scrolledCountry"
                                v-model:value="scrolledValue"
                                :options="COUNTRIES"
                                ariaLabel="Scrolled country"
                            >
                                <template #renderContent="{ selectedOption, flags }">
                                    <PageSelectContent :flags="flags">{{
                                        selectedOption?.value ?? "Pick one"
                                    }}</PageSelectContent>
                                </template>

                                <template #renderOption="{ option, flags }">
                                    <PageSelectOptionContent is-gliding :flags="flags">{{
                                        option.value
                                    }}</PageSelectOptionContent>
                                </template>

                                <template #renderHighlightFloater="floater">
                                    <PageGlideFloater kind="highlight" v-bind="floater" />
                                </template>

                                <template
                                    #renderPopup="{ renderOptions, visibilityTarget, transitionDurationMs, placement }"
                                >
                                    <PagePopoverSurface
                                        :visibility-target="visibilityTarget"
                                        :transition-duration-ms="transitionDurationMs"
                                        :placement="placement"
                                    >
                                        <component :is="renderOptions" />
                                    </PagePopoverSurface>
                                </template>
                            </Select>

                            <div :class="styles.scrollFiller" />
                        </div>
                    </ViewportWrapper>
                </div>
            </div>
        </template>
    </PageVariants>
</template>
