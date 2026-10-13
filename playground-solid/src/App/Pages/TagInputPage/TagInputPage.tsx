import { createMemo, createSignal } from "solid-js";

import { Button } from "@thewaver/ss-components-solid";
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
    const [getIsDisabled, setIsDisabled] = createSignal(TagInputKnobs.STARTING_IS_DISABLED);
    const [getHasError, setHasError] = createSignal(TagInputKnobs.STARTING_HAS_ERROR);

    const defaultSignal = createSignal(STARTING_TAGS);
    const uniqueSignal = createSignal(STARTING_TAGS);
    const crowdedSignal = createSignal(CROWDED_TAGS);
    const emptySignal = createSignal<string[]>([]);

    const reset = () => {
        defaultSignal[1](STARTING_TAGS);
        uniqueSignal[1](STARTING_TAGS);
        crowdedSignal[1](CROWDED_TAGS);
        emptySignal[1]([]);
    };

    const getExamples = createMemo(() => {
        const commonProps: Omit<TagInputExampleProps, "value"> = {
            isDisabled: getIsDisabled,
            hasError: getHasError,
        };

        return [
            {
                key: "default",
                name: EXAMPLE_NAMES.default,
                readout: () => `tags: ${defaultSignal[0]().join(", ") || "none"}`,
                component: () => <DefaultExample {...commonProps} value={defaultSignal} />,
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
            {
                key: "empty",
                name: EXAMPLE_NAMES.empty,
                readout: () => `tags: ${emptySignal[0]().join(", ") || "none"}`,
                component: () => <DefaultExample {...commonProps} value={emptySignal} ariaLabel={"Empty topics"} />,
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
            {
                key: "unique",
                name: EXAMPLE_NAMES.unique,
                readout: () => `tags: ${uniqueSignal[0]().join(", ") || "none"} — the same word twice is refused`,
                component: () => <UniqueExample {...commonProps} value={uniqueSignal} />,
                path: `${EXAMPLES_ROOT}/Unique.tsx`,
            },
            {
                key: "crowded",
                name: EXAMPLE_NAMES.crowded,
                readout: () =>
                    `${crowdedSignal[0]().length} tags in ${NARROW_WIDTH}px — they wrap and the box grows with them`,
                component: () => <CrowdedExample {...commonProps} value={crowdedSignal} />,
                path: `${EXAMPLES_ROOT}/Crowded.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns the field off: no tag can be added, and none can be removed."}
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    key={"hasError"}
                    label={"Error"}
                    hint={"Puts the field into its error look, without changing what it accepts."}
                >
                    <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                </PageProp>

                <PageProp key={"tags"} label={"Tags"} hint={"Puts the examples back to the tags they started with."}>
                    <Button
                        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
                        onClick={async () => {
                            reset();
                        }}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
