<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Breadcrumbs, Button } from "@thewaver/ss-components-vue";
import type { Breadcrumb } from "@thewaver/ss-components-vue";
import type { CrumbValue } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbTrail.types";
import {
    BREADCRUMBS_GAP,
    TRAIL,
    labelOf,
} from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageBreadcrumbContent from "../../../StyledComponents/BreadcrumbContent/PageBreadcrumbContent.vue";
import PageBreadcrumbSeparator from "../../../StyledComponents/BreadcrumbContent/PageBreadcrumbSeparator.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { BreadcrumbsBasicDocsExampleProps } from "../BreadcrumbsPageVue.types";

type Props = BreadcrumbsBasicDocsExampleProps;

const props = defineProps<Props>();

const depth = shallowRef(TRAIL.length);

const crumbs = computed<Breadcrumb<CrumbValue>[]>(() =>
    TRAIL.slice(0, depth.value).map((entry) => ({ value: entry.value, isDisabled: props.isDisabled })),
);

const select = (value: CrumbValue) => {
    depth.value = TRAIL.findIndex((entry) => entry.value === value) + 1;
};
</script>

<template>
    <Breadcrumbs :crumbs="crumbs" :gap="BREADCRUMBS_GAP" ariaLabel="Trail" @select="select">
        <template #renderCrumb="{ crumb, flags }">
            <PageBreadcrumbContent :flags="flags">{{ labelOf(crumb.value) }}</PageBreadcrumbContent>
        </template>

        <template v-if="separator !== 'none'" #renderSeparator>
            <PageBreadcrumbSeparator>{{ separator }}</PageBreadcrumbSeparator>
        </template>
    </Breadcrumbs>

    <Button
        id="basicReset"
        :is-disabled="depth === TRAIL.length"
        ariaLabel="Restore the trail"
        @click="() => void (depth = TRAIL.length)"
    >
        <template #renderContent="flags">
            <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.replay" />
        </template>
    </Button>
</template>
