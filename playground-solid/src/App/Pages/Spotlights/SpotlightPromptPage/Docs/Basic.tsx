import { createSignal } from "solid-js";

import { Button, SpotlightPrompt } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";
import type { SpotlightBasicDocsExampleProps } from "../../SpotlightsSolid.types";

type Props = SpotlightBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const visibility = createSignal(false);
    const [getBought, setBought] = createSignal(0);
    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.root}>
            <Button
                id={"promptBuy"}
                ref={setAnchorRef}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Buy the potato</PageButtonContent>}
                onClick={() => {
                    if (!visibility[0]()) return;

                    setBought((bought) => bought + 1);
                    visibility[1](false);
                }}
            />

            <Button
                id={"promptInsist"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Insist</PageButtonContent>}
                onClick={() => {
                    visibility[1](true);
                }}
            />

            <SpotlightPrompt
                elementRef={getAnchorRef}
                padding={props.padding}
                transitionDurationMs={props.transitionDurationMs}
                visibility={visibility}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Bought: ${getBought()}`}
            </div>
        </div>
    );
};
