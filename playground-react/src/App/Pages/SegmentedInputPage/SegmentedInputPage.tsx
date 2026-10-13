import { useState } from "react";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    ONE_TIME_CODE_LENGTH,
    RECOVERY_CODE_LENGTH,
} from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { OneTimeCodeExample } from "./Examples/OneTimeCode";
import { RecoveryCodeExample } from "./Examples/RecoveryCode";

export const SegmentedInputPage = () => {
    const oneTimeCodeState = useState("");
    const recoveryCodeState = useState("");

    const examples = [
        {
            key: "oneTimeCode",
            name: EXAMPLE_NAMES.oneTimeCode,
            readout: () =>
                `value: "${oneTimeCodeState[0]}" — ${ONE_TIME_CODE_LENGTH} digits in one field; press a cell to put the caret there`,
            component: () => <OneTimeCodeExample value={oneTimeCodeState} />,
            path: `${EXAMPLES_ROOT}/OneTimeCode.tsx`,
        },
        {
            key: "recoveryCode",
            name: EXAMPLE_NAMES.recoveryCode,
            readout: () =>
                `value: "${recoveryCodeState[0]}" — ${RECOVERY_CODE_LENGTH} cells taking letters and digits, anything else refused`,
            component: () => <RecoveryCodeExample value={recoveryCodeState} />,
            path: `${EXAMPLES_ROOT}/RecoveryCode.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
