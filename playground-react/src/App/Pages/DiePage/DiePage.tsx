import { useState } from "react";

import { DIE_DEFAULTS, DieShapes, MediaQueryMonitorReactUtils } from "@thewaver/ss-components-react";
import { DieKnobs } from "@thewaver/ss-playground/App/Knobs/Dice.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { TabletopExample } from "./Examples/Tabletop";

const EXAMPLES_ROOT = "/src/App/Pages/DiePage/Examples";

const DIE_SIZE = 160;
const NO_MOTION_DURATION_MS = 0;
const FIRST_NUMBER = 1;

export const DiePage = () => {
    const [shapeKey, setShapeKey] = useState<DieShapes.SampleKey>(DieKnobs.STARTING_SHAPE_KEY);
    const [rollDurationMs, setRollDurationMs] = useState(DIE_DEFAULTS.rollDurationMs);
    const [tumbleCount, setTumbleCount] = useState(DIE_DEFAULTS.tumbleCount);

    const dieFaceState = useState(0);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const shownRollDurationMs = prefersReducedMotion ? NO_MOTION_DURATION_MS : rollDurationMs;

    const examples = [
        {
            key: "tabletop",
            name: "Tabletop die",
            readout: () =>
                `showing ${dieFaceState[0] + FIRST_NUMBER} of ${DieShapes.SAMPLE_SHAPES[shapeKey].faces.length} — the page picks the number, and the die tumbles and lands on it`,
            component: () => (
                <TabletopExample
                    shape={DieShapes.SAMPLE_SHAPES[shapeKey]}
                    size={DIE_SIZE}
                    rollDurationMs={shownRollDurationMs}
                    tumbleCount={tumbleCount}
                    faceState={dieFaceState}
                />
            ),
            path: `${EXAMPLES_ROOT}/Tabletop.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"shape"} label={"Die"} hint={"Which die to roll, from four faces to a hundred."}>
                    <PageSelectField
                        value={shapeKey}
                        values={DieShapes.SAMPLE_KEYS}
                        ariaLabel={"Die"}
                        onChange={(key) => setShapeKey(key)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"rollDurationMs"}
                    label={"Roll duration (ms)"}
                    hint={"How long a roll takes to land. It is off while the visitor has asked for reduced motion."}
                >
                    <PageNumberField
                        value={rollDurationMs}
                        min={DieKnobs.MIN_ROLL_DURATION_MS}
                        max={DieKnobs.MAX_ROLL_DURATION_MS}
                        step={DieKnobs.ROLL_DURATION_STEP_MS}
                        isDisabled={prefersReducedMotion}
                        ariaLabel={"Roll duration in milliseconds"}
                        onInput={setRollDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"tumbleCount"}
                    label={"Tumbles"}
                    hint={"How many whole turns a roll makes on its way."}
                >
                    <PageNumberField
                        value={tumbleCount}
                        min={DieKnobs.MIN_TUMBLE_COUNT}
                        max={DieKnobs.MAX_TUMBLE_COUNT}
                        step={DieKnobs.TUMBLE_COUNT_STEP}
                        ariaLabel={"Tumbles"}
                        onInput={setTumbleCount}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
