import { createMemo, createSignal } from "solid-js";

import type { TableSort } from "@thewaver/ss-components-solid";
import { Button, Modal, Table } from "@thewaver/ss-components-solid";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as tableStyles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import { PageTableMarker } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../../TablePage/TablePageSolid.const";

const DRAGGING_TITLE_ID = "modal-page-dragging-title";

export const DraggingDocsExample = () => {
    const visibility = createSignal(false);
    const sortSignal = createSignal<TableSort | undefined>();
    const orderSignal = createSignal<string[]>([]);

    const [, setIsOpen] = visibility;

    const getColumns = createMemo(() => createPartColumns({ isReorderable: true }));

    return (
        <>
            <Button
                id={"openDragging"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Open dialog</PageButtonContent>}
                onClick={() => {
                    setIsOpen(true);
                }}
            />

            <Modal
                visibility={visibility}
                ariaLabelledBy={DRAGGING_TITLE_ID}
                renderOverlay={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageModalOverlay
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageModalPanel
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        <div id={DRAGGING_TITLE_ID}>Drag a column to reorder it.</div>

                        <div class={tableStyles.tableFrameShort}>
                            <Table
                                columns={getColumns}
                                rows={PARTS}
                                sort={sortSignal}
                                order={orderSignal}
                                ariaLabel={"Parts with reorderable columns"}
                                announcements={TABLE_ANNOUNCEMENTS}
                                renderMarker={() => <PageTableMarker />}
                            />
                        </div>
                    </PageModalPanel>
                )}
            />
        </>
    );
};
