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

const depth = shallowRef(TRAIL.length);

const crumbs = computed<Breadcrumb<CrumbValue>[]>(() =>
    TRAIL.slice(0, depth.value).map((entry) => ({ value: entry.value })),
);

const select = (value: CrumbValue) => {
    depth.value = TRAIL.findIndex((entry) => entry.value === value) + 1;
};

const restore = () => {
    depth.value = TRAIL.length;
};
</script>

<template>
    <div dir="rtl">
        <Breadcrumbs :crumbs="crumbs" :gap="BREADCRUMBS_GAP" ariaLabel="Trail" @select="select">
            <template #renderCrumb="{ crumb, flags }">
                <PageBreadcrumbContent :flags="flags">{{ labelOf(crumb.value) }}</PageBreadcrumbContent>
            </template>

            <template #renderSeparator>
                <PageBreadcrumbSeparator>{{ ">" }}</PageBreadcrumbSeparator>
            </template>
        </Breadcrumbs>
    </div>

    <Button id="rightToLeftReset" :is-disabled="depth === TRAIL.length" ariaLabel="Restore the trail" @click="restore">
        <template #renderContent="flags">
            <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.replay" />
        </template>
    </Button>
</template>
