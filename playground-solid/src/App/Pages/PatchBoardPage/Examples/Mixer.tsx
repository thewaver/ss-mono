import { PatchBoard } from "@thewaver/ss-components-solid";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    AMP_NODE_KEY,
    MIXER_NODE_KEY,
    STANDING_BOARD_HEIGHT_RATIO,
} from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";

import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardExampleProps;

export const MixerExample = (props: Props) => {
    return (
        <PatchBoard
            groupId={"mixer"}
            ariaLabel={"Mixing desk"}
            announcements={PATCH_BOARD_ANNOUNCEMENTS}
            heightRatio={STANDING_BOARD_HEIGHT_RATIO}
            orientation={"vertical"}
            socketSize={props.socketSize}
            isLocked={props.isLocked}
            isDisabled={props.isDisabled}
            nodes={props.nodes}
            links={props.links}
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
