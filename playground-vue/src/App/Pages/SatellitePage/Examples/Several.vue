<script setup lang="ts">
import { h } from "vue";

import { Satellite } from "@thewaver/ss-components-vue";
import type { SatelliteDefs } from "@thewaver/ss-components-vue";

import PageSatelliteBadge from "../../../StyledComponents/SatelliteContent/PageSatelliteBadge.vue";
import PageSatelliteSubject from "../../../StyledComponents/SatelliteContent/PageSatelliteSubject.vue";
import type { SatelliteExampleProps } from "../SatellitePage.types";

const CORNER_SIZE = 48;
const SIDE_SIZE = 72;
const TUCKED_SIZE = 88;
const CORNER_OVERHANG = 20;
const TUCKED_DEPTH = 32;

const SATELLITES: SatelliteDefs[] = [
    {
        placement: { x: "right-in", y: "top-in" },
        offset: { x: CORNER_OVERHANG, y: -CORNER_OVERHANG },
        renderSatellite: () => h(PageSatelliteBadge, { size: CORNER_SIZE }, () => "3"),
    },
    {
        placement: { x: "left-out", y: "center" },
        renderSatellite: () => h(PageSatelliteBadge, { size: SIDE_SIZE, isMuted: true }, () => "A"),
    },
    {
        placement: { x: "center", y: "bottom-out" },
        offset: { x: 0, y: -TUCKED_DEPTH },
        isBehindSubject: true,
        renderSatellite: () => h(PageSatelliteBadge, { size: TUCKED_SIZE, isMuted: true }),
    },
];

type Props = SatelliteExampleProps;

defineProps<Props>();
</script>

<template>
    <Satellite :satellites="SATELLITES">
        <PageSatelliteSubject :width="subjectWidth" :height="subjectHeight">Subject</PageSatelliteSubject>
    </Satellite>
</template>
