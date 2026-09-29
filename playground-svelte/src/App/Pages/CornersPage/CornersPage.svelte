<script lang="ts">
    import type { CornerKey } from "@thewaver/ss-components-svelte";
    import { CORNERS_DEFAULTS, CORNERS_KEYS } from "@thewaver/ss-components-svelte";
    import { CornerKnobs } from "@thewaver/ss-playground/App/Knobs/Corners.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageColorField from "../../PageComponents/Field/PageColorField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import type { CornersExampleProps } from "./CornersPage.types";
    import ControlExample from "./Examples/Control.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DrawOnExample from "./Examples/DrawOn.svelte";
    import FocusFollowExample from "./Examples/FocusFollow.svelte";
    import OverlayExample from "./Examples/Overlay.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/CornersPage/Examples";

    const CORNER_LABELS: Record<CornerKey, string> = {
        topLeft: "Top left",
        topRight: "Top right",
        bottomLeft: "Bottom left",
        bottomRight: "Bottom right",
    };

    const FIELD_WIDTH = 110;

    let color = $state(CornerKnobs.STARTING_COLOR);
    let lengthAcross = $state(CornerKnobs.STARTING_LENGTH);
    let lengthDown = $state(CornerKnobs.STARTING_LENGTH);
    let strokeThickness = $state(CORNERS_DEFAULTS.strokeThickness);
    let transitionDurationMs = $state(CORNERS_DEFAULTS.transitionDurationMs);
    let hiddenCorners = $state.raw<CornerKey[]>(
        CORNERS_KEYS.filter((key) => !CORNERS_DEFAULTS.visibleCorners.has(key)),
    );

    const cornerLength = $derived({ width: lengthAcross, height: lengthDown });

    const visibleCorners = $derived(new Set(CORNERS_KEYS.filter((key) => !hiddenCorners.includes(key))));

    const toggleCorner = (key: CornerKey, isVisible: boolean) => {
        hiddenCorners = isVisible ? hiddenCorners.filter((entry) => entry !== key) : [...hiddenCorners, key];
    };

    const commonProps: CornersExampleProps = $derived({
        color,
        cornerLength,
        strokeThickness,
        transitionDurationMs,
        visibleCorners,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Around a box",
            readout: () =>
                "each bracket is a single polygon rather than two rules, so the arm lengths and the thickness are numbers rather than a border pretending to be one",
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "control",
            name: "As a control's decoration",
            readout: () =>
                "press it — the color transitions rather than switching, which is the whole reason the component owns a duration",
            component: controlExample,
            path: `${EXAMPLES_ROOT}/Control.svelte`,
        },
        {
            key: "overlay",
            name: "Over content it does not own",
            readout: () =>
                "the button underneath still takes a press, because the layer carrying the brackets refuses the pointer and says nothing to a screen reader",
            component: overlayExample,
            path: `${EXAMPLES_ROOT}/Overlay.svelte`,
        },
        {
            key: "focusFollow",
            name: "Following focus and hover",
            readout: () =>
                "one set of marks glides to whichever control is hovered or reached by the keyboard, around the control's own focus ring rather than instead of it — and jumps rather than glides under reduced motion",
            component: focusFollowExample,
            path: `${EXAMPLES_ROOT}/FocusFollow.svelte`,
        },
        {
            key: "drawOn",
            name: "Drawn on",
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
    <PageProp itemKey={"color"} label={"Color"} hint={"The color the corner marks are drawn in."}>
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
        label={"Arm across (px)"}
        hint={"How long each corner's horizontal arm is."}
    >
        <PageNumberField
            value={lengthAcross}
            min={CornerKnobs.MIN_LENGTH}
            max={CornerKnobs.MAX_LENGTH}
            step={CornerKnobs.LENGTH_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Arm across"}
            onInput={(value) => {
                lengthAcross = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"cornerLengthHeight"} label={"Arm down (px)"} hint={"How long each corner's vertical arm is."}>
        <PageNumberField
            value={lengthDown}
            min={CornerKnobs.MIN_LENGTH}
            max={CornerKnobs.MAX_LENGTH}
            step={CornerKnobs.LENGTH_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Arm down"}
            onInput={(value) => {
                lengthDown = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"strokeThickness"} label={"Thickness (px)"} hint={"How thick the corner arms are drawn."}>
        <PageNumberField
            value={strokeThickness}
            min={CornerKnobs.MIN_THICKNESS}
            max={CornerKnobs.MAX_THICKNESS}
            step={CornerKnobs.THICKNESS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Thickness"}
            onInput={(value) => {
                strokeThickness = value;
            }}
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
            min={CornerKnobs.MIN_DURATION}
            max={CornerKnobs.MAX_DURATION}
            step={CornerKnobs.DURATION_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Fade in milliseconds"}
            onInput={(value) => {
                transitionDurationMs = value;
            }}
        />
    </PageProp>

    {#each CORNERS_KEYS as key (key)}
        <PageProp
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
    {/each}
</PagePropsPanel>

<PageExamples items={examples} />
