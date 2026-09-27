import { useRef } from "react";

import { Button, ScratchCard } from "@thewaver/ss-components-react";
import type { ScratchCardController } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/Reveals/ScratchCardPage/ScratchCardPage.css";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScratchCardWindowsExampleProps } from "../ScratchCardPage.types";

const TICKET_WIDTH = 360;
const SYMBOLS = ["★", "♦", "★"];
const FIRST_WINDOW = 1;

type Props = ScratchCardWindowsExampleProps;

export const WindowsExample = (props: Props) => {
    const controllersRef = useRef<ScratchCardController[]>([]);

    return (
        <div className={styles.stack}>
            <PageMeasureBox width={TICKET_WIDTH}>
                <div className={styles.windows}>
                    {SYMBOLS.map((symbol, index) => (
                        <div key={index} className={styles.card}>
                            <ScratchCard
                                brushRadius={props.brushRadius}
                                precision={props.precision}
                                softness={props.softness}
                                computePoints={props.computePoints}
                                clearThreshold={props.clearThreshold}
                                ariaLabel={`Scratch window ${index + FIRST_WINDOW}`}
                                onMount={(controller) => {
                                    controllersRef.current[index] = controller;
                                }}
                                onScratch={(ratio) => props.onWindowScratch(index, ratio)}
                                onClear={() => props.onWindowClear(index)}
                                renderContent={() => <div className={styles.windowPrize}>{symbol}</div>}
                                renderCover={(maskStyle) => <div className={styles.foil} style={maskStyle} />}
                                renderBrush={(isRubbing, geometry) => (
                                    <div
                                        className={[styles.coin, isRubbing && styles.coinRubbing]
                                            .filter(Boolean)
                                            .join(" ")}
                                        style={{ clipPath: geometry.clipPath }}
                                    />
                                )}
                            />
                        </div>
                    ))}
                </div>
            </PageMeasureBox>

            <div className={styles.buttonRow}>
                <Button
                    id={"newWindowsTicket"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>New ticket</PageButtonContent>}
                    onClick={() => {
                        controllersRef.current.forEach((controller) => controller.reset());
                    }}
                />
            </div>
        </div>
    );
};
