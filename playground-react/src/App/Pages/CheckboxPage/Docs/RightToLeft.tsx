import { useState } from "react";

import { Checkbox } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const RightToLeftDocsExample = () => {
    const checkedState = useState(true);

    return (
        <div dir={"rtl"}>
            <Checkbox
                checked={checkedState}
                ariaLabel={"Remember me"}
                renderContent={(flags) => <PageCheckboxContent flags={flags}>Remember me</PageCheckboxContent>}
            />
        </div>
    );
};
