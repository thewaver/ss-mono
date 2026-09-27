import { createSignal } from "solid-js";

import { Button, SpotlightPrompt } from "@thewaver/ss-components-solid";
import { PADDING } from "@thewaver/ss-playground-core/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/Spotlights/Spotlights.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";
import type { SpotlightPromptExampleProps } from "../../Spotlights.types";

type Props = SpotlightPromptExampleProps;

export const PromptExample = (props: Props) => {
    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.root}>
            <Button
                ref={setAnchorRef}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Buy the potato</PageButtonContent>}
                onClick={async () => {
                    if (!props.visibilitySignal[0]()) return;

                    props.onBuy();
                    props.visibilitySignal[1](false);
                }}
            />

            <Button
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Insist</PageButtonContent>}
                onClick={async () => {
                    props.visibilitySignal[1](true);
                }}
            />

            <SpotlightPrompt
                elementRef={getAnchorRef}
                padding={() => PADDING}
                visibilitySignal={props.visibilitySignal}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />
        </div>
    );
};
