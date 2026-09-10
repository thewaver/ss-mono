import { createMemo } from "solid-js";
import { createStore } from "solid-js/store";

import type { BandDefs, SampleKnob } from "@thewaver/ss-components";
import { PlacementLayoutKnobs, PlacementLayoutUtils } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { MenuExample } from "./Examples/Menu";
import { WheelExample } from "./Examples/Wheel";
import type { PlacementExampleProps } from "./PlacementPage.types";

const FIELD_WIDTH = 130;
const EXAMPLES_ROOT = "/src/App/Pages/PlacementPage/Examples";
const WHEEL_SIZE = 340;

export const PlacementPage = () => {
    const [bandDefs, setBandDefs] = createStore<Record<string, number | boolean>>({});

    const getKnobs = () => PlacementLayoutKnobs.BAND_KNOBS as Record<string, SampleKnob>;
    const getDefaults = () => PlacementLayoutUtils.BAND_DEFAULTS as Record<string, unknown>;
    const getLayoutDefs = createMemo(() => bandDefs as BandDefs);

    const getExamples = createMemo(() => {
        const commonProps: PlacementExampleProps = { getLayoutDefs };

        return [
            {
                key: "menu",
                name: "A menu of wedges",
                readout: () =>
                    "the same layout laid over a Menu — every level is a band, and the hole holds the control that closes it",
                component: () => <MenuExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Menu.tsx`,
            },
            {
                key: "wheel",
                name: "A wheel of wedges",
                readout: () =>
                    "and over an OverheadWheel, which asks the same function for the shape of one wedge and turns copies of it",
                component: () => (
                    <PageMeasureBox width={() => WHEEL_SIZE}>
                        <WheelExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Wheel.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageKnobs
                    knobs={getKnobs}
                    defaults={getDefaults}
                    values={() => bandDefs}
                    width={() => FIELD_WIDTH}
                    onInput={(key, value) => setBandDefs(key, value)}
                />
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
