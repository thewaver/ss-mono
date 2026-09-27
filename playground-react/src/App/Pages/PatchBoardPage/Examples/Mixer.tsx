import { PatchBoard } from "@thewaver/ss-components-react";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";
import {
    AMP_NODE_KEY,
    MIXER_NODE_KEY,
    STANDING_BOARD_HEIGHT_RATIO,
} from "@thewaver/ss-playground-core/App/Pages/PatchBoardPage/PatchBoardPage.const";

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
            nodesState={props.nodesState}
            linksState={props.linksState}
            computeNodeKey={(device) => device.id}
            computeNodeLabel={(device) => device.name}
            computeCanLink={(link) => link.to.nodeKey !== AMP_NODE_KEY || link.from.nodeKey === MIXER_NODE_KEY}
            renderNode={(node, flags) => <PagePatchNode label={node.value.name} kind={node.value.kind} flags={flags} />}
            renderSocket={(_socket, flags) => <PagePatchSocket flags={flags} />}
            renderCable={(defs) => <PagePatchCable defs={defs} />}
            onLink={props.onLink}
            onUnlink={props.onUnlink}
            onMove={props.onMove}
        />
    );
};
