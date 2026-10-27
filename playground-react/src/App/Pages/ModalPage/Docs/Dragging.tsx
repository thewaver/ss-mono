import { useMemo, useState } from "react";

import type { TableSort } from "@thewaver/ss-components-react";
import { Button, Modal, Table } from "@thewaver/ss-components-react";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as tableStyles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import { PageTableMarker } from "../../../StyledComponents/TableContent/TableContent";
import { PARTS, createPartColumns } from "../../TablePage/TablePageReact.const";

const DRAGGING_TITLE_ID = "modal-page-dragging-title";

export const DraggingDocsExample = () => {
    const visibility = useState(false);
    const sortState = useState<TableSort | undefined>();
    const orderState = useState<string[]>([]);

    const [, setIsOpen] = visibility;

    const columns = useMemo(() => createPartColumns({ isReorderable: true }), []);

    return (
        <>
            <Button
                id={"openDragging"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Open dialog</PageButtonContent>}
                onClick={() => {
                    setIsOpen(true);
                }}
            />

            <Modal
                visibility={visibility}
                ariaLabelledBy={DRAGGING_TITLE_ID}
                renderOverlay={(visibilityTarget, transitionDurationMs) => (
                    <PageModalOverlay visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
                )}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageModalPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        <div id={DRAGGING_TITLE_ID}>Drag a column to reorder it.</div>

                        <div className={tableStyles.tableFrameShort}>
                            <Table
                                columns={columns}
                                rows={PARTS}
                                sort={sortState}
                                order={orderState}
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
