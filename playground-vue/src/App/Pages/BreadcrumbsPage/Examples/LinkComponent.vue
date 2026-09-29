<script setup lang="ts">
import { Breadcrumbs } from "@thewaver/ss-components-vue";
import { BREADCRUMBS_GAP, labelOf } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";

import PageBreadcrumbContent from "../../../StyledComponents/BreadcrumbContent/PageBreadcrumbContent.vue";
import PageBreadcrumbSeparator from "../../../StyledComponents/BreadcrumbContent/PageBreadcrumbSeparator.vue";
import type { BreadcrumbsExampleProps } from "../BreadcrumbsPage.types";
import PageBreadcrumbLink from "./PageBreadcrumbLink.vue";

type Props = BreadcrumbsExampleProps;

defineProps<Props>();
</script>

<template>
    <Breadcrumbs :crumbs="crumbs" :gap="BREADCRUMBS_GAP" ariaLabel="Routed trail" :link-component="PageBreadcrumbLink">
        <template #renderCrumb="{ crumb, flags }">
            <PageBreadcrumbContent :flags="flags">{{ labelOf(crumb.value) }}</PageBreadcrumbContent>
        </template>

        <template #renderSeparator>
            <PageBreadcrumbSeparator />
        </template>
    </Breadcrumbs>
</template>
