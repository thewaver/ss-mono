<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import PageRouterLink from "../RouterLink/RouterLink.vue";
import type { PageNavLinkProps } from "./NavLinkVue.types";

defineProps<PageNavLinkProps>();

const layerClass = useLayerClass();
</script>

<template>
    <PageRouterLink
        :href="href"
        :class="[styles.navLinkContent, layerClass, isSelected && styles.isSelected, isGliding && styles.isGliding]"
        :aria-current="isSelected ? 'page' : undefined"
    >
        <slot />
    </PageRouterLink>
</template>
