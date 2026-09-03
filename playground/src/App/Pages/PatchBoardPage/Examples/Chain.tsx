import { PatchBoard } from "@thewaver/ss-components";

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
