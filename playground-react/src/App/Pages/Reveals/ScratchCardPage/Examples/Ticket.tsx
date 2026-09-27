import { useState } from "react";

import { Button, ScratchCard } from "@thewaver/ss-components-react";
import type { ScratchCardController } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/Reveals/ScratchCardPage/ScratchCardPage.css";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScratchCardExampleProps } from "../ScratchCardPage.types";

const CARD_WIDTH = 360;
const PRIZE = "★ 10 000 ★";

type Props = ScratchCardExampleProps;

export const TicketExample = (props: Props) => {
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
                        ariaLabel={"Scratch to reveal the prize"}
                        onMount={setController}
                        onScratch={props.onScratch}
                        onClear={props.onClear}
                        renderContent={() => <div className={styles.prize}>{PRIZE}</div>}
                        renderCover={(maskStyle) => <div className={styles.foil} style={maskStyle} />}
                        renderBrush={(isRubbing, geometry) => (
                            <div
                                className={[styles.coin, isRubbing && styles.coinRubbing].filter(Boolean).join(" ")}
                                style={{ clipPath: geometry.clipPath }}
                            />
                        )}
                    />
                </div>
            </PageMeasureBox>

            <div className={styles.buttonRow}>
                <Button
                    id={"newTicket"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>New ticket</PageButtonContent>}
                    onClick={() => {
                        controller?.reset();
                    }}
                />
            </div>
        </div>
    );
};
