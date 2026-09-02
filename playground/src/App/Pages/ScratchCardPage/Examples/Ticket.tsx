import { createSignal } from "solid-js";

import { Button, ScratchCard } from "@thewaver/ss-components";
import type { ScratchCardController } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScratchCardExampleProps } from "../ScratchCardPage.types";

import * as styles from "../ScratchCardPage.css";

const PRIZE = "★ 10 000 ★";
const EVEN = 2;
const NO_REMAINDER = 0;

type Props = ScratchCardExampleProps;

export const TicketExample = (props: Props) => {
    const [getController, setController] = createSignal<ScratchCardController>();

    return (
        <div class={styles.stack}>
            <div class={styles.card}>
                <ScratchCard
                    cellCount={props.cellCount}
                    brushRadius={props.brushRadius}
                    clearThreshold={props.clearThreshold}
                    ariaLabel={"Scratch to reveal the prize"}
                    onMount={setController}
                    onScratch={props.onScratch}
                    onClear={props.onClear}
                    renderContent={() => <div class={styles.prize}>{PRIZE}</div>}
                    renderCell={(getState) => (
                        <div
                            class={styles.foil}
                            classList={{
                                [styles.foilAlternate]: (getState().cell.x + getState().cell.y) % EVEN !== NO_REMAINDER,
                            }}
                        />
                    )}
                />
            </div>

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
