import { useEffect, useState } from "react";

import { Typewriter } from "@thewaver/ss-components-react";
import { FunctionUtils } from "@thewaver/ss-utils";

import type { TypewriterExampleProps } from "../TypewriterPage.types";

type Props = TypewriterExampleProps & {
    text: string;
};

export const CustomInputExample = (props: Props) => {
    const [text, setText] = useState(props.text);
    const [setTextDebounced] = useState(() => FunctionUtils.debounce(setText, 500));

    useEffect(() => setTextDebounced.cancel, [setTextDebounced]);

    useEffect(() => setTextDebounced(props.text), [props.text, setTextDebounced]);

    return (
        <Typewriter animationName={props.animationName} computeCharacterWeights={props.computeCharacterWeights}>
            {text}
        </Typewriter>
    );
};
