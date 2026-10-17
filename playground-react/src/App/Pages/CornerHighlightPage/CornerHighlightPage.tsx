import { useMemo, useState } from "react";

import type { CornerKey } from "@thewaver/ss-components-react";
import { CORNER_HIGHLIGHT_DEFAULTS, CORNER_HIGHLIGHT_KEYS } from "@thewaver/ss-components-react";
import { CornerHighlightKnobs } from "@thewaver/ss-playground/App/Knobs/CornerHighlights.const";
import {
    CORNER_LABELS,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/CornerHighlightPage/CornerHighlightPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageColorField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import type { CornerHighlightExampleProps } from "./CornerHighlightPageReact.types";
import { ControlExample } from "./Examples/Control";
import { DefaultExample } from "./Examples/Default";
import { DrawOnExample } from "./Examples/DrawOn";
import { FocusFollowExample } from "./Examples/FocusFollow";
import { OverlayExample } from "./Examples/Overlay";

export const CornerHighlightPage = () => {
    const [color, setColor] = useState(CornerHighlightKnobs.STARTING_COLOR);
    const [lengthAcross, setLengthAcross] = useState(CornerHighlightKnobs.STARTING_LENGTH);
    const [lengthDown, setLengthDown] = useState(CornerHighlightKnobs.STARTING_LENGTH);
    const [strokeThickness, setStrokeThickness] = useState(CORNER_HIGHLIGHT_DEFAULTS.strokeThickness);
    const [transitionDurationMs, setTransitionDurationMs] = useState(CORNER_HIGHLIGHT_DEFAULTS.transitionDurationMs);
    const [hiddenCorners, setHiddenCorners] = useState<CornerKey[]>(() =>
        CORNER_HIGHLIGHT_KEYS.filter((key) => !CORNER_HIGHLIGHT_DEFAULTS.visibleCorners.has(key)),
    );

    const cornerLength = useMemo(() => ({ width: lengthAcross, height: lengthDown }), [lengthAcross, lengthDown]);

    const visibleCorners = useMemo(
        () => new Set(CORNER_HIGHLIGHT_KEYS.filter((key) => !hiddenCorners.includes(key))),
        [hiddenCorners],
    );

    const toggleCorner = (key: CornerKey, isVisible: boolean) =>
        setHiddenCorners((previous) => (isVisible ? previous.filter((entry) => entry !== key) : [...previous, key]));

    const commonProps: CornerHighlightExampleProps = {
        color,
        cornerLength,
        strokeThickness,
        transitionDurationMs,
        visibleCorners,
    };

    const examples = [
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

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"color"} label={"Color"} hint={"The color the corner marks are drawn in."}>
                    <PageColorField value={color} ariaLabel={"Color"} onInput={setColor} />
                </PageProp>

                <PageProp
                    itemKey={"cornerLengthWidth"}
                    label={"Arm across (px)"}
                    hint={"How long each corner's horizontal arm is."}
                >
                    <PageNumberField
                        value={lengthAcross}
                        min={CornerHighlightKnobs.MIN_LENGTH}
                        max={CornerHighlightKnobs.MAX_LENGTH}
                        step={CornerHighlightKnobs.LENGTH_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Arm across"}
                        onInput={setLengthAcross}
                    />
                </PageProp>

                <PageProp
                    itemKey={"cornerLengthHeight"}
                    label={"Arm down (px)"}
                    hint={"How long each corner's vertical arm is."}
                >
                    <PageNumberField
                        value={lengthDown}
                        min={CornerHighlightKnobs.MIN_LENGTH}
                        max={CornerHighlightKnobs.MAX_LENGTH}
                        step={CornerHighlightKnobs.LENGTH_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Arm down"}
                        onInput={setLengthDown}
                    />
                </PageProp>

                <PageProp
                    itemKey={"strokeThickness"}
                    label={"Thickness (px)"}
                    hint={"How thick the corner arms are drawn."}
                >
                    <PageNumberField
                        value={strokeThickness}
                        min={CornerHighlightKnobs.MIN_THICKNESS}
                        max={CornerHighlightKnobs.MAX_THICKNESS}
                        step={CornerHighlightKnobs.THICKNESS_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Thickness"}
                        onInput={setStrokeThickness}
                    />
                </PageProp>

                <PageProp
                    itemKey={"transitionDurationMs"}
                    label={"Fade (ms)"}
                    hint={
                        "How long the corners take to follow a change of color, which is how the set as a whole fades. The following and drawn-on examples also glide and grow over this time."
                    }
                >
                    <PageNumberField
                        value={transitionDurationMs}
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
                        itemKey={key}
                        label={CORNER_LABELS[key]}
                        hint={`Whether the ${CORNER_LABELS[key].toLowerCase()} mark is drawn at all.`}
                    >
                        <PageCheckField
                            value={visibleCorners.has(key)}
                            ariaLabel={CORNER_LABELS[key]}
                            onChange={(isVisible) => toggleCorner(key, isVisible)}
                        />
                    </PageProp>
                ))}
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
