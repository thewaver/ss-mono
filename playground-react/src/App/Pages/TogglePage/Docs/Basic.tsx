import { useState } from "react";

import { Toggle } from "@thewaver/ss-components-react";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import type { ToggleBasicDocsExampleProps } from "../TogglePageReact.types";

type Props = ToggleBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const checkedState = useState(false);

    return (
        <Toggle
            checked={checkedState}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Default toggle"}
            renderContent={(flags) => <PageToggleContent flags={flags}>Default toggle</PageToggleContent>}
        />
    );
};
