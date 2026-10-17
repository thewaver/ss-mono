import { useState } from "react";

import { Button, CornerHighlight } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/CornerHighlightPage/CornerHighlightPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CornerHighlightExampleProps } from "../CornerHighlightPageReact.types";

type Props = CornerHighlightExampleProps;

export const OverlayExample = (props: Props) => {
    const [count, setCount] = useState(0);

    return (
        <div className={styles.panel}>
            <CornerHighlight
                color={props.color}
                cornerLength={props.cornerLength}
                strokeThickness={props.strokeThickness}
                transitionDurationMs={props.transitionDurationMs}
                visibleCorners={props.visibleCorners}
            >
                <div className={styles.panelBody}>
                    <div>
                        The brackets sit on a layer of their own above this text, and that layer takes no pointer and is
                        hidden from a screen reader.
                    </div>

                    <Button
                        renderContent={(flags) => (
                            <PageButtonContent flags={flags}>{`Pressed ${count}`}</PageButtonContent>
                        )}
                        onClick={() => {
                            setCount((previous) => previous + 1);
                        }}
                    />
                </div>
            </CornerHighlight>
        </div>
    );
};
