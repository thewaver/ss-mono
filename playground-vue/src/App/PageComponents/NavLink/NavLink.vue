<script setup lang="ts">
import { type ComponentPublicInstance, computed, shallowRef } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import PageRouterLink from "../RouterLink/RouterLink.vue";
import { useNavLinkGroupContext } from "./NavLink.context";
import type { PageNavLinkProps } from "./NavLinkVue.types";

defineProps<PageNavLinkProps>();

const layerClass = useLayerClass();
const groupContext = useNavLinkGroupContext();
const linkRef = shallowRef<ComponentPublicInstance>();

const isHovered = computed(() => {
    const link = linkRef.value?.$el as HTMLElement | undefined;

    return link !== undefined && groupContext?.highlightedLink === link;
});
</script>

<template>
    <PageRouterLink ref="linkRef" :href="href" :class="styles.navLink" :aria-current="isSelected ? 'page' : undefined">
        <div
            :class="[
                styles.navLinkContent,
                layerClass,
                hasHoverFloater ? styles.hasHoverFloater : styles.hasNoHoverFloater,
                hasSelectionFloater && styles.hasSelectionFloater,
                isHovered && styles.isHovered,
                isSelected && styles.isSelected,
            ]"
        >
            <slot />
        </div>
    </PageRouterLink>
</template>
