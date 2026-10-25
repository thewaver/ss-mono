import { useState } from "react";

import { Toggle } from "@thewaver/ss-components-react";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";

export const RightToLeftDocsExample = () => {
    const checkedState = useState(false);

    return (
        <div dir={"rtl"}>
            <Toggle
                checked={checkedState}
                ariaLabel={"Send notifications"}
                renderContent={(flags) => <PageToggleContent flags={flags}>Send notifications</PageToggleContent>}
            />
        </div>
    );
};
