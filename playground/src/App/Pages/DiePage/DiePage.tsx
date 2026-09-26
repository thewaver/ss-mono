import { createMemo, createSignal } from "solid-js";

import { DIE_DEFAULTS, DieShapes, MediaQueryMonitorUtils } from "@thewaver/ss-components";

import { DieKnobs } from "../../Knobs/Dice.const";
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
    const [getShapeKey, setShapeKey] = createSignal<DieShapes.SampleKey>(DieKnobs.STARTING_SHAPE_KEY);
    const [getRollDurationMs, setRollDurationMs] = createSignal(DIE_DEFAULTS.rollDurationMs);
    const [getTumbleCount, setTumbleCount] = createSignal(DIE_DEFAULTS.tumbleCount);

    const dieFaceSignal = createSignal(0);

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    const getShownRollDurationMs = () => (getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : getRollDurationMs());

    const getExamples = createMemo(() => [
        {
            key: "tabletop",
            name: "Tabletop die",
            readout: () =>
                `showing ${dieFaceSignal[0]() + FIRST_NUMBER} of ${DieShapes.SAMPLE_SHAPES[getShapeKey()].faces.length} — the page picks the number, and the die tumbles and lands on it`,
            component: () => (
                <TabletopExample
                    shape={() => DieShapes.SAMPLE_SHAPES[getShapeKey()]}
                    size={() => DIE_SIZE}
                    rollDurationMs={getShownRollDurationMs}
                    tumbleCount={getTumbleCount}
                    faceSignal={dieFaceSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Tabletop.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"shape"} label={"Die"} hint={"Which die to roll, from four faces to a hundred."}>
                    <PageSelectField
                        value={getShapeKey}
                        values={() => DieShapes.SAMPLE_KEYS}
                        ariaLabel={"Die"}
                        onChange={(key) => setShapeKey(() => key)}
                    />
                </PageProp>

                <PageProp
                    key={"rollDurationMs"}
                    label={"Roll duration (ms)"}
                    hint={"How long a roll takes to land. It is off while the visitor has asked for reduced motion."}
                >
                    <PageNumberField
                        value={getRollDurationMs}
                        min={() => DieKnobs.MIN_ROLL_DURATION_MS}
                        max={() => DieKnobs.MAX_ROLL_DURATION_MS}
                        step={() => DieKnobs.ROLL_DURATION_STEP_MS}
                        isDisabled={getPrefersReducedMotion}
                        ariaLabel={"Roll duration in milliseconds"}
                        onInput={setRollDurationMs}
                    />
                </PageProp>

                <PageProp key={"tumbleCount"} label={"Tumbles"} hint={"How many whole turns a roll makes on its way."}>
                    <PageNumberField
                        value={getTumbleCount}
                        min={() => DieKnobs.MIN_TUMBLE_COUNT}
                        max={() => DieKnobs.MAX_TUMBLE_COUNT}
                        step={() => DieKnobs.TUMBLE_COUNT_STEP}
                        ariaLabel={"Tumbles"}
                        onInput={setTumbleCount}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
