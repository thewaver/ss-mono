import { PATCH_BOARD_DEFAULTS, PatchBoard, access } from "@thewaver/ss-components-solid";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    PAN_BOARD_HEIGHT_RATIO,
    PAN_SCALE,
} from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";

import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardExampleProps;

export const PanExample = (props: Props) => {
    return (
        <div class={styles.panWindow}>
            <div class={styles.panBoard}>
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
                />
            </div>
        </div>
    );
};
