import { For } from "solid-js";

import { Button, ScratchCard } from "@thewaver/ss-components";
import type { ScratchCardController } from "@thewaver/ss-components";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScratchCardWindowsExampleProps } from "../ScratchCardPage.types";

import * as styles from "../ScratchCardPage.css";

const TICKET_WIDTH = 360;
const SYMBOLS = ["★", "♦", "★"];
const FIRST_WINDOW = 1;

type Props = ScratchCardWindowsExampleProps;

export const WindowsExample = (props: Props) => {
    const controllers: ScratchCardController[] = [];

    return (
        <div class={styles.stack}>
            <PageMeasureBox width={() => TICKET_WIDTH}>
                <div class={styles.windows}>
                    <For each={SYMBOLS}>
                        {(symbol, getIndex) => (
                            <div class={styles.card}>
                                <ScratchCard
                                    brushRadius={props.brushRadius}
                                    precision={props.precision}
                                    softness={props.softness}
                                    computePoints={props.computePoints()}
                                    clearThreshold={props.clearThreshold}
                                    ariaLabel={`Scratch window ${getIndex() + FIRST_WINDOW}`}
                                    onMount={(controller) => controllers.push(controller)}
                                    onScratch={(ratio) => props.onWindowScratch(getIndex(), ratio)}
                                    onClear={() => props.onWindowClear(getIndex())}
                                    renderContent={() => <div class={styles.windowPrize}>{symbol}</div>}
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
                        )}
                    </For>
                </div>
            </PageMeasureBox>

            <div class={styles.buttonRow}>
                <Button
                    id={"newWindowsTicket"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>New ticket</PageButtonContent>}
                    onClick={() => {
                        controllers.forEach((controller) => controller.reset());
                    }}
                />
            </div>
        </div>
    );
};
