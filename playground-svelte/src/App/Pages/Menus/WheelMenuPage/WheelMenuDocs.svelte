<script lang="ts">
    import { PlacementLayoutDefaults } from "@thewaver/ss-components-svelte";
    import { WheelMenuKnobs } from "@thewaver/ss-playground/App/Knobs/WheelMenus.const";
    import {
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
            label={"Spread (°)"}
            hint={"How much of the circle the wedges are spread over: 360 for a whole wheel, 180 for half of one."}
            controls={"Sets WheelMenuProps.spreadDegrees"}
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
            label={"Hole radius (px)"}
            hint={"How much of the middle is left empty, which is where the close control sits."}
            controls={"Sets WheelMenuProps.holeRadius"}
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
            label={"Band width (px)"}
            hint={"How thick the band of wedges is."}
            controls={"Sets WheelMenuProps.bandWidth"}
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
            label={"Wedge gap (°)"}
            hint={"The space left between one wedge and the next."}
            controls={"Sets WheelMenuProps.layoutDefs.wedgeGapDegrees"}
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
    title={"Submenus as bands"}
    content={"Give an item [prop]items[/prop] of its own and its submenu opens as a band round the same center, outside the one that opened it and [prop]levelGap[/prop] away from it. The band is aimed at the wedge that opened it and is only as wide as its own items need, so a short submenu stays short however far out it sits. Over less than a whole turn, a band is shifted to stay inside the spread."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bands.svelte`}>
    <BandsDocsExample spreadDegrees={bandsSpreadDegrees} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"bandsSpreadDegrees"}
            label={"Spread (°)"}
            hint={"How much of the circle the wedges are spread over. Every band stays inside it."}
            controls={"Sets WheelMenuProps.spreadDegrees"}
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
    title={"A wedge that asks for room"}
    content={"An item may ask for its own share of the turn with [prop]arcDegrees[/prop], and the items that do not ask share what is left. The wedges follow one another from the same start, so two can never overlap. Here Confirm asks for half the turn."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Weighted.svelte`}>
    <WeightedDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Hold and flick"}
    content={"With [prop]opensOnHold[/prop] on, pressing the button and holding it down opens the wheel. Move a short way toward a wedge and let go to pick it; come back to the middle before letting go to pick nothing. A plain click still opens the wheel and leaves it open, to be picked from by clicking or with the keyboard."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Flick.svelte`}>
    <FlickDocsExample {opensOnHold} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"opensOnHold"}
            label={"Opens on hold"}
            hint={"Whether holding the button down opens the wheel, so a flick toward a wedge picks it on release."}
            controls={"Sets WheelMenuProps.opensOnHold"}
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
