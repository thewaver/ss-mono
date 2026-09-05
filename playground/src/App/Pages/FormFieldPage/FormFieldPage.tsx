import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField, PageSelectField, PageTextField } from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import { ForeignExample } from "./Examples/Foreign";
import { InFormExample } from "./Examples/InForm";
import type { FormFieldExampleProps } from "./FormFieldPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/FormFieldPage/Examples";

const DIRECTIONS: ("column" | "row")[] = ["column", "row"];

const MIN_GAP = 0;
const MAX_GAP = 40;
const GAP_STEP = 5;
const FIELD_WIDTH = 110;
const MESSAGE_WIDTH = 240;

const STARTING_DIRECTION = "column" as const;
const STARTING_GAP = 5;
const STARTING_MESSAGE = "Shown to everyone who can see your posts.";

export const FormFieldPage = () => {
    const [getDirection, setDirection] = createSignal<"column" | "row">(STARTING_DIRECTION);
    const [getGap, setGap] = createSignal(STARTING_GAP);
    const [getMessage, setMessage] = createSignal(STARTING_MESSAGE);
    const [getHasError, setHasError] = createSignal(false);

    const defaultSignal = createSignal("");
    const foreignSignal = createSignal("");
    const formSignal = createSignal("");

    const getExamples = createMemo(() => {
        const commonProps: Omit<FormFieldExampleProps, "valueSignal"> = {
            dir: getDirection,
            gap: getGap,
            message: getMessage,
            hasError: getHasError,
        };

        return [
            {
                key: "default",
                name: "Around a control of the library's",
                readout: () =>
                    getMessage().length > 0
                        ? "the message has an id of its own and the control inside is pointed at it, without either of them being told the other's name"
                        : "with no message there is no element and no reference — an empty message is not an empty box",
                component: () => <DefaultExample {...commonProps} valueSignal={defaultSignal} />,
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
            {
                key: "foreign",
                name: "Around a control it has never seen",
                readout: () =>
                    "a plain input, which knows nothing about any of this — one call to FormFieldUtils.resolveAriaDescribedBy gets it the same wiring the library's own controls get for free",
                component: () => <ForeignExample {...commonProps} valueSignal={foreignSignal} />,
                path: `${EXAMPLES_ROOT}/Foreign.tsx`,
            },
            {
                key: "inForm",
                name: "Inside a form",
                readout: () =>
                    "turn the error on — the field tells the form, and the form's own validity is what disables the button; nothing here reads the other's state directly",
                component: () => <InFormExample {...commonProps} valueSignal={formSignal} />,
                path: `${EXAMPLES_ROOT}/InForm.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"dir"} label={"Direction"}>
                    <PageSelectField
                        value={getDirection}
                        values={() => DIRECTIONS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Direction"}
                        onChange={(direction) => setDirection(() => direction)}
                    />
                </PageProp>

                <PageProp key={"gap"} label={"Gap (px)"}>
                    <PageNumberField
                        value={getGap}
                        min={() => MIN_GAP}
                        max={() => MAX_GAP}
                        step={() => GAP_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Gap in pixels"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp key={"message"} label={"Message"}>
                    <PageTextField
                        value={getMessage}
                        width={() => MESSAGE_WIDTH}
                        placeholder={"No message"}
                        ariaLabel={"Message"}
                        onInput={setMessage}
                    />
                </PageProp>

                <PageProp key={"hasError"} label={"In error"}>
                    <PageCheckField value={getHasError} ariaLabel={"In error"} onChange={setHasError} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
