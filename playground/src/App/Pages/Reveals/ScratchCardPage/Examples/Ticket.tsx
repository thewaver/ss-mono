import { createSignal } from "solid-js";

import { Button, ScratchCard } from "@thewaver/ss-components";
import type { ScratchCardController } from "@thewaver/ss-components";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScratchCardExampleProps } from "../ScratchCardPage.types";

import * as styles from "../ScratchCardPage.css";

const CARD_WIDTH = 360;
const PRIZE = "★ 10 000 ★";

type Props = ScratchCardExampleProps;

export const TicketExample = (props: Props) => {
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
                        ariaLabel={"Scratch to reveal the prize"}
                        onMount={setController}
                        onScratch={props.onScratch}
                        onClear={props.onClear}
                        renderContent={() => <div class={styles.prize}>{PRIZE}</div>}
                        renderCover={(getMaskStyle) => <div class={styles.foil} style={getMaskStyle()} />}
                        renderBrush={(getIsRubbing, getGeometry) => (
                            <div
                                class={styles.coin}
                                classList={{ [styles.coinRubbing]: getIsRubbing() }}
                                style={{ "clip-path": getGeometry().clipPath }}
                            />
                        )}
                    />
                </div>
            </PageMeasureBox>

            <div class={styles.buttonRow}>
                <Button
                    id={"newTicket"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>New ticket</PageButtonContent>}
                    onClick={() => {
                        getController()?.reset();
                    }}
                />
            </div>
        </div>
    );
};
