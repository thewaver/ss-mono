<script setup lang="ts">
import { computed, h } from "vue";

import { Satellite } from "@thewaver/ss-components-vue";
import type { SatelliteDefs } from "@thewaver/ss-components-vue";

import PageSatelliteBadge from "../../../StyledComponents/SatelliteContent/PageSatelliteBadge.vue";
import PageSatelliteSubject from "../../../StyledComponents/SatelliteContent/PageSatelliteSubject.vue";
import type { SatelliteDefaultExampleProps } from "../SatellitePage.types";

type Props = SatelliteDefaultExampleProps;

const props = defineProps<Props>();

const satellites = computed<SatelliteDefs[]>(() =>
    props.hasSatellite
        ? [
              {
                  placement: props.placement,
                  offset: props.offset,
                  isBehindSubject: props.isBehindSubject,
                  renderSatellite: () => h(PageSatelliteBadge, { size: props.badgeSize }, () => props.badgeSize),
              },
          ]
        : [],
);
</script>

<template>
    <Satellite :satellites="satellites">
        <PageSatelliteSubject :width="subjectWidth" :height="subjectHeight">Subject</PageSatelliteSubject>
    </Satellite>
</template>
