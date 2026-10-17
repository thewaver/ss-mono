import { useState } from "react";

import { Button, CornerPin, QuadWarpUtils } from "@thewaver/ss-components-react";
import { GRIP_LABELS } from "@thewaver/ss-playground/App/Pages/CornerPinPage/CornerPinPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CornerPinPage/CornerPinPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CornerPinExampleProps } from "../CornerPinPageReact.types";

type Props = CornerPinExampleProps;

export const CardExample = (props: Props) => {
    const cornersState = useState(QuadWarpUtils.RESTING_CORNERS);

    return (
        <div className={styles.stage}>
            <CornerPin
                corners={cornersState}
                reachRatio={props.reachRatio}
                gripLabels={GRIP_LABELS}
                ariaLabel={"Card corners"}
                renderGrip={(gripProps) => (
                    <div
                        className={[
                            styles.grip,
                            gripProps.isPicked && styles.isPicked,
                            gripProps.isDragging && styles.isDragging,
                            gripProps.focusVisibleAxis !== undefined && styles.isFocused,
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    />
                )}
            >
                <div className={styles.card}>
                    <div>Pin my corners</div>

                    <div>Drag a grip, or tap it and then tap where it should go.</div>
                </div>
            </CornerPin>

            <Button
                id={"cornerPinReset"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Reset</PageButtonContent>}
                onClick={() => {
                    cornersState[1](QuadWarpUtils.RESTING_CORNERS);
                }}
            />
        </div>
    );
};
