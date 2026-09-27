import { PatchBoard, PatchBoardSnaps, PatchBoardUtils } from "@thewaver/ss-components-react";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";
import {
    BOARD_HEIGHT_RATIO,
    BOARD_WIDTH,
} from "@thewaver/ss-playground-core/App/Pages/PatchBoardPage/PatchBoardPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/PatchBoardPage/PatchBoardPage.css";

import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

const GRID_CELL = BOARD_WIDTH * PatchBoardSnaps.GRID_CELL_SIZE;

type Props = PatchBoardExampleProps;

export const RackExample = (props: Props) => {
    return (
        <div
            className={styles.rackGrid}
            style={{
                backgroundSize: `${GRID_CELL}px ${GRID_CELL}px`,
                backgroundPosition: `-${GRID_CELL * 0.5}px -${GRID_CELL * 0.5}px`,
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
                nodesState={props.nodesState}
                linksState={props.linksState}
                computeNodeKey={(device) => device.id}
                computeNodeLabel={(device) => device.name}
                computeSnapSpot={PatchBoardSnaps.grid}
                computeCanLink={(link) => !PatchBoardUtils.getClosesLoop(props.linksState[0], link)}
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
    );
};
