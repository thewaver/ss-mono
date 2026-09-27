import { Button } from "@thewaver/ss-components-react";

import { PageMeridiemToggleContent } from "../../StyledComponents/MeridiemToggleContent/MeridiemToggleContent";
import type { MeridiemToggleProps } from "./MeridiemToggle.types";

export const PageMeridiemToggle = (props: MeridiemToggleProps) => {
    return (
        <Button
            isDisabled={props.isDisabled}
            ariaLabel={`Before or after noon: ${props.meridiem === "am" ? "AM" : "PM"}`}
            onClick={props.onToggle}
            renderContent={(flags) => <PageMeridiemToggleContent flags={flags} meridiem={props.meridiem} />}
        />
    );
};
