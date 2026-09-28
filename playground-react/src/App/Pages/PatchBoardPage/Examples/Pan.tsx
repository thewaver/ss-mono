import { PATCH_BOARD_DEFAULTS, PatchBoard } from "@thewaver/ss-components-react";
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
        <div className={styles.panWindow}>
            <div className={styles.panBoard}>
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
    );
};
