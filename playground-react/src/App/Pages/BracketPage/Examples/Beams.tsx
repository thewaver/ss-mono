import { useState } from "react";

import { Bracket, Button } from "@thewaver/ss-components-react";
import type { BracketNode } from "@thewaver/ss-components-react";
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
    const [isPlaying, setIsPlaying] = useState(true);

    return (
        <div className={styles.beamStage}>
            <div className={styles.board}>
                <Bracket
                    root={DRAW}
                    nodeSize={NODE_SIZE}
                    layerGap={props.layerGap}
                    crossGap={props.crossGap}
                    orientation={props.orientation}
                    rootSide={props.rootSide}
                    ariaLabel={"Draw with a beam to the final"}
                    onActivate={props.onActivate}
                    renderConnector={(defs) => (
                        <>
                            {props.renderConnector(defs)}

                            {defs.isOnFocusedRoute && (
                                <PageBeam
                                    d={BEAM_PATHS[props.connector](defs, props.connectorRadius)}
                                    direction={"backward"}
                                    isPlaying={isPlaying}
                                />
                            )}
                        </>
                    )}
                    renderNode={renderBracketNode}
                />
            </div>

            <Button
                id={"bracketBeamsPlayback"}
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>{isPlaying ? "Pause" : "Play"}</PageButtonContent>
                )}
                onClick={() => setIsPlaying((playing) => !playing)}
            />
        </div>
    );
};
