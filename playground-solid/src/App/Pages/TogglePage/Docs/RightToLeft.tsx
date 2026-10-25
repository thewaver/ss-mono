import { createSignal } from "solid-js";

import { Toggle } from "@thewaver/ss-components-solid";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";

export const RightToLeftDocsExample = () => {
    const checkedSignal = createSignal(false);

    return (
        <div dir={"rtl"}>
            <Toggle
                checked={checkedSignal}
                ariaLabel={"Send notifications"}
                renderContent={(getFlags) => <PageToggleContent flags={getFlags}>Send notifications</PageToggleContent>}
            />
        </div>
    );
};
