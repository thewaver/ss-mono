import { Show, createSignal } from "solid-js";

import { Button, PatchBoard } from "@thewaver/ss-components-solid";
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
    const [getIsPlaying, setIsPlaying] = createSignal(true);

    return (
        <div class={styles.beamStage}>
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
                renderNode={(getNode, getFlags) => (
                    <PagePatchNode
                        label={() => getNode().value.name}
                        kind={() => getNode().value.kind}
                        flags={getFlags}
                    />
                )}
                renderSocket={(_getSocket, getFlags) => <PagePatchSocket flags={getFlags} />}
                renderCable={(getDefs) => (
                    <>
                        <PagePatchCable defs={getDefs} />

                        <Show when={!getDefs().isPending}>
                            <PageBeam
                                d={() => computePatchCablePath(getDefs())}
                                direction={() => (getDefs().fromKind === "out" ? "forward" : "backward")}
                                isPlaying={getIsPlaying}
                            />
                        </Show>
                    </>
                )}
                onLink={props.onLink}
                onUnlink={props.onUnlink}
                onMove={props.onMove}
            />

            <Button
                id={"patchBeamsPlayback"}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>{getIsPlaying() ? "Pause" : "Play"}</PageButtonContent>
                )}
                onClick={() => {
                    setIsPlaying((isPlaying) => !isPlaying);
                }}
            />
        </div>
    );
};
