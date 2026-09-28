import { useState } from "react";

import { Button, SpotlightPrompt } from "@thewaver/ss-components-react";
import { PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";
import type { SpotlightPromptExampleProps } from "../../Spotlights.types";

type Props = SpotlightPromptExampleProps;

export const PromptExample = (props: Props) => {
    const [anchorRef, setAnchorRef] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.root}>
            <Button
                ref={setAnchorRef}
                renderContent={(flags) => <PageButtonContent flags={flags}>Buy the potato</PageButtonContent>}
                onClick={async () => {
                    if (!props.visibilityState[0]) return;

                    props.onBuy();
                    props.visibilityState[1](false);
                }}
            />

            <Button
                renderContent={(flags) => <PageButtonContent flags={flags}>Insist</PageButtonContent>}
                onClick={async () => {
                    props.visibilityState[1](true);
                }}
            />

            <SpotlightPrompt
                elementRef={anchorRef ?? undefined}
                padding={PADDING}
                visibilityState={props.visibilityState}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />
        </div>
    );
};
