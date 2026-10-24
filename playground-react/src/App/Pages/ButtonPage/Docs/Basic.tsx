import { useState } from "react";

import { Button } from "@thewaver/ss-components-react";

import type { ButtonDocsExampleProps } from "../ButtonPageReact.types";
import { PressedButtonContent } from "./PressedButtonContent";

type Props = ButtonDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [clicks, setClicks] = useState(0);

    return (
        <Button
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            isPressed={props.isPressed}
            renderContent={(flags) => <PressedButtonContent flags={flags}>{`Clicks: ${clicks}`}</PressedButtonContent>}
            onClick={() => {
                setClicks((prev) => prev + 1);
            }}
        />
    );
};
