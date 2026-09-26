import { Show } from "solid-js";

import { Button, access } from "@thewaver/ss-components";

import { PageEraCycleContent } from "../../StyledComponents/EraCycleContent/EraCycleContent";
import type { EraCycleProps } from "./EraCycle.types";

const SINGLE_ERA = 1;

export const PageEraCycle = (props: EraCycleProps) => {
    const getCurrent = () => access(props.options).find((option) => option.id === access(props.era));

    const getLabel = () => getCurrent()?.name ?? access(props.era);

    const advance = () => {
        const options = access(props.options);
        const index = options.findIndex((option) => option.id === access(props.era));

        props.onChange(options[(index + 1) % options.length].id);
    };

    return (
        <Show when={access(props.options).length > SINGLE_ERA}>
            <Button
                isDisabled={props.isDisabled}
                ariaLabel={() => `Era: ${getLabel()}`}
                onClick={advance}
                renderContent={(getFlags) => (
                    <PageEraCycleContent flags={getFlags}>
                        {getCurrent()?.shortName ?? access(props.era)}
                    </PageEraCycleContent>
                )}
            />
        </Show>
    );
};
