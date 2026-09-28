import { PatchBoard } from "@thewaver/ss-components-react";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { BOARD_HEIGHT_RATIO } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";

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
            nodesState={props.nodesState}
            linksState={props.linksState}
            computeNodeKey={(device) => device.id}
            computeNodeLabel={(device) => device.name}
            renderNode={(node, flags) => <PagePatchNode label={node.value.name} kind={node.value.kind} flags={flags} />}
            renderSocket={(_socket, flags) => <PagePatchSocket flags={flags} />}
            renderCable={(defs) => <PagePatchCable defs={defs} />}
            onLink={props.onLink}
            onUnlink={props.onUnlink}
            onMove={props.onMove}
        />
    );
};
