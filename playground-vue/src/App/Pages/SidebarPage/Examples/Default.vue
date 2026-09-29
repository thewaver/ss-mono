<script setup lang="ts">
import { useId, useModel } from "vue";

import { Sidebar } from "@thewaver/ss-components-vue";

import PageSidebarToggle from "../../../PageComponents/SidebarToggle/SidebarToggle.vue";
import PageSidebarFade from "../../../StyledComponents/SidebarContent/PageSidebarFade.vue";
import PageSidebarFrame from "../../../StyledComponents/SidebarContent/PageSidebarFrame.vue";
import PageSidebarNeighbor from "../../../StyledComponents/SidebarContent/PageSidebarNeighbor.vue";
import PageSidebarPhase from "../../../StyledComponents/SidebarContent/PageSidebarPhase.vue";
import PageSidebarSurface from "../../../StyledComponents/SidebarContent/PageSidebarSurface.vue";
import type { SidebarExampleProps } from "../SidebarPage.types";

type Props = SidebarExampleProps;

const COLLAPSED_WIDTH = 48;
const EXPANDED_WIDTH = 200;
const ENTRIES = ["Inbox", "Drafts", "Sent", "Archive", "Spam"];

const props = defineProps<Props>();

const sidebarId = useId();

const isExpanded = useModel(props, "expanded");
</script>

<template>
    <PageSidebarFrame :edge="edge">
        <Sidebar
            :id="sidebarId"
            :edge="edge"
            :layout="layout"
            :collapsed-width="COLLAPSED_WIDTH"
            :expanded-width="EXPANDED_WIDTH"
            :is-expanded-on-hover="isExpandedOnHover"
            v-model:expanded="isExpanded"
        >
            <template #renderContent="{ phase, transitionDurationMs }">
                <PageSidebarSurface :width="EXPANDED_WIDTH">
                    <PageSidebarToggle
                        :sidebar-id="sidebarId"
                        :edge="edge"
                        :is-expanded="isExpanded"
                        :ariaLabel="isExpanded ? 'Collapse mailboxes' : 'Expand mailboxes'"
                        @toggle="isExpanded = !isExpanded"
                    />

                    <PageSidebarFade :phase="phase" :transition-duration-ms="transitionDurationMs">
                        <PageSidebarPhase>{{ phase }}</PageSidebarPhase>

                        <div v-for="entry in ENTRIES" :key="entry">{{ entry }}</div>
                    </PageSidebarFade>
                </PageSidebarSurface>
            </template>
        </Sidebar>

        <PageSidebarNeighbor>
            The content beside the sidebar. Pushed, it narrows as the sidebar grows; overlaid, it stays where it is and
            the sidebar grows over it.
        </PageSidebarNeighbor>
    </PageSidebarFrame>
</template>
