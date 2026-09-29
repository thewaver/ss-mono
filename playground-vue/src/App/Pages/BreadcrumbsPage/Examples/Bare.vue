<script setup lang="ts">
import { Breadcrumbs } from "@thewaver/ss-components-vue";
import { BREADCRUMBS_GAP, labelOf } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";

import PageBreadcrumbContent from "../../../StyledComponents/BreadcrumbContent/PageBreadcrumbContent.vue";
import type { BreadcrumbsExampleProps } from "../BreadcrumbsPage.types";

type Props = BreadcrumbsExampleProps;

defineProps<Props>();
</script>

<template>
    <Breadcrumbs :crumbs="crumbs" :gap="BREADCRUMBS_GAP" ariaLabel="Trail without separators">
        <template #renderCrumb="{ crumb, flags }">
            <PageBreadcrumbContent :flags="flags">{{ labelOf(crumb.value) }}</PageBreadcrumbContent>
        </template>
    </Breadcrumbs>
</template>
