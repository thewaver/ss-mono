import { PATCH_BOARD_DEFAULTS, PatchBoard, access } from "@thewaver/ss-components";

import { PATCH_BOARD_ANNOUNCEMENTS } from "../../../PageComponents/Announcements/Announcements.const";
import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import { PAN_BOARD_HEIGHT_RATIO, PAN_SCALE } from "../PatchBoardPage.const";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

import * as styles from "../PatchBoardPage.css";

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
    );
};
