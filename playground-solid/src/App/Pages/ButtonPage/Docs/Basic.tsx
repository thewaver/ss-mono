import { createSignal } from "solid-js";

import { Button } from "@thewaver/ss-components-solid";

import type { ButtonDocsExampleProps } from "../ButtonPageSolid.types";
import { PressedButtonContent } from "./PressedButtonContent";

type Props = ButtonDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getClicks, setClicks] = createSignal(0);

    return (
        <Button
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            isPressed={props.isPressed}
            renderContent={(getFlags) => (
                <PressedButtonContent flags={getFlags}>{`Clicks: ${getClicks()}`}</PressedButtonContent>
            )}
            onClick={() => {
                setClicks((clicks) => clicks + 1);
            }}
        />
    );
};
