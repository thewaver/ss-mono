import { Button, PatchBoard, access } from "@thewaver/ss-components-solid";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    BOARD_HEIGHT_RATIO,
    MAX_ZOOM,
    MIN_ZOOM,
    ZOOM_STEP,
} from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import type { PatchBoardZoomExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardZoomExampleProps;

export const ZoomExample = (props: Props) => {
    return (
        <div class={styles.zoomStage}>
            <div class={styles.zoomControls}>
                <Button
                    id={"patchBoardZoomOut"}
                    isDisabled={() => access(props.zoom) <= MIN_ZOOM}
                    ariaLabel={"Zoom out"}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.zoomOut} />
                    )}
                    onClick={() => props.onZoomChange(access(props.zoom) - ZOOM_STEP)}
                />
                <Button
                    id={"patchBoardZoomIn"}
                    isDisabled={() => access(props.zoom) >= MAX_ZOOM}
                    ariaLabel={"Zoom in"}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.zoomIn} />
                    )}
                    onClick={() => props.onZoomChange(access(props.zoom) + ZOOM_STEP)}
                />
            </div>

            <PageMeasureBox>
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
                            nodes={props.nodes}
                            links={props.links}
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
                            renderCable={(getDefs) => (
                                <PagePatchCable defs={getDefs} isBeamPlaying={props.isBeamPlaying} />
                            )}
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
