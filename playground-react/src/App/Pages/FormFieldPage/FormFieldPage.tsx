import { useState } from "react";

import type { FormFieldOrientation } from "@thewaver/ss-components-react";
import { FORM_FIELD_DEFAULTS, FORM_FIELD_ORIENTATIONS } from "@thewaver/ss-components-react";
import { FormFieldKnobs } from "@thewaver/ss-playground/App/Knobs/FormFields.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField, PageTextField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DefaultExample } from "./Examples/Default";
import { ForeignExample } from "./Examples/Foreign";
import { InFormExample } from "./Examples/InForm";
import type { FormFieldExampleProps } from "./FormFieldPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/FormFieldPage/Examples";

const FIELD_WIDTH = 110;
const MESSAGE_WIDTH = 240;

export const FormFieldPage = () => {
    const [orientation, setOrientation] = useState<FormFieldOrientation>(FORM_FIELD_DEFAULTS.orientation);
    const [gap, setGap] = useState(FORM_FIELD_DEFAULTS.gap);
    const [message, setMessage] = useState(FormFieldKnobs.STARTING_MESSAGE);
    const [hasError, setHasError] = useState(FormFieldKnobs.STARTING_HAS_ERROR);

    const defaultState = useState("");
    const foreignState = useState("");
    const formState = useState("");

    const commonProps: Omit<FormFieldExampleProps, "valueState"> = {
        orientation,
        gap,
        message,
        hasError,
    };

    const examples = [
        {
            key: "default",
            name: "Around a control of the library's",
            readout: () =>
                message.length > 0
                    ? "the message has an id of its own and the control inside is pointed at it, without either of them being told the other's name"
                    : "with no message there is no element and no reference — an empty message is not an empty box",
            component: () => <DefaultExample {...commonProps} valueState={defaultState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "foreign",
            name: "Around a control it has never seen",
            readout: () =>
                "a plain input, which knows nothing about any of this — one call to FormFieldReactUtils.useAriaDescribedBy gets it the same wiring the library's own controls get for free",
            component: () => <ForeignExample {...commonProps} valueState={foreignState} />,
            path: `${EXAMPLES_ROOT}/Foreign.tsx`,
        },
        {
            key: "inForm",
            name: "Inside a form",
            readout: () =>
                "turn the error on — the field tells the form, and the form's own validity is what disables the button; nothing here reads the other's state directly",
            component: () => <InFormExample {...commonProps} valueState={formState} />,
            path: `${EXAMPLES_ROOT}/InForm.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"orientation"}
                    label={"Orientation"}
                    hint={"Whether the label sits above the control or beside it."}
                >
                    <PageSelectField
                        value={orientation}
                        values={FORM_FIELD_ORIENTATIONS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Orientation"}
                        onChange={setOrientation}
                    />
                </PageProp>

                <PageProp
                    itemKey={"gap"}
                    label={"Gap (px)"}
                    hint={"The space between the label, the control and the message."}
                >
                    <PageNumberField
                        value={gap}
                        min={FormFieldKnobs.MIN_GAP}
                        max={FormFieldKnobs.MAX_GAP}
                        step={FormFieldKnobs.GAP_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Gap in pixels"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp
                    itemKey={"message"}
                    label={"Message"}
                    hint={"The line shown under the control. Leave it empty and no line is rendered at all."}
                >
                    <PageTextField
                        value={message}
                        width={MESSAGE_WIDTH}
                        placeholder={"No message"}
                        ariaLabel={"Message"}
                        onInput={setMessage}
                    />
                </PageProp>

                <PageProp
                    itemKey={"hasError"}
                    label={"In error"}
                    hint={
                        "Puts the field into its error look and reads the message out as the error rather than as help."
                    }
                >
                    <PageCheckField value={hasError} ariaLabel={"In error"} onChange={setHasError} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
