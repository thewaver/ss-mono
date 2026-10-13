<script setup lang="ts">
import { computed, h } from "vue";

import { Satellite } from "@thewaver/ss-components-vue";
import type { AnchorPlacement, SatelliteDefs } from "@thewaver/ss-components-vue";
import type { Point2d } from "@thewaver/ss-utils";

import PageSatellitePill from "../../../StyledComponents/SatelliteContent/PageSatellitePill.vue";
import PageSatelliteSubject from "../../../StyledComponents/SatelliteContent/PageSatelliteSubject.vue";
import type { SatelliteBadgeCorner, SatelliteBadgeExampleProps } from "../SatellitePageVue.types";

const PLACEMENTS: Record<SatelliteBadgeCorner, AnchorPlacement> = {
    top_left: { x: "left_in", y: "top_in" },
    top_right: { x: "right_in", y: "top_in" },
    bottom_left: { x: "left_in", y: "bottom_in" },
    bottom_right: { x: "right_in", y: "bottom_in" },
};

const OUTWARD: Record<SatelliteBadgeCorner, Point2d> = {
    top_left: { x: -1, y: -1 },
    top_right: { x: 1, y: -1 },
    bottom_left: { x: -1, y: 1 },
    bottom_right: { x: 1, y: 1 },
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
