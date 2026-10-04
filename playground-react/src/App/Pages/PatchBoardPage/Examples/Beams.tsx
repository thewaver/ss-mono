import { useState } from "react";

import { Button, PatchBoard } from "@thewaver/ss-components-react";
import { PATCH_BOARD_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { BOARD_HEIGHT_RATIO } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.css";
import { computePatchCablePath } from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.const";

import { PageBeam } from "../../../StyledComponents/Beam/Beam";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PagePatchCable,
    PagePatchNode,
    PagePatchSocket,
} from "../../../StyledComponents/PatchBoardContent/PatchBoardContent";
import type { PatchBoardExampleProps } from "../PatchBoardPage.types";

type Props = PatchBoardExampleProps;

export const BeamsExample = (props: Props) => {
    const [isPlaying, setIsPlaying] = useState(true);

    return (
        <div className={styles.beamStage}>
            <PatchBoard
                groupId={"beams"}
                ariaLabel={"Signal chain with its signal running"}
                announcements={PATCH_BOARD_ANNOUNCEMENTS}
                heightRatio={BOARD_HEIGHT_RATIO}
                socketSize={props.socketSize}
                isLocked={props.isLocked}
                isDisabled={props.isDisabled}
                nodes={props.nodes}
                links={props.links}
                computeNodeKey={(device) => device.id}
                computeNodeLabel={(device) => device.name}
                renderNode={(node, flags) => (
                    <PagePatchNode label={node.value.name} kind={node.value.kind} flags={flags} />
                )}
                renderSocket={(_socket, flags) => <PagePatchSocket flags={flags} />}
                renderCable={(defs) => (
                    <>
                        <PagePatchCable defs={defs} />

                        {!defs.isPending && (
                            <PageBeam
                                d={computePatchCablePath(defs)}
                                direction={defs.fromKind === "out" ? "forward" : "backward"}
                                isPlaying={isPlaying}
                            />
                        )}
                    </>
                )}
                onLink={props.onLink}
                onUnlink={props.onUnlink}
                onMove={props.onMove}
            />

            <Button
                id={"patchBeamsPlayback"}
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>{isPlaying ? "Pause" : "Play"}</PageButtonContent>
                )}
                onClick={() => setIsPlaying((playing) => !playing)}
            />
        </div>
    );
};
