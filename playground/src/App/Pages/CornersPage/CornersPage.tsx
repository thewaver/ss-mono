import { createMemo, createSignal } from "solid-js";

import type { CornerKey } from "@thewaver/ss-components";
import { CORNERS_DEFAULTS, CORNERS_KEYS } from "@thewaver/ss-components";

import { CornerKnobs } from "../../Knobs/Corners.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageColorField, PageNumberField } from "../../StyledComponents/Field/Field";
import type { CornersExampleProps } from "./CornersPage.types";
import { ControlExample } from "./Examples/Control";
import { DefaultExample } from "./Examples/Default";
import { DrawOnExample } from "./Examples/DrawOn";
import { FocusFollowExample } from "./Examples/FocusFollow";
import { OverlayExample } from "./Examples/Overlay";

const EXAMPLES_ROOT = "/src/App/Pages/CornersPage/Examples";

const CORNER_LABELS: Record<CornerKey, string> = {
    topLeft: "Top left",
    topRight: "Top right",
    bottomLeft: "Bottom left",
    bottomRight: "Bottom right",
};

const FIELD_WIDTH = 110;

export const CornersPage = () => {
    const [getColor, setColor] = createSignal(CornerKnobs.STARTING_COLOR);
    const [getLengthAcross, setLengthAcross] = createSignal(CornerKnobs.STARTING_LENGTH);
    const [getLengthDown, setLengthDown] = createSignal(CornerKnobs.STARTING_LENGTH);
    const [getStrokeThickness, setStrokeThickness] = createSignal(CORNERS_DEFAULTS.strokeThickness);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(CORNERS_DEFAULTS.transitionDurationMs);
    const [getHiddenCorners, setHiddenCorners] = createSignal<CornerKey[]>(
        CORNERS_KEYS.filter((key) => !CORNERS_DEFAULTS.visibleCorners.has(key)),
    );

    const getCornerLength = createMemo(() => ({ width: getLengthAcross(), height: getLengthDown() }));

    const getVisibleCorners = createMemo(
        () => new Set(CORNERS_KEYS.filter((key) => !getHiddenCorners().includes(key))),
    );

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
                    "press it — the color transitions rather than switching, which is the whole reason the component owns a duration",
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
            {
                key: "focusFollow",
                name: "Following focus and hover",
                readout: () =>
                    "one set of marks glides to whichever control is hovered or reached by the keyboard, around the control's own focus ring rather than instead of it — and jumps rather than glides under reduced motion",
                component: () => <FocusFollowExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/FocusFollow.tsx`,
            },
            {
                key: "drawOn",
                name: "Drawn on",
                readout: () =>
                    "the arm length grows from nothing as the marks appear, so they draw out of each corner — at full length at once under reduced motion",
                component: () => <DrawOnExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/DrawOn.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"color"} label={"Color"} hint={"The color the corner marks are drawn in."}>
                    <PageColorField value={getColor} ariaLabel={"Color"} onInput={setColor} />
                </PageProp>

                <PageProp
                    key={"cornerLengthWidth"}
                    label={"Arm across (px)"}
                    hint={"How long each corner's horizontal arm is."}
                >
                    <PageNumberField
                        value={getLengthAcross}
                        min={() => CornerKnobs.MIN_LENGTH}
                        max={() => CornerKnobs.MAX_LENGTH}
                        step={() => CornerKnobs.LENGTH_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Arm across"}
                        onInput={setLengthAcross}
                    />
                </PageProp>

                <PageProp
                    key={"cornerLengthHeight"}
                    label={"Arm down (px)"}
                    hint={"How long each corner's vertical arm is."}
                >
                    <PageNumberField
                        value={getLengthDown}
                        min={() => CornerKnobs.MIN_LENGTH}
                        max={() => CornerKnobs.MAX_LENGTH}
                        step={() => CornerKnobs.LENGTH_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Arm down"}
                        onInput={setLengthDown}
                    />
                </PageProp>

                <PageProp
                    key={"strokeThickness"}
                    label={"Thickness (px)"}
                    hint={"How thick the corner arms are drawn."}
                >
                    <PageNumberField
                        value={getStrokeThickness}
                        min={() => CornerKnobs.MIN_THICKNESS}
                        max={() => CornerKnobs.MAX_THICKNESS}
                        step={() => CornerKnobs.THICKNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Thickness"}
                        onInput={setStrokeThickness}
                    />
                </PageProp>

                <PageProp
                    key={"transitionDurationMs"}
                    label={"Fade (ms)"}
                    hint={
                        "How long the corners take to follow a change of color, which is how the set as a whole fades. The following and drawn-on examples also glide and grow over this time."
                    }
                >
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={() => CornerKnobs.MIN_DURATION}
                        max={() => CornerKnobs.MAX_DURATION}
                        step={() => CornerKnobs.DURATION_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Fade in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>

                {CORNERS_KEYS.map((key) => (
                    <PageProp
                        key={key}
                        label={CORNER_LABELS[key]}
                        hint={`Whether the ${CORNER_LABELS[key].toLowerCase()} mark is drawn at all.`}
                    >
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
