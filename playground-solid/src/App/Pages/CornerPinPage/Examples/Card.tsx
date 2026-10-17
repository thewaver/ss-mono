import { createSignal } from "solid-js";

import { Button, CornerPin, QuadWarpUtils } from "@thewaver/ss-components-solid";
import { GRIP_LABELS } from "@thewaver/ss-playground/App/Pages/CornerPinPage/CornerPinPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CornerPinPage/CornerPinPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CornerPinExampleProps } from "../CornerPinPageSolid.types";

type Props = CornerPinExampleProps;

export const CardExample = (props: Props) => {
    const cornersSignal = createSignal(QuadWarpUtils.RESTING_CORNERS);

    return (
        <div class={styles.stage}>
            <CornerPin
                corners={cornersSignal}
                reachRatio={props.reachRatio}
                gripLabels={GRIP_LABELS}
                ariaLabel={"Card corners"}
                renderGrip={(getProps) => (
                    <div
                        class={styles.grip}
                        classList={{
                            [styles.isPicked]: getProps().isPicked,
                            [styles.isDragging]: getProps().isDragging,
                            [styles.isFocused]: getProps().focusVisibleAxis !== undefined,
                        }}
                    />
                )}
            >
                <div class={styles.card}>
                    <div>Pin my corners</div>

                    <div>Drag a grip, or tap it and then tap where it should go.</div>
                </div>
            </CornerPin>

            <Button
                id={"cornerPinReset"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
                onClick={() => {
                    cornersSignal[1](QuadWarpUtils.RESTING_CORNERS);
                }}
            />
        </div>
    );
};
