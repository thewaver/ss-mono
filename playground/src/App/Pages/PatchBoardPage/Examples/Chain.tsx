import { PatchBoard } from "@thewaver/ss-components";

import { PATCH_BOARD_ANNOUNCEMENTS } from "../../../PageComponents/Announcements/Announcements.const";
import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import { BOARD_SIZE } from "../PatchBoardPage.const";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardExampleProps;

export const ChainExample = (props: Props) => {
    return (
        <PatchBoard
            groupId={"chain"}
            ariaLabel={"Signal chain"}
            announcements={PATCH_BOARD_ANNOUNCEMENTS}
            size={BOARD_SIZE}
            socketSize={props.socketSize}
            isLocked={props.isLocked}
            isDisabled={props.isDisabled}
            nodesSignal={props.nodesSignal}
            linksSignal={props.linksSignal}
            computeNodeKey={(device) => device.id}
            computeNodeLabel={(device) => device.name}
            renderNode={(getNode, getFlags) => (
                <PagePatchNode label={() => getNode().value.name} kind={() => getNode().value.kind} flags={getFlags} />
            )}
            renderSocket={(_getSocket, getFlags) => <PagePatchSocket flags={getFlags} />}
            renderCable={(getDefs) => <PagePatchCable defs={getDefs} />}
            onLink={props.onLink}
            onUnlink={props.onUnlink}
            onMove={props.onMove}
        />
    );
};
