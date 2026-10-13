import { useState } from "react";

import { Button } from "@thewaver/ss-components-react";
import { TagInputKnobs } from "@thewaver/ss-playground/App/Knobs/TagInputs.const";
import {
    CROWDED_TAGS,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    NARROW_WIDTH,
    STARTING_TAGS,
} from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { CrowdedExample } from "./Examples/Crowded";
import { DefaultExample } from "./Examples/Default";
import { UniqueExample } from "./Examples/Unique";
import type { TagInputExampleProps } from "./TagInputPage.types";

export const TagInputPage = () => {
    const [isDisabled, setIsDisabled] = useState(TagInputKnobs.STARTING_IS_DISABLED);
    const [hasError, setHasError] = useState(TagInputKnobs.STARTING_HAS_ERROR);

    const defaultState = useState(STARTING_TAGS);
    const uniqueState = useState(STARTING_TAGS);
    const crowdedState = useState(CROWDED_TAGS);
    const emptyState = useState<string[]>([]);

    const reset = () => {
        defaultState[1](STARTING_TAGS);
        uniqueState[1](STARTING_TAGS);
        crowdedState[1](CROWDED_TAGS);
        emptyState[1]([]);
    };

    const commonProps: Omit<TagInputExampleProps, "value"> = {
        isDisabled,
        hasError,
    };

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `tags: ${defaultState[0].join(", ") || "none"}`,
            component: () => <DefaultExample {...commonProps} value={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "empty",
            name: EXAMPLE_NAMES.empty,
            readout: () => `tags: ${emptyState[0].join(", ") || "none"}`,
            component: () => <DefaultExample {...commonProps} value={emptyState} ariaLabel={"Empty topics"} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "unique",
            name: EXAMPLE_NAMES.unique,
            readout: () => `tags: ${uniqueState[0].join(", ") || "none"} — the same word twice is refused`,
            component: () => <UniqueExample {...commonProps} value={uniqueState} />,
            path: `${EXAMPLES_ROOT}/Unique.tsx`,
        },
        {
            key: "crowded",
            name: EXAMPLE_NAMES.crowded,
            readout: () =>
                `${crowdedState[0].length} tags in ${NARROW_WIDTH}px — they wrap and the box grows with them`,
            component: () => <CrowdedExample {...commonProps} value={crowdedState} />,
            path: `${EXAMPLES_ROOT}/Crowded.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns the field off: no tag can be added, and none can be removed."}
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    itemKey={"hasError"}
                    label={"Error"}
                    hint={"Puts the field into its error look, without changing what it accepts."}
                >
                    <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                </PageProp>

                <PageProp
                    itemKey={"tags"}
                    label={"Tags"}
                    hint={"Puts the examples back to the tags they started with."}
                >
                    <Button
                        renderContent={(flags) => <PageButtonContent flags={flags}>Reset</PageButtonContent>}
                        onClick={async () => {
                            reset();
                        }}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
