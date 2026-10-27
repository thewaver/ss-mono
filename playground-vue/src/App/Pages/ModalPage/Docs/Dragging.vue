<script setup lang="ts">
import { shallowRef } from "vue";

import type { TableSort } from "@thewaver/ss-components-vue";
import { Button, Modal, Table } from "@thewaver/ss-components-vue";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as tableStyles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.vue";
import PageTableMarker from "../../../StyledComponents/TableContent/PageTableMarker.vue";
import { PARTS, createPartColumns } from "../../TablePage/TablePageVue.const";

const DRAGGING_TITLE_ID = "modal-page-dragging-title";

const visibility = shallowRef(false);
const sort = shallowRef<TableSort | undefined>();
const order = shallowRef<string[]>([]);

const columns = createPartColumns({ isReorderable: true });

const open = () => {
    visibility.value = true;
};
</script>

<template>
    <Button id="openDragging" @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Open dialog</PageButtonContent>
        </template>
    </Button>

    <Modal v-model:visibility="visibility" :ariaLabelledBy="DRAGGING_TITLE_ID">
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
            <PageModalOverlay :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs }">
            <PageModalPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
                <div :id="DRAGGING_TITLE_ID">Drag a column to reorder it.</div>

                <div :class="tableStyles.tableFrameShort">
                    <Table
                        v-model:sort="sort"
                        v-model:order="order"
                        :columns="columns"
                        :rows="PARTS"
                        ariaLabel="Parts with reorderable columns"
                        :announcements="TABLE_ANNOUNCEMENTS"
                    >
                        <template #renderMarker>
                            <PageTableMarker />
                        </template>
                    </Table>
                </div>
            </PageModalPanel>
        </template>
    </Modal>
</template>
