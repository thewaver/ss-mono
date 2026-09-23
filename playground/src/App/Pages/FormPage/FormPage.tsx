import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { FocusOnErrorExample } from "./Examples/FocusOnError";
import { SignUpExample } from "./Examples/SignUp";
import type { FormExampleProps } from "./FormPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/FormPage/Examples";

export const FormPage = () => {
    const emailSignal = createSignal("");
    const passwordSignal = createSignal("");
    const termsSignal = createSignal(false);

    const [getOutcome, setOutcome] = createSignal("not submitted");

    const planSignal = createSignal<string | undefined>();
    const topicsSignal = createSignal<string[]>([]);

    const [getFocusOutcome, setFocusOutcome] = createSignal("not submitted");

    const getExamples = createMemo(() => {
        const commonProps: FormExampleProps = {
            emailSignal,
            passwordSignal,
            termsSignal,
            onSubmit: () => {
                setOutcome(`submitted as ${emailSignal[0]()}`);
            },
            onReset: () => {
                setOutcome("not submitted");
            },
        };

        return [
            {
                key: "reportsValidity",
                name: "A form that reports its own validity",
                readout: () => `outcome: ${getOutcome()}`,
                component: () => <SignUpExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/SignUp.tsx`,
            },
            {
                key: "focusOnError",
                name: "Submitting moves focus to the first error",
                readout: () =>
                    `outcome: ${getFocusOutcome()} — the handler runs either way, and afterwards focus lands on the first field reporting an error`,
                component: () => (
                    <FocusOnErrorExample
                        planSignal={planSignal}
                        topicsSignal={topicsSignal}
                        onSubmit={() => {
                            setFocusOutcome(
                                `submitted as ${planSignal[0]() ?? "no plan"}, [${topicsSignal[0]().join(", ")}]`,
                            );
                        }}
                        onReset={() => {
                            planSignal[1](undefined);
                            topicsSignal[1]([]);
                            setFocusOutcome("not submitted");
                        }}
                    />
                ),
                path: `${EXAMPLES_ROOT}/FocusOnError.tsx`,
            },
        ];
    });

    return <PageExamples items={getExamples} />;
};
