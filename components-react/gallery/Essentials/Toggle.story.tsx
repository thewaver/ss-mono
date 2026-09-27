import { useState } from "react";

import type { InteractionFlags } from "@thewaver/ss-components";

import { Toggle } from "../../src";

const Track = ({ flags }: { flags: InteractionFlags }) => (
    <span
        style={{
            display: "block",
            width: 36,
            height: 20,
            borderRadius: 10,
            border: "1px solid black",
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    />
);

export const Default = () => {
    const checkedState = useState(false);

    return (
        <>
            <Toggle
                id="toggle"
                ariaLabel="Notifications"
                checkedState={checkedState}
                renderContent={(flags) => <Track flags={flags} />}
            />
            <output data-readout="checked">{String(checkedState[0])}</output>
        </>
    );
};

export const Mixed = () => {
    const [first, setFirst] = useState(true);
    const [second, setSecond] = useState(false);

    return (
        <>
            <Toggle
                id="allSettings"
                ariaLabel="All settings"
                checkedState={[first && second, () => undefined]}
                isMixed={first !== second}
                renderContent={(flags) => <Track flags={flags} />}
                onChange={(isChecked) => {
                    setFirst(isChecked);
                    setSecond(isChecked);
                }}
            />
            <Toggle
                id="firstSetting"
                ariaLabel="First setting"
                checkedState={[first, setFirst]}
                renderContent={(flags) => <Track flags={flags} />}
            />
            <Toggle
                id="secondSetting"
                ariaLabel="Second setting"
                checkedState={[second, setSecond]}
                renderContent={(flags) => <Track flags={flags} />}
            />
        </>
    );
};
