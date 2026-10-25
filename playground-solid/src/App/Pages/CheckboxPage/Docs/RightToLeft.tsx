import { createSignal } from "solid-js";

import { Checkbox } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const RightToLeftDocsExample = () => {
    const checkedSignal = createSignal(true);

    return (
        <div dir={"rtl"}>
            <Checkbox
                checked={checkedSignal}
                ariaLabel={"Remember me"}
                renderContent={(getFlags) => <PageCheckboxContent flags={getFlags}>Remember me</PageCheckboxContent>}
            />
        </div>
    );
};
