import { useState } from "react";

import { Button, CornerHighlight, type InteractionActivation } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageRipple } from "../../../StyledComponents/Ripple/Ripple";

export const DecoratedDocsExample = () => {
    const [isPressed, setIsPressed] = useState(false);
    const [activation, setActivation] = useState<InteractionActivation>();

    return (
        <Button
            isPressed={isPressed}
            renderContent={(flags) => <PageButtonContent flags={flags}>Toggle Me</PageButtonContent>}
            renderDecoration={(flags) => (
                <>
                    <CornerHighlight color={flags.isPressed ? "yellow" : "transparent"} />
                    <PageRipple activation={activation} color={"yellow"} />
                </>
            )}
            onActivation={setActivation}
            onClick={() => {
                setIsPressed((prev) => !prev);
            }}
        />
    );
};
