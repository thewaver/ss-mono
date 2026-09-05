import { createSignal } from "solid-js";

import { Button, Corners } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CornersExampleProps } from "../CornersPage.types";

import * as styles from "../CornersPage.css";

type Props = CornersExampleProps;

export const OverlayExample = (props: Props) => {
    const [getCount, setCount] = createSignal(0);

    return (
        <div class={styles.panel}>
            <Corners
                color={props.color}
                cornerLength={props.cornerLength}
                strokeThickness={props.strokeThickness}
                transitionDurationMs={props.transitionDurationMs}
                visibleCorners={props.visibleCorners}
            >
                <div class={styles.panelBody}>
                    <div>
                        The brackets sit on a layer of their own above this text, and that layer takes no pointer and is
                        hidden from a screen reader.
                    </div>

                    <Button
                        renderContent={(getFlags) => (
                            <PageButtonContent flags={getFlags}>{`Pressed ${getCount()}`}</PageButtonContent>
                        )}
                        onClick={() => {
                            setCount((previous) => previous + 1);
                        }}
                    />
                </div>
            </Corners>
        </div>
    );
};
