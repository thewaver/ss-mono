<script lang="ts">
    import { PlacementLayoutDefaults } from "@thewaver/ss-components-svelte";
    import { WheelMenuKnobs } from "@thewaver/ss-playground/App/Knobs/WheelMenus.const";
    import { DOCS_SECTIONS,
        BAND_WIDTH,
        DOCS_ROOT,
        FIELD_WIDTH,
        HOLE_RADIUS,
    } from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.const";

    import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import BandsDocsExample from "./Docs/Bands.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import FlickDocsExample from "./Docs/Flick.svelte";
    import WeightedDocsExample from "./Docs/Weighted.svelte";

    let spreadDegrees = $state(PlacementLayoutDefaults.BAND_DEFAULTS.spreadDegrees);
    let holeRadius = $state(HOLE_RADIUS);
    let bandWidth = $state(BAND_WIDTH);
    let wedgeGapDegrees = $state(PlacementLayoutDefaults.BAND_DEFAULTS.wedgeGapDegrees);
    let bandsSpreadDegrees = $state(PlacementLayoutDefaults.BAND_DEFAULTS.spreadDegrees);
    let opensOnHold = $state(true);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {spreadDegrees} {holeRadius} {bandWidth} {wedgeGapDegrees} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"spreadDegrees"}
            {...WheelMenuKnobs.SPREAD_DEGREES_TEXT}
        >
            <PageNumberField
                value={spreadDegrees}
                min={WheelMenuKnobs.MIN_SPREAD_DEGREES}
                max={WheelMenuKnobs.MAX_SPREAD_DEGREES}
                step={WheelMenuKnobs.SPREAD_STEP_DEGREES}
                width={FIELD_WIDTH}
                ariaLabel={"Spread in degrees"}
                onInput={(value) => {
                    spreadDegrees = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"holeRadius"}
            {...WheelMenuKnobs.HOLE_RADIUS_TEXT}
        >
            <PageNumberField
                value={holeRadius}
                min={WheelMenuKnobs.MIN_HOLE_RADIUS}
                max={WheelMenuKnobs.MAX_HOLE_RADIUS}
                step={WheelMenuKnobs.HOLE_RADIUS_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Hole radius in pixels"}
                onInput={(value) => {
                    holeRadius = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"bandWidth"}
            {...WheelMenuKnobs.BAND_WIDTH_TEXT}
        >
            <PageNumberField
                value={bandWidth}
                min={WheelMenuKnobs.MIN_BAND_WIDTH}
                max={WheelMenuKnobs.MAX_BAND_WIDTH}
                step={WheelMenuKnobs.BAND_WIDTH_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Band width in pixels"}
                onInput={(value) => {
                    bandWidth = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"wedgeGapDegrees"}
            {...WheelMenuKnobs.WEDGE_GAP_DEGREES_TEXT}
        >
            <PageNumberField
                value={wedgeGapDegrees}
                min={WheelMenuKnobs.MIN_WEDGE_GAP_DEGREES}
                max={WheelMenuKnobs.MAX_WEDGE_GAP_DEGREES}
                step={WheelMenuKnobs.WEDGE_GAP_STEP_DEGREES}
                width={FIELD_WIDTH}
                ariaLabel={"Wedge gap in degrees"}
                onInput={(value) => {
                    wedgeGapDegrees = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.submenusBands}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bands.svelte`}>
    <BandsDocsExample spreadDegrees={bandsSpreadDegrees} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"bandsSpreadDegrees"}
            {...WheelMenuKnobs.BANDS_SPREAD_DEGREES_TEXT}
        >
            <PageNumberField
                value={bandsSpreadDegrees}
                min={WheelMenuKnobs.MIN_SPREAD_DEGREES}
                max={WheelMenuKnobs.MAX_SPREAD_DEGREES}
                step={WheelMenuKnobs.SPREAD_STEP_DEGREES}
                width={FIELD_WIDTH}
                ariaLabel={"Spread in degrees"}
                onInput={(value) => {
                    bandsSpreadDegrees = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.wedgeAskingForRoom}
/>

<PageDocsExample path={`${DOCS_ROOT}/Weighted.svelte`}>
    <WeightedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.holdFlick}
/>

<PageDocsExample path={`${DOCS_ROOT}/Flick.svelte`}>
    <FlickDocsExample {opensOnHold} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"opensOnHold"}
            {...WheelMenuKnobs.OPENS_ON_HOLD_TEXT}
        >
            <PageCheckField
                value={opensOnHold}
                ariaLabel={"Opens on hold"}
                onChange={(value) => {
                    opensOnHold = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
