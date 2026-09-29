<script setup lang="ts">
import { TabPanel } from "@thewaver/ss-components-vue";
import type { TabPanelProps } from "@thewaver/ss-components-vue";

import PageTabPanelContent from "../../StyledComponents/TabContent/PageTabPanelContent.vue";

defineProps<TabPanelProps>();
</script>

<template>
    <TabPanel :id="id" :tab-id="tabId">
        <PageTabPanelContent><slot /></PageTabPanelContent>
    </TabPanel>
</template>
