<script setup lang="ts">
import { toRef, useAttrs } from "vue";
import { useLink } from "vue-router";

import type { PageRouterLinkProps } from "./RouterLink.types";

defineOptions({ inheritAttrs: false });

const props = defineProps<PageRouterLinkProps>();

const attrs = useAttrs();

const link = useLink({ to: toRef(() => props.href), replace: toRef(() => props.replace) });

const handleClick = (e: MouseEvent) => {
    (attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e);

    if (!e.defaultPrevented) void link.navigate(e);
};
</script>

<template>
    <a v-bind="{ ...attrs, onClick: handleClick }" :href="link.href.value"><slot /></a>
</template>
