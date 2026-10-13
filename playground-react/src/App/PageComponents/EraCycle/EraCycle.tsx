import { Button } from "@thewaver/ss-components-react";
import { SINGLE_ERA } from "@thewaver/ss-playground/App/PageComponents/EraCycle/EraCycle.const";

import { PageEraCycleContent } from "../../StyledComponents/EraCycleContent/EraCycleContent";
import type { EraCycleProps } from "./EraCycleReact.types";

export const PageEraCycle = (props: EraCycleProps) => {
    const current = props.options.find((option) => option.id === props.era);

    const label = current?.name ?? props.era;

    const advance = () => {
        const index = props.options.findIndex((option) => option.id === props.era);

        props.onChange(props.options[(index + 1) % props.options.length].id);
    };

    if (props.options.length <= SINGLE_ERA) return null;

    return (
        <Button
            isDisabled={props.isDisabled}
            ariaLabel={`Era: ${label}`}
            onClick={advance}
            renderContent={(flags) => (
                <PageEraCycleContent flags={flags}>{current?.shortName ?? props.era}</PageEraCycleContent>
            )}
        />
    );
};
