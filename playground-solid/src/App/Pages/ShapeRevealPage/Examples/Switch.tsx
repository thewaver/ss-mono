import { createSignal } from "solid-js";

import { Button, ShapeRevealUtils, access } from "@thewaver/ss-components-solid";
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
    const [getPanel, setPanel] = createSignal(STARTING_PANEL);

    const switchPanel = async () => {
        const shape = access(props.shape);
        const origin = access(props.origin);
        const panel = NEXT_PANEL[getPanel()];

        const hasAnimated = await ShapeRevealUtils.reveal(() => setPanel(panel), {
            origin: origin === ShapeRevealKnobs.BUTTON ? (document.getElementById(SWITCH_ID) ?? undefined) : origin,
            durationMs: access(props.durationMs),
            blur: access(props.blur),
            computePoints: toComputePoints(shape),
        });

        props.onRun({ shape, origin, hasAnimated, panel });
    };

    return (
        <div class={styles.stage}>
            <div class={[styles.panel, getPanel() === "dawn" ? styles.panelDawn : styles.panelDusk].join(" ")}>
                <span class={styles.panelTitle}>{PANEL_TITLES[getPanel()]}</span>
                <span class={styles.panelLine}>{PANEL_LINES[getPanel()]}</span>
            </div>

            <Button
                id={SWITCH_ID}
                renderContent={(getFlags) => (
                    <PageControlButtonContent flags={getFlags}>Switch</PageControlButtonContent>
                )}
                onClick={switchPanel}
            />
        </div>
    );
};
