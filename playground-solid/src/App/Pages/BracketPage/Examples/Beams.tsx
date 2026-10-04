import { Show, createSignal } from "solid-js";

import { Bracket, Button } from "@thewaver/ss-components-solid";
import type { BracketNode } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import { PageBeam } from "../../../StyledComponents/Beam/Beam";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { BEAM_PATHS, branch, renderBracketNode, seed } from "../BracketPage.const";
import type { BracketBeamsExampleProps } from "../BracketPage.types";

const NODE_SIZE = { width: 96, height: 34 };

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

type Props = BracketBeamsExampleProps;

export const BeamsExample = (props: Props) => {
    const [getIsPlaying, setIsPlaying] = createSignal(true);

    return (
        <div class={styles.beamStage}>
            <div class={styles.board}>
                <Bracket
                    root={() => DRAW}
                    nodeSize={() => NODE_SIZE}
                    layerGap={props.layerGap}
                    crossGap={props.crossGap}
                    orientation={props.orientation}
                    rootSide={props.rootSide}
                    ariaLabel={"Draw with a beam to the final"}
                    onActivate={props.onActivate}
                    renderConnector={(getDefs) => (
                        <>
                            {props.renderConnector(getDefs)}

                            <Show when={getDefs().isOnFocusedRoute}>
                                <PageBeam
                                    d={() => BEAM_PATHS[props.connector()](getDefs(), props.connectorRadius())}
                                    direction={() => "backward"}
                                    isPlaying={getIsPlaying}
                                />
                            </Show>
                        </>
                    )}
                    renderNode={renderBracketNode}
                />
            </div>

            <Button
                id={"bracketBeamsPlayback"}
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
