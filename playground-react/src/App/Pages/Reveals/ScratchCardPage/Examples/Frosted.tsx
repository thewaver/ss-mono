import { useState } from "react";

import { Button, ScratchCard } from "@thewaver/ss-components-react";
import type { ScratchCardController } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/ScratchCardPage/ScratchCardPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { ScratchCardExampleProps } from "../ScratchCardPage.types";

const CARD_WIDTH = 360;

type Props = ScratchCardExampleProps;

export const FrostedExample = (props: Props) => {
    const [controller, setController] = useState<ScratchCardController>();

    return (
        <div className={styles.stack}>
            <PageMeasureBox width={CARD_WIDTH}>
                <div className={styles.card}>
                    <ScratchCard
                        brushRadius={props.brushRadius}
                        precision={props.precision}
                        softness={props.softness}
                        computePoints={props.computePoints}
                        clearThreshold={props.clearThreshold}
                        ariaLabel={"Rub the frost away"}
                        onMount={setController}
                        onScratch={props.onScratch}
                        onClear={props.onClear}
                        renderContent={() => (
                            <div className={styles.pane}>
                                <span className={styles.paneTitle}>Frosted, not opaque</span>
                                <span>
                                    A cover that blurs rather than hides means the rub sharpens what is under it.
                                </span>
                            </div>
                        )}
                        renderCover={(maskStyle) => <div className={styles.frost} style={maskStyle} />}
                    />
                </div>
            </PageMeasureBox>

            <div className={styles.buttonRow}>
                <Button
                    id={"newFrost"}
                    ariaLabel={"Re-freeze"}
                    renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={CONTROL_GLYPHS.replay} />}
                    onClick={() => {
                        controller?.reset();
                    }}
                />
            </div>
        </div>
    );
};
