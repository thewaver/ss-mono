<script setup lang="ts">
import { shallowRef } from "vue";

import { FloaterStyles, FloaterVueUtils, InteractionTrackerUtils, TREE_DEFAULTS } from "@thewaver/ss-components-vue";
import { LINK_SELECTOR } from "@thewaver/ss-playground/App/PageComponents/NavLink/NavLink.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

import PageGlideFloater from "../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import { provideNavLinkGroupContext } from "./NavLink.context";

const transitionDurationMs = TREE_DEFAULTS.floaterTransitionDurationMs;

const rootRef = shallowRef<HTMLDivElement>();
const hoveredLink = shallowRef<HTMLElement>();
const focusVisibleLink = shallowRef<HTMLElement>();

const findLink = (target: EventTarget | null) => {
    const link = target instanceof Element ? target.closest(LINK_SELECTOR) : null;

    return link instanceof HTMLElement && rootRef.value?.contains(link) ? link : undefined;
};

const readFocusVisibleLink = (target: EventTarget | null) => {
    const link = findLink(target);

    return link && InteractionTrackerUtils.computeIsFocusVisible(link) ? link : undefined;
};

const getHighlightedLink = () => hoveredLink.value ?? focusVisibleLink.value;

const { bounds, isRendered, visibilityTarget, setRef } = FloaterVueUtils.useFloater({
    isEnabled: true,
    container: rootRef,
    target: getHighlightedLink,
    transitionDurationMs,
});

provideNavLinkGroupContext({
    get highlightedLink() {
        return getHighlightedLink();
    },
});
</script>

<template>
    <div
        ref="rootRef"
        :class="styles.navLinkGroup"
        @pointerover="(e: PointerEvent) => (hoveredLink = findLink(e.target))"
        @pointerleave="hoveredLink = undefined"
        @focusin="(e: FocusEvent) => (focusVisibleLink = readFocusVisibleLink(e.target))"
        @focusout="focusVisibleLink = undefined"
    >
        <div
            v-if="isRendered"
            :ref="setRef"
            :class="FloaterStyles.floater"
            :style="{ ...bounds, transitionDuration: `${transitionDurationMs}ms` }"
        >
            <PageGlideFloater
                kind="highlight"
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
            />
        </div>

        <slot />
    </div>
</template>
