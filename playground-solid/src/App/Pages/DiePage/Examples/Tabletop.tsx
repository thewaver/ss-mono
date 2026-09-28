import { createSignal } from "solid-js";

import { Button, Die, access } from "@thewaver/ss-components-solid";
import type { DieController } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageDieFace } from "../../../StyledComponents/DieContent/DieContent";
import type { DieExampleProps } from "../DiePage.types";

const FIRST_NUMBER = 1;

type Props = DieExampleProps;

export const TabletopExample = (props: Props) => {
    const [getController, setController] = createSignal<DieController>();

    return (
        <div class={styles.stage}>
            <Die
                shape={props.shape}
                size={props.size}
                rollDurationMs={props.rollDurationMs}
                tumbleCount={props.tumbleCount}
                faceSignal={props.faceSignal}
                ariaLabel={"A die"}
                computeFaceLabel={(index) => `${index + FIRST_NUMBER}`}
                computeRollTarget={() => Math.floor(Math.random() * access(props.shape).faces.length)}
                renderFace={(getIndex, getState) => (
                    <PageDieFace state={getState} label={() => `${getIndex() + FIRST_NUMBER}`} />
                )}
                onMount={setController}
            />

            <Button
                id={"dieRoll"}
                isDisabled={() => getController()?.getIsRolling() ?? true}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Roll</PageButtonContent>}
                onClick={() => {
                    getController()?.roll();
                }}
            />
        </div>
    );
};
