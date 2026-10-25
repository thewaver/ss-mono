<script setup lang="ts">
import { shallowRef } from "vue";

import { Sidebar } from "@thewaver/ss-components-vue";
import {
    COLLAPSED_SIZE,
    EXPANDED_SIZE,
    MAILBOXES,
} from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

import PageSidebarToggle from "../../../PageComponents/SidebarToggle/SidebarToggle.vue";
import PageSidebarFade from "../../../StyledComponents/SidebarContent/PageSidebarFade.vue";
import PageSidebarFrame from "../../../StyledComponents/SidebarContent/PageSidebarFrame.vue";
import PageSidebarNeighbor from "../../../StyledComponents/SidebarContent/PageSidebarNeighbor.vue";
import PageSidebarPhase from "../../../StyledComponents/SidebarContent/PageSidebarPhase.vue";
import PageSidebarSurface from "../../../StyledComponents/SidebarContent/PageSidebarSurface.vue";
import type { SidebarOverlayDocsExampleProps } from "../SidebarPageVue.types";

const SIDEBAR_ID = "overlaySidebar";

type Props = SidebarOverlayDocsExampleProps;

defineProps<Props>();

const isExpanded = shallowRef(false);
</script>

<template>
    <PageSidebarFrame edge="right">
        <Sidebar
            :id="SIDEBAR_ID"
            edge="right"
            :layout="layout"
            :collapsed-size="COLLAPSED_SIZE"
            :expanded-size="EXPANDED_SIZE"
            v-model:expanded="isExpanded"
        >
            <template #renderContent="{ phase, transitionDurationMs: fadeDurationMs }">
                <PageSidebarSurface :width="EXPANDED_SIZE">
                    <PageSidebarToggle
                        :sidebar-id="SIDEBAR_ID"
                        edge="right"
                        :is-expanded="isExpanded"
                        :ariaLabel="isExpanded ? 'Collapse mailboxes' : 'Expand mailboxes'"
                        @toggle="isExpanded = !isExpanded"
                    />

                    <PageSidebarFade :phase="phase" :transition-duration-ms="fadeDurationMs">
                        <PageSidebarPhase>{{ phase }}</PageSidebarPhase>

                        <div v-for="mailbox in MAILBOXES" :key="mailbox">{{ mailbox }}</div>
                    </PageSidebarFade>
                </PageSidebarSurface>
            </template>
        </Sidebar>

        <PageSidebarNeighbor>
            The content beside the sidebar. Overlaid, it stays where it is and the sidebar grows over it; pushed, it
            narrows as the sidebar grows.
        </PageSidebarNeighbor>
    </PageSidebarFrame>
</template>
