<script lang="ts">
    import type { TableSort } from "@thewaver/ss-components-svelte";
    import { Button, Modal, Table } from "@thewaver/ss-components-svelte";
    import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as tableStyles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.svelte";
    import PageTableMarker from "../../../StyledComponents/TableContent/PageTableMarker.svelte";
    import { PARTS, createPartColumns } from "../../TablePage/TablePage.const.svelte";

    const DRAGGING_TITLE_ID = "modal-page-dragging-title";

    let visibility = $state(false);
    let sort = $state<TableSort>();
    let order = $state.raw<string[]>([]);

    const columns = createPartColumns({ isReorderable: true });
</script>

<Button
    id={"openDragging"}
    onClick={() => {
        visibility = true;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Open dialog</PageButtonContent>
    {/snippet}
</Button>

<Modal bind:visibility ariaLabelledBy={DRAGGING_TITLE_ID}>
    {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
        <PageModalOverlay {visibilityTarget} {transitionDurationMs} />
    {/snippet}

    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        <PageModalPanel {visibilityTarget} {transitionDurationMs}>
            <div id={DRAGGING_TITLE_ID}>Drag a column to reorder it.</div>

            <div class={tableStyles.tableFrameShort}>
                <Table
                    {columns}
                    rows={PARTS}
                    bind:sort
                    bind:order
                    ariaLabel={"Parts with reorderable columns"}
                    announcements={TABLE_ANNOUNCEMENTS}
                >
                    {#snippet renderMarker()}
                        <PageTableMarker />
                    {/snippet}
                </Table>
            </div>
        </PageModalPanel>
    {/snippet}
</Modal>
