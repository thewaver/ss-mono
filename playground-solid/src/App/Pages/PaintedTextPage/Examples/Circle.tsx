import { createUniqueId } from "solid-js";

import { Button, PaintedText, PaintedTextUtils, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextCircleExampleProps } from "../PaintedTextPage.types";

const RING_TEXT = "PAINTED TEXT • ROUND A CIRCLE • ";

type Props = PaintedTextCircleExampleProps;

export const CircleExample = (props: Props) => {
    const id = createUniqueId();

    const getPath = () => {
        const radius = access(props.radius);

        return PaintedTextUtils.computeCirclePath({ x: radius, y: radius }, radius);
    };

    return (
        <div class={styles.stack}>
            <div class={styles.ringText}>
                <PaintedText
                    path={getPath}
                    isFittedToPath={props.isFittedToPath}
                    lapDurationMs={props.lapDurationMs}
                    progress={props.progress}
                    playback={props.playback}
                    computeFillDefs={(getSize, getRef) => computeSampleDefs(props, "fill", id, getSize, getRef)}
                    computeStrokeDefs={(getSize, getRef) => computeSampleDefs(props, "stroke", id, getSize, getRef)}
                    strokeWidth={props.strokeWidth}
                    strokeAlignment={props.strokeAlignment}
                >
                    {RING_TEXT}
                </PaintedText>
            </div>

            <div class={styles.buttonRow}>
                <Button
                    id={"circlePlayback"}
                    renderContent={(getFlags) => (
                        <PageButtonContent flags={getFlags}>{props.playback[0]() ? "Pause" : "Play"}</PageButtonContent>
                    )}
                    onClick={() => {
                        props.playback[1](!props.playback[0]());
                    }}
                />
            </div>
        </div>
    );
};
