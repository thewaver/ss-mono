import { createSignal } from "solid-js";

import { Button, ScratchCard } from "@thewaver/ss-components";
import type { ScratchCardController } from "@thewaver/ss-components";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScratchCardExampleProps } from "../ScratchCardPage.types";

import * as styles from "../ScratchCardPage.css";

const CARD_WIDTH = 360;

type Props = ScratchCardExampleProps;

export const FrostedExample = (props: Props) => {
    const [getController, setController] = createSignal<ScratchCardController>();

    return (
        <div class={styles.stack}>
            <PageMeasureBox width={() => CARD_WIDTH}>
                <div class={styles.card}>
                    <ScratchCard
                        brushRadius={props.brushRadius}
                        precision={props.precision}
                        softness={props.softness}
                        computePoints={props.computePoints()}
                        clearThreshold={props.clearThreshold}
                        ariaLabel={"Rub the frost away"}
                        onMount={setController}
                        onScratch={props.onScratch}
                        onClear={props.onClear}
                        renderContent={() => (
                            <div class={styles.pane}>
                                <span class={styles.paneTitle}>Frosted, not opaque</span>
                                <span>
                                    A cover that blurs rather than hides means the rub sharpens what is under it.
                                </span>
                            </div>
                        )}
                        renderCover={(getMaskStyle) => <div class={styles.frost} style={getMaskStyle()} />}
                    />
                </div>
            </PageMeasureBox>

            <div class={styles.buttonRow}>
                <Button
                    id={"newFrost"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Re-freeze</PageButtonContent>}
                    onClick={() => {
                        getController()?.reset();
                    }}
                />
            </div>
        </div>
    );
};
