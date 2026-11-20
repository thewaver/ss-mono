import { PatchBoard } from "@thewaver/ss-components-solid";
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
                    renderNode={(getNode, getFlags) => (
                        <PagePatchNode
                            label={() => getNode().value.name}
                            kind={() => getNode().value.kind}
                            flags={getFlags}
                        />
                    )}
                    renderSocket={(_getSocket, getFlags) => <PagePatchSocket flags={getFlags} />}
                    renderCable={(getDefs) => <PagePatchCable defs={getDefs} isBeamPlaying={props.isBeamPlaying} />}
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
                    renderNode={(getNode, getFlags) => (
                        <PagePatchNode
                            label={() => getNode().value.name}
                            kind={() => getNode().value.kind}
                            flags={getFlags}
                        />
                    )}
                    renderSocket={(_getSocket, getFlags) => <PagePatchSocket flags={getFlags} />}
                    renderCable={(getDefs) => <PagePatchCable defs={getDefs} isBeamPlaying={props.isBeamPlaying} />}
                    onLink={props.onLink}
                    onUnlink={props.onUnlink}
                    onMove={props.onMove}
                />
            </PageMeasureBox>
        </>
    );
};
