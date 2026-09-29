import { useState } from "react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";
import { DestructiveConfirmationExample } from "./Examples/DestructiveConfirmation";
import { LayeredExample } from "./Examples/Layered";
import { TextOnlyExample } from "./Examples/TextOnly";

const EXAMPLES_ROOT = "/src/App/Pages/ModalPage/Examples";

export const ModalPage = () => {
    const modalVisibility = useState(false);
    const destructiveVisibility = useState(false);
    const layeredVisibility = useState(false);
    const layeredState = useState<string | undefined>();
    const textOnlyVisibility = useState(false);

    const [outcome, setOutcome] = useState("nothing decided yet");

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () => `open: ${modalVisibility[0]} — Escape and an overlay click both dismiss it`,
            component: () => <DefaultExample visibility={modalVisibility} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "destructiveConfirmation",
            name: "Destructive confirmation",
            readout: () =>
                `open: ${destructiveVisibility[0]} | outcome: ${outcome} — the alertdialog role, a required focus target, and neither overlay nor Escape dismissal`,
            component: () => (
                <DestructiveConfirmationExample visibility={destructiveVisibility} onDecide={setOutcome} />
            ),
            path: `${EXAMPLES_ROOT}/DestructiveConfirmation.tsx`,
        },
        {
            key: "layered",
            name: "A popup inside it",
            readout: () =>
                `open: ${layeredVisibility[0]} | country: ${layeredState[0] ?? "undefined"} — Escape closes the innermost layer only`,
            component: () => <LayeredExample visibility={layeredVisibility} value={layeredState} />,
            path: `${EXAMPLES_ROOT}/Layered.tsx`,
        },
        {
            key: "textOnly",
            name: "Nothing focusable inside",
            readout: () =>
                `open: ${textOnlyVisibility[0]} — with nothing to focus inside, the dialog takes focus itself`,
            component: () => <TextOnlyExample visibility={textOnlyVisibility} />,
            path: `${EXAMPLES_ROOT}/TextOnly.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
