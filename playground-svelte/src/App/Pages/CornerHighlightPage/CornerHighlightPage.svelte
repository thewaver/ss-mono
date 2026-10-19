<script lang="ts">
    import type { CornerKey } from "@thewaver/ss-components-svelte";
    import { CORNER_HIGHLIGHT_DEFAULTS, CORNER_HIGHLIGHT_KEYS } from "@thewaver/ss-components-svelte";
    import { CornerHighlightKnobs } from "@thewaver/ss-playground/App/Knobs/CornerHighlights.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageColorField from "../../PageComponents/Field/PageColorField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import type { CornerHighlightExampleProps } from "./CornerHighlightPageSvelte.types";
    import ControlExample from "./Examples/Control.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DrawOnExample from "./Examples/DrawOn.svelte";
    import FocusFollowExample from "./Examples/FocusFollow.svelte";
    import OverlayExample from "./Examples/Overlay.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/CornerHighlightPage/CornerHighlightPage.const";

    const CORNER_LABELS: Record<CornerKey, string> = {
        top_left: "Top left",
        top_right: "Top right",
        bottom_left: "Bottom left",
        bottom_right: "Bottom right",
    };

    let color = $state(CornerHighlightKnobs.STARTING_COLOR);
    let lengthAcross = $state(CornerHighlightKnobs.STARTING_LENGTH);
    let lengthDown = $state(CornerHighlightKnobs.STARTING_LENGTH);
    let strokeThickness = $state(CORNER_HIGHLIGHT_DEFAULTS.strokeThickness);
    let transitionDurationMs = $state(CORNER_HIGHLIGHT_DEFAULTS.transitionDurationMs);
    let hiddenCorners = $state.raw<CornerKey[]>(
        CORNER_HIGHLIGHT_KEYS.filter((key) => !CORNER_HIGHLIGHT_DEFAULTS.visibleCorners.has(key)),
    );

    const cornerLength = $derived({ width: lengthAcross, height: lengthDown });

    const visibleCorners = $derived(new Set(CORNER_HIGHLIGHT_KEYS.filter((key) => !hiddenCorners.includes(key))));

    const toggleCorner = (key: CornerKey, isVisible: boolean) => {
        hiddenCorners = isVisible ? hiddenCorners.filter((entry) => entry !== key) : [...hiddenCorners, key];
    };

    const commonProps: CornerHighlightExampleProps = $derived({
        color,
        cornerLength,
        strokeThickness,
        transitionDurationMs,
        visibleCorners,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                "each bracket is a single polygon rather than two rules, so the arm lengths and the thickness are numbers rather than a border pretending to be one",
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "control",
            name: EXAMPLE_NAMES.control,
            readout: () =>
                "press it — the color transitions rather than switching, which is the whole reason the component owns a duration",
            component: controlExample,
            path: `${EXAMPLES_ROOT}/Control.svelte`,
        },
        {
            key: "overlay",
            name: EXAMPLE_NAMES.overlay,
            readout: () =>
                "the button underneath still takes a press, because the layer carrying the brackets refuses the pointer and says nothing to a screen reader",
            component: overlayExample,
            path: `${EXAMPLES_ROOT}/Overlay.svelte`,
        },
        {
            key: "focusFollow",
            name: EXAMPLE_NAMES.focusFollow,
            readout: () =>
                "one set of marks glides to whichever control is hovered or reached by the keyboard, around the control's own focus ring rather than instead of it — and jumps rather than glides under reduced motion",
            component: focusFollowExample,
            path: `${EXAMPLES_ROOT}/FocusFollow.svelte`,
        },
        {
            key: "drawOn",
            name: EXAMPLE_NAMES.drawOn,
            readout: () =>
                "the arm length grows from nothing as the marks appear, so they draw out of each corner — at full length at once under reduced motion",
            component: drawOnExample,
            path: `${EXAMPLES_ROOT}/DrawOn.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample {...commonProps} />
{/snippet}

{#snippet controlExample()}
    <ControlExample {...commonProps} />
{/snippet}

{#snippet overlayExample()}
    <OverlayExample {...commonProps} />
{/snippet}

{#snippet focusFollowExample()}
    <FocusFollowExample {...commonProps} />
{/snippet}

{#snippet drawOnExample()}
    <DrawOnExample {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"color"} controls={"Sets CornerHighlightProps.color"} label={"Color"} hint={"The color the corner marks are drawn in."}>
        <PageColorField
            value={color}
            ariaLabel={"Color"}
            onInput={(value) => {
                color = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"cornerLengthWidth"}
        controls={"Sets CornerHighlightProps.cornerLength.width"}
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
            onInput={(value) => {
                lengthAcross = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"cornerLengthHeight"} controls={"Sets CornerHighlightProps.cornerLength.height"} label={"Arm down (px)"} hint={"How long each corner's vertical arm is."}>
        <PageNumberField
            value={lengthDown}
            min={CornerHighlightKnobs.MIN_LENGTH}
            max={CornerHighlightKnobs.MAX_LENGTH}
            step={CornerHighlightKnobs.LENGTH_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Arm down"}
            onInput={(value) => {
                lengthDown = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"strokeThickness"} controls={"Sets CornerHighlightProps.strokeThickness"} label={"Thickness (px)"} hint={"How thick the corner arms are drawn."}>
        <PageNumberField
            value={strokeThickness}
            min={CornerHighlightKnobs.MIN_THICKNESS}
            max={CornerHighlightKnobs.MAX_THICKNESS}
            step={CornerHighlightKnobs.THICKNESS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Thickness"}
            onInput={(value) => {
                strokeThickness = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"transitionDurationMs"}
        controls={"Sets CornerHighlightProps.transitionDurationMs"}
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
            onInput={(value) => {
                transitionDurationMs = value;
            }}
        />
    </PageProp>

    {#each CORNER_HIGHLIGHT_KEYS as key (key)}
        <PageProp
            itemKey={key}
            controls={"Adds or removes this corner in CornerHighlightProps.visibleCorners"}
            label={CORNER_LABELS[key]}
            hint={`Whether the ${CORNER_LABELS[key].toLowerCase()} mark is drawn at all.`}
        >
            <PageCheckField
                value={visibleCorners.has(key)}
                ariaLabel={CORNER_LABELS[key]}
                onChange={(isVisible) => toggleCorner(key, isVisible)}
            />
        </PageProp>
    {/each}
</PagePropsPanel>

<PageExamples items={examples} />
