import { useState } from "react";
import { flushSync } from "react-dom";

import { Button, ShapeRevealUtils } from "@thewaver/ss-components-react";
import { ShapeRevealKnobs } from "@thewaver/ss-playground/App/Knobs/ShapeReveals.const";
import {
    NEXT_PANEL,
    PANEL_LINES,
    PANEL_TITLES,
    STARTING_PANEL,
    SWITCH_ID,
    toComputePoints,
} from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.css";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { ShapeRevealExampleProps } from "../ShapeRevealPage.types";

type Props = ShapeRevealExampleProps;

export const SwitchExample = (props: Props) => {
    const [panel, setPanel] = useState(STARTING_PANEL);

    const switchPanel = async () => {
        const shape = props.shape;
        const origin = props.origin;
        const next = NEXT_PANEL[panel];

        const hasAnimated = await ShapeRevealUtils.reveal(() => flushSync(() => setPanel(next)), {
            origin: origin === ShapeRevealKnobs.BUTTON ? (document.getElementById(SWITCH_ID) ?? undefined) : origin,
            durationMs: props.durationMs,
            blur: props.blur,
            computePoints: toComputePoints(shape),
        });

        props.onRun({ shape, origin, hasAnimated, panel: next });
    };

    return (
        <div className={styles.stage}>
            <div className={[styles.panel, panel === "dawn" ? styles.panelDawn : styles.panelDusk].join(" ")}>
                <span className={styles.panelTitle}>{PANEL_TITLES[panel]}</span>
                <span className={styles.panelLine}>{PANEL_LINES[panel]}</span>
            </div>

            <Button
                id={SWITCH_ID}
                renderContent={(flags) => <PageControlButtonContent flags={flags}>Switch</PageControlButtonContent>}
                onClick={switchPanel}
            />
        </div>
    );
};
