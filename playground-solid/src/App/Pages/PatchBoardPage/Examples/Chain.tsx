import { PatchBoard } from "@thewaver/ss-components-solid";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";
import { BOARD_HEIGHT_RATIO } from "@thewaver/ss-playground-core/App/Pages/PatchBoardPage/PatchBoardPage.const";

import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardExampleProps;

export const ChainExample = (props: Props) => {
    return (
        <PatchBoard
            groupId={"chain"}
            ariaLabel={"Signal chain"}
            announcements={PATCH_BOARD_ANNOUNCEMENTS}
            heightRatio={BOARD_HEIGHT_RATIO}
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
