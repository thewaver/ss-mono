import { useState } from "react";

import { Button, SpotlightPrompt } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";
import type { SpotlightBasicDocsExampleProps } from "../../SpotlightsReact.types";

type Props = SpotlightBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const visibility = useState(false);
    const [isVisible, setIsVisible] = visibility;
    const [bought, setBought] = useState(0);
    const [anchorRef, setAnchorRef] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.root}>
            <Button
                id={"promptBuy"}
                ref={setAnchorRef}
                renderContent={(flags) => <PageButtonContent flags={flags}>Buy the potato</PageButtonContent>}
                onClick={() => {
                    if (!isVisible) return;

                    setBought((count) => count + 1);
                    setIsVisible(false);
                }}
            />

            <Button
                id={"promptInsist"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Insist</PageButtonContent>}
                onClick={() => {
                    setIsVisible(true);
                }}
            />

            <SpotlightPrompt
                elementRef={anchorRef ?? undefined}
                padding={props.padding}
                transitionDurationMs={props.transitionDurationMs}
                visibility={visibility}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Bought: ${bought}`}
            </div>
        </div>
    );
};
