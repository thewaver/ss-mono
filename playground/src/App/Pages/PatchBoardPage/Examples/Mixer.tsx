import { PatchBoard } from "@thewaver/ss-components";

import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import { AMP_NODE_KEY, MIXER_NODE_KEY, STANDING_BOARD_SIZE } from "../PatchBoardPage.const";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardExampleProps;

export const MixerExample = (props: Props) => {
    return (
        <PatchBoard
            groupId={"mixer"}
            ariaLabel={"Mixing desk"}
            size={STANDING_BOARD_SIZE}
            orientation={"vertical"}
            socketSize={props.socketSize}
            isLocked={props.isLocked}
            isDisabled={props.isDisabled}
            nodesSignal={props.nodesSignal}
            linksSignal={props.linksSignal}
            computeNodeKey={(device) => device.id}
            computeNodeLabel={(device) => device.name}
            computeCanLink={(link) => link.to.nodeKey !== AMP_NODE_KEY || link.from.nodeKey === MIXER_NODE_KEY}
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
