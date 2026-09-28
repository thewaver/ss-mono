import { Button, PatchBoard } from "@thewaver/ss-components-react";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    BOARD_HEIGHT_RATIO,
    MAX_ZOOM,
    MIN_ZOOM,
    ZOOM_STEP,
} from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import type { PatchBoardZoomExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardZoomExampleProps;

export const ZoomExample = (props: Props) => {
    return (
        <div className={styles.zoomStage}>
            <div className={styles.zoomControls}>
                <Button
                    id={"patchBoardZoomOut"}
                    isDisabled={props.zoom <= MIN_ZOOM}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Zoom out</PageButtonContent>}
                    onClick={() => props.onZoomChange(props.zoom - ZOOM_STEP)}
                />
                <Button
                    id={"patchBoardZoomIn"}
                    isDisabled={props.zoom >= MAX_ZOOM}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Zoom in</PageButtonContent>}
                    onClick={() => props.onZoomChange(props.zoom + ZOOM_STEP)}
                />
            </div>

            <PageMeasureBox>
                <div className={styles.zoomWindow}>
                    <div className={styles.zoomScaler} style={{ transform: `scale(${props.zoom})` }}>
                        <PatchBoard
                            groupId={"zoom"}
                            ariaLabel={"Zoomed chain"}
                            announcements={PATCH_BOARD_ANNOUNCEMENTS}
                            heightRatio={BOARD_HEIGHT_RATIO}
                            socketSize={props.socketSize}
                            isLocked={props.isLocked}
                            isDisabled={props.isDisabled}
                            nodesState={props.nodesState}
                            linksState={props.linksState}
                            computeNodeKey={(device) => device.id}
                            computeNodeLabel={(device) => device.name}
                            renderNode={(node, flags) => (
                                <PagePatchNode label={node.value.name} kind={node.value.kind} flags={flags} />
                            )}
                            renderSocket={(_socket, flags) => <PagePatchSocket flags={flags} />}
                            renderCable={(defs) => <PagePatchCable defs={defs} />}
                            onLink={props.onLink}
                            onUnlink={props.onUnlink}
                            onMove={props.onMove}
                        />
                    </div>
                </div>
            </PageMeasureBox>
        </div>
    );
};
