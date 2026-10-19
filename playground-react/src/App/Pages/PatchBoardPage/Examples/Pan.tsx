import { useState } from "react";

import { PATCH_BOARD_DEFAULTS, PatchBoard } from "@thewaver/ss-components-react";
import type { PanZoomController } from "@thewaver/ss-components-react";
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
    const [controller, setController] = useState<PanZoomController>();

    return (
        <div className={styles.viewStage}>
            <PageMeasureBox>
                <div className={styles.viewWindow}>
                    <PatchBoard
                        groupId={"pan"}
                        ariaLabel={"Recording chain"}
                        announcements={PATCH_BOARD_ANNOUNCEMENTS}
                        heightRatio={PAN_BOARD_HEIGHT_RATIO}
                        socketSize={props.socketSize * PAN_SCALE}
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
                        renderNode={(node, flags) => (
                            <PagePatchNode label={node.value.name} kind={node.value.kind} flags={flags} />
                        )}
                        renderSocket={(_socket, flags) => <PagePatchSocket flags={flags} />}
                        renderCable={(defs) => <PagePatchCable defs={defs} isBeamPlaying={props.isBeamPlaying} />}
                        onLink={props.onLink}
                        onUnlink={props.onUnlink}
                        onMove={props.onMove}
                        onMount={setController}
                    />
                </div>
            </PageMeasureBox>

            <PagePanZoomControls idPrefix={"patchBoard"} controller={controller} />
        </div>
    );
};
