import { createSignal } from "solid-js";

import { Button, Corners, access } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CornersExampleProps } from "../CornersPage.types";

import * as styles from "../CornersPage.css";

type Props = CornersExampleProps;

const TRANSPARENT = "transparent";

export const ControlExample = (props: Props) => {
    const [getIsArmed, setIsArmed] = createSignal(false);

    return (
        <div class={styles.controlRow}>
            <Button
                isPressed={getIsArmed}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>{getIsArmed() ? "Armed" : "Arm"}</PageButtonContent>
                )}
                renderDecoration={(getFlags) => (
                    <Corners
                        color={() => (getFlags().isPressed ? access(props.color) : TRANSPARENT)}
                        cornerLength={props.cornerLength}
                        strokeThickness={props.strokeThickness}
                        transitionDurationMs={props.transitionDurationMs}
                        visibleCorners={props.visibleCorners}
                    />
                )}
                onClick={() => {
                    setIsArmed((previous) => !previous);
                }}
            />
        </div>
    );
};
