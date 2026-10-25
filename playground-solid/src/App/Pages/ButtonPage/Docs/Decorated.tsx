import { createSignal } from "solid-js";

import { Button, CornerHighlight, type InteractionActivation } from "@thewaver/ss-components-solid";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageRipple } from "../../../StyledComponents/Ripple/Ripple";

export const DecoratedDocsExample = () => {
    const [getIsPressed, setIsPressed] = createSignal(false);
    const [getActivation, setActivation] = createSignal<InteractionActivation>();

    return (
        <Button
            isPressed={getIsPressed}
            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Toggle Me</PageButtonContent>}
            renderDecoration={(getFlags) => (
                <>
                    <CornerHighlight color={() => (getFlags().isPressed ? "yellow" : "transparent")} />
                    <PageRipple activation={getActivation} color={"yellow"} />
                </>
            )}
            onActivation={setActivation}
            onClick={() => {
                setIsPressed((prev) => !prev);
            }}
        />
    );
};
