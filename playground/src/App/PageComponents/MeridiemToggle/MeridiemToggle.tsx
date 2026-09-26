import { Button, access } from "@thewaver/ss-components";

import { PageMeridiemToggleContent } from "../../StyledComponents/MeridiemToggleContent/MeridiemToggleContent";
import type { MeridiemToggleProps } from "./MeridiemToggle.types";

export const PageMeridiemToggle = (props: MeridiemToggleProps) => {
    return (
        <Button
            isDisabled={props.isDisabled}
            ariaLabel={() => `Before or after noon: ${access(props.meridiem) === "am" ? "AM" : "PM"}`}
            onClick={props.onToggle}
            renderContent={(getFlags) => <PageMeridiemToggleContent flags={getFlags} meridiem={props.meridiem} />}
        />
    );
};
