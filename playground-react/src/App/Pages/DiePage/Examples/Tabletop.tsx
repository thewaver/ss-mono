import { useCallback, useState, useSyncExternalStore } from "react";

import { Button, Die } from "@thewaver/ss-components-react";
import type { DieController } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageDieFace } from "../../../StyledComponents/DieContent/DieContent";
import type { DieExampleProps } from "../DiePage.types";

const FIRST_NUMBER = 1;

const NO_SUBSCRIPTION = () => {};

type Props = DieExampleProps;

export const TabletopExample = (props: Props) => {
    const [controller, setController] = useState<DieController>();

    const subscribe = useCallback(
        (listener: () => void) => controller?.subscribe(listener) ?? NO_SUBSCRIPTION,
        [controller],
    );

    const isRolling = useSyncExternalStore(subscribe, () => controller?.getIsRolling() ?? true);

    return (
        <div className={styles.stage}>
            <Die
                shape={props.shape}
                size={props.size}
                rollDurationMs={props.rollDurationMs}
                tumbleCount={props.tumbleCount}
                faceState={props.faceState}
                ariaLabel={"A die"}
                computeFaceLabel={(index) => `${index + FIRST_NUMBER}`}
                computeRollTarget={() => Math.floor(Math.random() * props.shape.faces.length)}
                renderFace={(index, state) => <PageDieFace state={state} label={`${index + FIRST_NUMBER}`} />}
                onMount={setController}
            />

            <Button
                id={"dieRoll"}
                isDisabled={isRolling}
                renderContent={(flags) => <PageButtonContent flags={flags}>Roll</PageButtonContent>}
                onClick={() => {
                    controller?.roll();
                }}
            />
        </div>
    );
};
