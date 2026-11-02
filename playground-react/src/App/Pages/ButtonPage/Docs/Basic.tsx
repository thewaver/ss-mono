import { useState } from "react";

import { Button } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ButtonDocsExampleProps } from "../ButtonPageReact.types";

type Props = ButtonDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [clicks, setClicks] = useState(0);

    return (
        <Button
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            isPressed={props.isPressed}
            renderContent={(flags) => <PageButtonContent flags={flags}>{`Clicks: ${clicks}`}</PageButtonContent>}
            onClick={() => {
                setClicks((prev) => prev + 1);
            }}
        />
    );
};
