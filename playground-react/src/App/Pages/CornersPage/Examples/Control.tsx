import { useState } from "react";

import { Button, Corners } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/CornersPage/CornersPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CornersExampleProps } from "../CornersPage.types";

type Props = CornersExampleProps;

const TRANSPARENT = "transparent";

export const ControlExample = (props: Props) => {
    const [isArmed, setIsArmed] = useState(false);

    return (
        <div className={styles.controlRow}>
            <Button
                isPressed={isArmed}
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>{isArmed ? "Armed" : "Arm"}</PageButtonContent>
                )}
                renderDecoration={(flags) => (
                    <Corners
                        color={flags.isPressed ? props.color : TRANSPARENT}
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
