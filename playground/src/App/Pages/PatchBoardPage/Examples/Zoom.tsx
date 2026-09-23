import { Button, PatchBoard, access } from "@thewaver/ss-components";

import { PATCH_BOARD_ANNOUNCEMENTS } from "../../../PageComponents/Announcements/Announcements.const";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import { BOARD_HEIGHT_RATIO, MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "../PatchBoardPage.const";
import type { PatchBoardZoomExampleProps } from "../PatchBoardPage.types";

import * as styles from "../PatchBoardPage.css";

type Props = PatchBoardZoomExampleProps;

export const ZoomExample = (props: Props) => {
    return (
        <div class={styles.zoomStage}>
            <div class={styles.zoomControls}>
                <Button
                    id={"patchBoardZoomOut"}
                    isDisabled={() => access(props.zoom) <= MIN_ZOOM}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Zoom out</PageButtonContent>}
                    onClick={() => props.onZoomChange(access(props.zoom) - ZOOM_STEP)}
                />
                <Button
                    id={"patchBoardZoomIn"}
                    isDisabled={() => access(props.zoom) >= MAX_ZOOM}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Zoom in</PageButtonContent>}
                    onClick={() => props.onZoomChange(access(props.zoom) + ZOOM_STEP)}
                />
            </div>

            <div class={styles.zoomWindow}>
                <div class={styles.zoomScaler} style={{ transform: `scale(${access(props.zoom)})` }}>
                    <PatchBoard
                        groupId={"zoom"}
                        ariaLabel={"Zoomed chain"}
                        announcements={PATCH_BOARD_ANNOUNCEMENTS}
                        heightRatio={BOARD_HEIGHT_RATIO}
                        socketSize={props.socketSize}
                        isLocked={props.isLocked}
                        isDisabled={props.isDisabled}
                        nodesSignal={props.nodesSignal}
                        linksSignal={props.linksSignal}
                        computeNodeKey={(device) => device.id}
                        computeNodeLabel={(device) => device.name}
                        renderNode={(getNode, getFlags) => (
                            <PagePatchNode
                                label={() => getNode().value.name}
                                kind={() => getNode().value.kind}
                                flags={getFlags}
                            />
                        )}
                        renderSocket={(_getSocket, getFlags) => <PagePatchSocket flags={getFlags} />}
                        renderCable={(getDefs) => <PagePatchCable defs={getDefs} />}
                        onLink={props.onLink}
                        onUnlink={props.onUnlink}
                        onMove={props.onMove}
                    />
                </div>
            </div>
        </div>
    );
};
