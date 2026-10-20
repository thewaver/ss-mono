import { createMemo, createSignal } from "solid-js";

import { CORNER_HIGHLIGHT_DEFAULTS, CORNER_HIGHLIGHT_KEYS } from "@thewaver/ss-components-solid";
import { CornerHighlightKnobs } from "@thewaver/ss-playground/App/Knobs/CornerHighlights.const";
import {
    CORNER_LABELS,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/CornerHighlightPage/CornerHighlightPage.const";
import type { QuadCorner } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageColorField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import type { CornerHighlightExampleProps } from "./CornerHighlightPageSolid.types";
import { ControlExample } from "./Examples/Control";
import { DefaultExample } from "./Examples/Default";
import { DrawOnExample } from "./Examples/DrawOn";
import { FocusFollowExample } from "./Examples/FocusFollow";
import { OverlayExample } from "./Examples/Overlay";

export const CornerHighlightPage = () => {
    const [getColor, setColor] = createSignal(CornerHighlightKnobs.STARTING_COLOR);
    const [getLengthAcross, setLengthAcross] = createSignal(CornerHighlightKnobs.STARTING_LENGTH);
    const [getLengthDown, setLengthDown] = createSignal(CornerHighlightKnobs.STARTING_LENGTH);
    const [getStrokeThickness, setStrokeThickness] = createSignal(CORNER_HIGHLIGHT_DEFAULTS.strokeThickness);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(
        CORNER_HIGHLIGHT_DEFAULTS.transitionDurationMs,
    );
    const [getHiddenCorners, setHiddenCorners] = createSignal<QuadCorner[]>(
        CORNER_HIGHLIGHT_KEYS.filter((key) => !CORNER_HIGHLIGHT_DEFAULTS.visibleCorners.has(key)),
    );

    const getCornerLength = createMemo(() => ({ width: getLengthAcross(), height: getLengthDown() }));

    const getVisibleCorners = createMemo(
        () => new Set(CORNER_HIGHLIGHT_KEYS.filter((key) => !getHiddenCorners().includes(key))),
    );

    const toggleCorner = (key: QuadCorner, isVisible: boolean) =>
        setHiddenCorners((previous) => (isVisible ? previous.filter((entry) => entry !== key) : [...previous, key]));

    const getExamples = createMemo(() => {
        const commonProps: CornerHighlightExampleProps = {
            color: getColor,
            cornerLength: getCornerLength,
            strokeThickness: getStrokeThickness,
            transitionDurationMs: getTransitionDurationMs,
            visibleCorners: getVisibleCorners,
        };

        return [
            {
                key: "default",
                name: EXAMPLE_NAMES.default,
                readout: () =>
                    "each bracket is a single polygon rather than two rules, so the arm lengths and the thickness are numbers rather than a border pretending to be one",
                component: () => <DefaultExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
            {
                key: "control",
                name: EXAMPLE_NAMES.control,
                readout: () =>
                    "press it — the color transitions rather than switching, which is the whole reason the component owns a duration",
                component: () => <ControlExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Control.tsx`,
            },
            {
                key: "overlay",
                name: EXAMPLE_NAMES.overlay,
                readout: () =>
                    "the button underneath still takes a press, because the layer carrying the brackets refuses the pointer and says nothing to a screen reader",
                component: () => <OverlayExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Overlay.tsx`,
            },
            {
                key: "focusFollow",
                name: EXAMPLE_NAMES.focusFollow,
                readout: () =>
                    "one set of marks glides to whichever control is hovered or reached by the keyboard, around the control's own focus ring rather than instead of it — and jumps rather than glides under reduced motion",
                component: () => <FocusFollowExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/FocusFollow.tsx`,
            },
            {
                key: "drawOn",
                name: EXAMPLE_NAMES.drawOn,
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
                <PageProp
                    key={"color"}
                    label={"Color"}
                    hint={"The color the corner marks are drawn in."}
                    controls={"Sets CornerHighlightProps.color"}
                >
                    <PageColorField value={getColor} ariaLabel={"Color"} onInput={setColor} />
                </PageProp>

                <PageProp
                    key={"cornerLengthWidth"}
                    label={"Arm across (px)"}
                    hint={"How long each corner's horizontal arm is."}
                    controls={"Sets CornerHighlightProps.cornerLength.width"}
                >
                    <PageNumberField
                        value={getLengthAcross}
                        min={CornerHighlightKnobs.MIN_LENGTH}
                        max={CornerHighlightKnobs.MAX_LENGTH}
                        step={CornerHighlightKnobs.LENGTH_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Arm across"}
                        onInput={setLengthAcross}
                    />
                </PageProp>

                <PageProp
                    key={"cornerLengthHeight"}
                    label={"Arm down (px)"}
                    hint={"How long each corner's vertical arm is."}
                    controls={"Sets CornerHighlightProps.cornerLength.height"}
                >
                    <PageNumberField
                        value={getLengthDown}
                        min={CornerHighlightKnobs.MIN_LENGTH}
                        max={CornerHighlightKnobs.MAX_LENGTH}
                        step={CornerHighlightKnobs.LENGTH_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Arm down"}
                        onInput={setLengthDown}
                    />
                </PageProp>

                <PageProp
                    key={"strokeThickness"}
                    label={"Thickness (px)"}
                    hint={"How thick the corner arms are drawn."}
                    controls={"Sets CornerHighlightProps.strokeThickness"}
                >
                    <PageNumberField
                        value={getStrokeThickness}
                        min={CornerHighlightKnobs.MIN_THICKNESS}
                        max={CornerHighlightKnobs.MAX_THICKNESS}
                        step={CornerHighlightKnobs.THICKNESS_STEP}
                        width={FIELD_WIDTH}
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
                    controls={"Sets CornerHighlightProps.transitionDurationMs"}
                >
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={CornerHighlightKnobs.MIN_DURATION}
                        max={CornerHighlightKnobs.MAX_DURATION}
                        step={CornerHighlightKnobs.DURATION_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Fade in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>

                {CORNER_HIGHLIGHT_KEYS.map((key) => (
                    <PageProp
                        key={key}
                        label={CORNER_LABELS[key]}
                        hint={`Whether the ${CORNER_LABELS[key].toLowerCase()} mark is drawn at all.`}
                        controls={"Adds or removes this corner in CornerHighlightProps.visibleCorners"}
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
