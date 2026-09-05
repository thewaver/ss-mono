import { createMemo, createSignal } from "solid-js";

import type { CornerKey } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageColorField, PageNumberField } from "../../StyledComponents/Field/Field";
import type { CornersExampleProps } from "./CornersPage.types";
import { ControlExample } from "./Examples/Control";
import { DefaultExample } from "./Examples/Default";
import { OverlayExample } from "./Examples/Overlay";

const EXAMPLES_ROOT = "/src/App/Pages/CornersPage/Examples";

const CORNER_KEYS: CornerKey[] = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
const CORNER_LABELS: Record<CornerKey, string> = {
    topLeft: "Top left",
    topRight: "Top right",
    bottomLeft: "Bottom left",
    bottomRight: "Bottom right",
};

const MIN_LENGTH = 4;
const MAX_LENGTH = 80;
const LENGTH_STEP = 4;
const MIN_THICKNESS = 1;
const MAX_THICKNESS = 16;
const THICKNESS_STEP = 1;
const MIN_DURATION = 0;
const MAX_DURATION = 1000;
const DURATION_STEP = 50;
const FIELD_WIDTH = 110;

const STARTING_COLOR = "#ffd400";
const STARTING_LENGTH = 24;
const STARTING_THICKNESS = 4;
const STARTING_TRANSITION_DURATION_MS = 200;

export const CornersPage = () => {
    const [getColor, setColor] = createSignal(STARTING_COLOR);
    const [getLengthAcross, setLengthAcross] = createSignal(STARTING_LENGTH);
    const [getLengthDown, setLengthDown] = createSignal(STARTING_LENGTH);
    const [getStrokeThickness, setStrokeThickness] = createSignal(STARTING_THICKNESS);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(STARTING_TRANSITION_DURATION_MS);
    const [getHiddenCorners, setHiddenCorners] = createSignal<CornerKey[]>([]);

    const getCornerLength = createMemo(() => ({ width: getLengthAcross(), height: getLengthDown() }));

    const getVisibleCorners = createMemo(() => new Set(CORNER_KEYS.filter((key) => !getHiddenCorners().includes(key))));

    const toggleCorner = (key: CornerKey, isVisible: boolean) =>
        setHiddenCorners((previous) => (isVisible ? previous.filter((entry) => entry !== key) : [...previous, key]));

    const getExamples = createMemo(() => {
        const commonProps: CornersExampleProps = {
            color: getColor,
            cornerLength: getCornerLength,
            strokeThickness: getStrokeThickness,
            transitionDurationMs: getTransitionDurationMs,
            visibleCorners: getVisibleCorners,
        };

        return [
            {
                key: "default",
                name: "Around a box",
                readout: () =>
                    "each bracket is a single polygon rather than two rules, so the arm lengths and the thickness are numbers rather than a border pretending to be one",
                component: () => <DefaultExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
            {
                key: "control",
                name: "As a control's decoration",
                readout: () =>
                    "press it — the colour transitions rather than switching, which is the whole reason the component owns a duration",
                component: () => <ControlExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Control.tsx`,
            },
            {
                key: "overlay",
                name: "Over content it does not own",
                readout: () =>
                    "the button underneath still takes a press, because the layer carrying the brackets refuses the pointer and says nothing to a screen reader",
                component: () => <OverlayExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Overlay.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"color"} label={"Colour"}>
                    <PageColorField value={getColor} ariaLabel={"Colour"} onInput={setColor} />
                </PageProp>

                <PageProp key={"cornerLengthWidth"} label={"Arm across (px)"}>
                    <PageNumberField
                        value={getLengthAcross}
                        min={() => MIN_LENGTH}
                        max={() => MAX_LENGTH}
                        step={() => LENGTH_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Arm across"}
                        onInput={setLengthAcross}
                    />
                </PageProp>

                <PageProp key={"cornerLengthHeight"} label={"Arm down (px)"}>
                    <PageNumberField
                        value={getLengthDown}
                        min={() => MIN_LENGTH}
                        max={() => MAX_LENGTH}
                        step={() => LENGTH_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Arm down"}
                        onInput={setLengthDown}
                    />
                </PageProp>

                <PageProp key={"strokeThickness"} label={"Thickness (px)"}>
                    <PageNumberField
                        value={getStrokeThickness}
                        min={() => MIN_THICKNESS}
                        max={() => MAX_THICKNESS}
                        step={() => THICKNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Thickness"}
                        onInput={setStrokeThickness}
                    />
                </PageProp>

                <PageProp key={"transitionDurationMs"} label={"Fade (ms)"}>
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={() => MIN_DURATION}
                        max={() => MAX_DURATION}
                        step={() => DURATION_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Fade in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>

                {CORNER_KEYS.map((key) => (
                    <PageProp key={key} label={CORNER_LABELS[key]}>
                        <PageCheckField
                            value={() => getVisibleCorners().has(key)}
                            ariaLabel={CORNER_LABELS[key]}
                            onChange={(isVisible) => toggleCorner(key, isVisible)}
                        />
                    </PageProp>
                ))}
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
