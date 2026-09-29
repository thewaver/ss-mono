<script setup lang="ts">
import { computed, h } from "vue";

import { Satellite } from "@thewaver/ss-components-vue";
import type { AnchorPlacement, SatelliteDefs } from "@thewaver/ss-components-vue";
import type { Point2d } from "@thewaver/ss-utils";

import PageSatellitePill from "../../../StyledComponents/SatelliteContent/PageSatellitePill.vue";
import PageSatelliteSubject from "../../../StyledComponents/SatelliteContent/PageSatelliteSubject.vue";
import type { SatelliteBadgeCorner, SatelliteBadgeExampleProps } from "../SatellitePage.types";

const PLACEMENTS: Record<SatelliteBadgeCorner, AnchorPlacement> = {
    "top-left": { x: "left-in", y: "top-in" },
    "top-right": { x: "right-in", y: "top-in" },
    "bottom-left": { x: "left-in", y: "bottom-in" },
    "bottom-right": { x: "right-in", y: "bottom-in" },
};

const OUTWARD: Record<SatelliteBadgeCorner, Point2d> = {
    "top-left": { x: -1, y: -1 },
    "top-right": { x: 1, y: -1 },
    "bottom-left": { x: -1, y: 1 },
    "bottom-right": { x: 1, y: 1 },
};

type Props = SatelliteBadgeExampleProps;

const props = defineProps<Props>();

const offset = computed(() => ({
    x: OUTWARD[props.corner].x * props.overhang,
    y: OUTWARD[props.corner].y * props.overhang,
}));

const satellites = computed<SatelliteDefs[]>(() => [
    {
        placement: PLACEMENTS[props.corner],
        offset: offset.value,
        renderSatellite: () => h(PageSatellitePill, null, () => props.count),
    },
]);
</script>

<template>
    <Satellite :satellites="satellites">
        <PageSatelliteSubject :width="subjectWidth" :height="subjectHeight">Inbox</PageSatelliteSubject>
    </Satellite>
</template>
