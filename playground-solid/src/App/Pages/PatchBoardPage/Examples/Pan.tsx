import { createSignal } from "solid-js";

import { PATCH_BOARD_DEFAULTS, PatchBoard, access } from "@thewaver/ss-components-solid";
import type { PanZoomController } from "@thewaver/ss-components-solid";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    PAN_BOARD_HEIGHT_RATIO,
    PAN_BOARD_WIDTH,
    PAN_SCALE,
} from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PagePanZoomControls } from "../../../PageComponents/PanZoomControls/PanZoomControls";
import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import type { PatchBoardViewExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardViewExampleProps;

export const PanExample = (props: Props) => {
    const [getController, setController] = createSignal<PanZoomController>();

    return (
        <div class={styles.viewStage}>
            <PageMeasureBox>
                <div class={styles.viewWindow}>
                    <PatchBoard
                        groupId={"pan"}
                        ariaLabel={"Recording chain"}
                        announcements={PATCH_BOARD_ANNOUNCEMENTS}
                        heightRatio={PAN_BOARD_HEIGHT_RATIO}
                        socketSize={() => access(props.socketSize) * PAN_SCALE}
                        socketReach={PATCH_BOARD_DEFAULTS.socketReach * PAN_SCALE}
                        stepSize={PATCH_BOARD_DEFAULTS.stepSize * PAN_SCALE}
                        isLocked={props.isLocked}
                        isDisabled={props.isDisabled}
                        view={props.view}
                        boardWidth={PAN_BOARD_WIDTH}
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
                        renderCable={(getDefs) => <PagePatchCable defs={getDefs} isBeamPlaying={props.isBeamPlaying} />}
                        onLink={props.onLink}
                        onUnlink={props.onUnlink}
                        onMove={props.onMove}
                        onMount={setController}
                    />
                </div>
            </PageMeasureBox>

            <PagePanZoomControls idPrefix={"patchBoard"} controller={getController} />
        </div>
    );
};
