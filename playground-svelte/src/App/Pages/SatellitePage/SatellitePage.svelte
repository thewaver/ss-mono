<script lang="ts">
    import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, SATELLITE_DEFAULTS } from "@thewaver/ss-components-svelte";
    import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-svelte";

    import { SatelliteKnobs } from "../../Knobs/Satellites.const";
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import BadgeExample from "./Examples/Badge.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import SeveralExample from "./Examples/Several.svelte";
    import type { SatelliteBadgeCorner, SatelliteExampleProps } from "./SatellitePage.types";

    const FIELD_WIDTH = 110;
    const EXAMPLES_ROOT = "/src/App/Pages/SatellitePage/Examples";

    let hPlacement = $state<AnchorHPlacement>(SatelliteKnobs.STARTING_H_PLACEMENT);
    let vPlacement = $state<AnchorVPlacement>(SatelliteKnobs.STARTING_V_PLACEMENT);
    let offsetX = $state(SATELLITE_DEFAULTS.offset.x);
    let offsetY = $state(SATELLITE_DEFAULTS.offset.y);
    let subjectWidth = $state(SatelliteKnobs.STARTING_SUBJECT_WIDTH);
    let subjectHeight = $state(SatelliteKnobs.STARTING_SUBJECT_HEIGHT);
    let badgeSize = $state(SatelliteKnobs.STARTING_BADGE_SIZE);
    let hasSatellite = $state(SatelliteKnobs.STARTING_HAS_SATELLITE);
    let isBehindSubject = $state(SATELLITE_DEFAULTS.isBehindSubject);
    let corner = $state<SatelliteBadgeCorner>(SatelliteKnobs.STARTING_CORNER);
    let count = $state(SatelliteKnobs.STARTING_COUNT);
    let overhang = $state(SatelliteKnobs.STARTING_OVERHANG);

    const placement = $derived({ x: hPlacement, y: vPlacement });

    const offset = $derived({ x: offsetX, y: offsetY });

    const commonProps: SatelliteExampleProps = $derived({
        subjectWidth,
        subjectHeight,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => "one satellite, moved through every placement; the dashed box is what the pair takes up",
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "several",
            name: "Several satellites",
            readout: () =>
                "a corner badge, one hanging off the left and one tucked behind the bottom edge — each side of the box grows by the furthest any of them reaches",
            component: severalExample,
            path: `${EXAMPLES_ROOT}/Several.svelte`,
        },
        {
            key: "badge",
            name: "Badge",
            readout: () =>
                "a count pinned inside a corner and pushed out past it by the same amount on both axes, so a longer number grows the badge inward and the overhang never changes",
            component: badgeExample,
            path: `${EXAMPLES_ROOT}/Badge.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <PageMeasureBox>
        <DefaultExample {...commonProps} {placement} {offset} {isBehindSubject} {badgeSize} {hasSatellite} />
    </PageMeasureBox>

    <PageExampleKnobs>
        <PageProp
            itemKey={"hPlacement"}
            label={"Placement across"}
            hint={"Where the satellite sits across its subject: inside an edge, centered, or outside it altogether."}
        >
            <PageSelectField
                value={hPlacement}
                values={ANCHOR_H_PLACEMENTS}
                width={FIELD_WIDTH}
                ariaLabel={"Placement across"}
                onChange={(placement) => (hPlacement = placement)}
            />
        </PageProp>

        <PageProp
            itemKey={"vPlacement"}
            label={"Placement down"}
            hint={"Where the satellite sits above or below its subject: inside an edge, centered, or outside it altogether."}
        >
            <PageSelectField
                value={vPlacement}
                values={ANCHOR_V_PLACEMENTS}
                width={FIELD_WIDTH}
                ariaLabel={"Placement down"}
                onChange={(placement) => (vPlacement = placement)}
            />
        </PageProp>

        <PageProp
            itemKey={"offsetX"}
            label={"Offset across (px)"}
            hint={"How far the satellite is nudged sideways from where the placement put it."}
        >
            <PageNumberField
                value={offsetX}
                min={SatelliteKnobs.MIN_OFFSET}
                max={SatelliteKnobs.MAX_OFFSET}
                step={SatelliteKnobs.OFFSET_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Offset across"}
                onInput={(value) => (offsetX = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"offsetY"}
            label={"Offset down (px)"}
            hint={"How far the satellite is nudged up or down from where the placement put it."}
        >
            <PageNumberField
                value={offsetY}
                min={SatelliteKnobs.MIN_OFFSET}
                max={SatelliteKnobs.MAX_OFFSET}
                step={SatelliteKnobs.OFFSET_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Offset down"}
                onInput={(value) => (offsetY = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"hasSatellite"}
            label={"Render a satellite"}
            hint={"Whether a satellite is rendered at all, so the subject can be seen with and without one."}
        >
            <PageCheckField
                value={hasSatellite}
                ariaLabel={"Render a satellite"}
                onChange={(value) => (hasSatellite = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"badgeSize"}
            label={"Satellite size (px)"}
            hint={"How large the satellite itself is."}
        >
            <PageNumberField
                value={badgeSize}
                min={SatelliteKnobs.MIN_BADGE_SIZE}
                max={SatelliteKnobs.MAX_BADGE_SIZE}
                step={SatelliteKnobs.BADGE_SIZE_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Satellite size"}
                onInput={(value) => (badgeSize = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"isBehindSubject"}
            label={"Behind the subject"}
            hint={"Puts the satellite under the subject rather than over it, so the subject hides whatever overlaps."}
        >
            <PageCheckField
                value={isBehindSubject}
                ariaLabel={"Behind the subject"}
                onChange={(value) => (isBehindSubject = value)}
            />
        </PageProp>
    </PageExampleKnobs>
{/snippet}

{#snippet severalExample()}
    <PageMeasureBox>
        <SeveralExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

{#snippet badgeExample()}
    <PageMeasureBox>
        <BadgeExample {...commonProps} {corner} {count} {overhang} />
    </PageMeasureBox>

    <PageExampleKnobs>
        <PageProp
            itemKey={"badgeCorner"}
            label={"Corner"}
            hint={"Which corner the badge is pinned to; the overhang turns outward with it."}
        >
            <PageSelectField
                value={corner}
                values={SatelliteKnobs.BADGE_CORNERS}
                width={FIELD_WIDTH}
                ariaLabel={"Corner"}
                onChange={(next) => (corner = next)}
            />
        </PageProp>

        <PageProp
            itemKey={"badgeCount"}
            label={"Count"}
            hint={"The number on the badge. More digits make it wider, and it grows toward the middle."}
        >
            <PageNumberField
                value={count}
                min={SatelliteKnobs.MIN_COUNT}
                max={SatelliteKnobs.MAX_COUNT}
                step={SatelliteKnobs.COUNT_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Count"}
                onInput={(value) => (count = value)}
            />
        </PageProp>

        <PageProp
            itemKey={"badgeOverhang"}
            label={"Overhang (px)"}
            hint={"How far the badge pokes out past each of the two edges it is pinned to."}
        >
            <PageNumberField
                value={overhang}
                min={SatelliteKnobs.MIN_OVERHANG}
                max={SatelliteKnobs.MAX_OVERHANG}
                step={SatelliteKnobs.OVERHANG_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Overhang"}
                onInput={(value) => (overhang = value)}
            />
        </PageProp>
    </PageExampleKnobs>
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"subjectWidth"}
        label={"Subject width (px)"}
        hint={"How wide the thing the satellite is pinned to is."}
    >
        <PageNumberField
            value={subjectWidth}
            min={SatelliteKnobs.MIN_SUBJECT_SIZE}
            max={SatelliteKnobs.MAX_SUBJECT_SIZE}
            step={SatelliteKnobs.SUBJECT_SIZE_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Subject width"}
            onInput={(value) => (subjectWidth = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"subjectHeight"}
        label={"Subject height (px)"}
        hint={"How tall the thing the satellite is pinned to is."}
    >
        <PageNumberField
            value={subjectHeight}
            min={SatelliteKnobs.MIN_SUBJECT_SIZE}
            max={SatelliteKnobs.MAX_SUBJECT_SIZE}
            step={SatelliteKnobs.SUBJECT_SIZE_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Subject height"}
            onInput={(value) => (subjectHeight = value)}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
