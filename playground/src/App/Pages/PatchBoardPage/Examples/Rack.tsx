import { PatchBoard, PatchBoardSnaps, PatchBoardUtils } from "@thewaver/ss-components";

import { PATCH_BOARD_ANNOUNCEMENTS } from "../../../PageComponents/Announcements/Announcements.const";
import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import { BOARD_HEIGHT_RATIO, BOARD_WIDTH } from "../PatchBoardPage.const";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

import * as styles from "../PatchBoardPage.css";

const GRID_CELL = BOARD_WIDTH * PatchBoardSnaps.GRID_CELL_SIZE;

type Props = PatchBoardExampleProps;

export const RackExample = (props: Props) => {
    return (
        <div
            class={styles.rackGrid}
            style={{
                "background-size": `${GRID_CELL}px ${GRID_CELL}px`,
                "background-position": `-${GRID_CELL * 0.5}px -${GRID_CELL * 0.5}px`,
            }}
        >
            <PatchBoard
                groupId={"rack"}
                ariaLabel={"Effects rack"}
                announcements={PATCH_BOARD_ANNOUNCEMENTS}
                heightRatio={BOARD_HEIGHT_RATIO}
                socketSize={props.socketSize}
                isLocked={props.isLocked}
                isDisabled={props.isDisabled}
                nodesSignal={props.nodesSignal}
                linksSignal={props.linksSignal}
                computeNodeKey={(device) => device.id}
                computeNodeLabel={(device) => device.name}
                computeSnapSpot={PatchBoardSnaps.grid}
                computeCanLink={(link) => !PatchBoardUtils.getClosesLoop(props.linksSignal[0](), link)}
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
    );
};
