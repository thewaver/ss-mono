import { PatchBoard } from "@thewaver/ss-components-react";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { BOARD_HEIGHT_RATIO, BOARD_WIDTH } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import type { PatchBoardSharedExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardSharedExampleProps;

const GROUP_ID = "studio";

export const SharedExample = (props: Props) => {
    return (
        <>
            <PageMeasureBox width={BOARD_WIDTH}>
                <PatchBoard
                    groupId={GROUP_ID}
                    ariaLabel={"Instruments"}
                    announcements={PATCH_BOARD_ANNOUNCEMENTS}
                    heightRatio={BOARD_HEIGHT_RATIO}
                    socketSize={props.socketSize}
                    isLocked={props.isLocked}
                    isDisabled={props.isDisabled}
                    nodes={props.firstNodes}
                    links={props.firstLinks}
                    computeNodeKey={(device) => device.id}
                    computeNodeLabel={(device) => device.name}
                    renderNode={(node, flags) => (
                        <PagePatchNode label={node.value.name} kind={node.value.kind} flags={flags} />
                    )}
                    renderSocket={(_socket, flags) => <PagePatchSocket flags={flags} />}
                    renderCable={(defs) => <PagePatchCable defs={defs} isBeamPlaying={props.isBeamPlaying} />}
                    onLink={props.onLink}
                    onUnlink={props.onUnlink}
                    onMove={props.onMove}
                />
            </PageMeasureBox>

            <PageMeasureBox width={BOARD_WIDTH}>
                <PatchBoard
                    groupId={GROUP_ID}
                    ariaLabel={"Outputs"}
                    announcements={PATCH_BOARD_ANNOUNCEMENTS}
                    heightRatio={BOARD_HEIGHT_RATIO}
                    socketSize={props.socketSize}
                    isLocked={props.isLocked}
                    isDisabled={props.isDisabled}
                    nodes={props.secondNodes}
                    links={props.secondLinks}
                    computeNodeKey={(device) => device.id}
                    computeNodeLabel={(device) => device.name}
                    renderNode={(node, flags) => (
                        <PagePatchNode label={node.value.name} kind={node.value.kind} flags={flags} />
                    )}
                    renderSocket={(_socket, flags) => <PagePatchSocket flags={flags} />}
                    renderCable={(defs) => <PagePatchCable defs={defs} isBeamPlaying={props.isBeamPlaying} />}
                    onLink={props.onLink}
                    onUnlink={props.onUnlink}
                    onMove={props.onMove}
                />
            </PageMeasureBox>
        </>
    );
};
