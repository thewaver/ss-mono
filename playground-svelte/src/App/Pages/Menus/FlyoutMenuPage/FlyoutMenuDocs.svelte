<script lang="ts">
    import { FLYOUT_MENU_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { FlyoutMenuKnobs } from "@thewaver/ss-playground/App/Knobs/FlyoutMenus.const";
    import {
        DOCS_ROOT,
        FIELD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";

    import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import NarrowDocsExample from "./Docs/Narrow.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";

    let hoverShowDelayMs = $state(FLYOUT_MENU_DEFAULTS.hoverShowDelayMs);
    let transitionDurationMs = $state(FLYOUT_MENU_DEFAULTS.transitionDurationMs);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {hoverShowDelayMs} {transitionDurationMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hoverShowDelayMs"}
            label={"Hover delay (ms)"}
            hint={"How long the pointer has to rest on an entry before its panel opens."}
            controls={"Sets FlyoutMenuProps.hoverShowDelayMs"}
        >
            <PageNumberField
                value={hoverShowDelayMs}
                min={FlyoutMenuKnobs.MIN_DELAY_MS}
                max={FlyoutMenuKnobs.MAX_DELAY_MS}
                step={FlyoutMenuKnobs.DELAY_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Hover delay in milliseconds"}
                onInput={(value) => {
                    hoverShowDelayMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            label={"Transition duration (ms)"}
            hint={"How long the panel takes to fade, and to glide from one entry to the next."}
            controls={"Sets FlyoutMenuProps.transitionDurationMs"}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={FlyoutMenuKnobs.MIN_TRANSITION_MS}
                max={FlyoutMenuKnobs.MAX_TRANSITION_MS}
                step={FlyoutMenuKnobs.TRANSITION_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"Transition duration in milliseconds"}
                onInput={(value) => {
                    transitionDurationMs = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"Too narrow for every entry"}
    content={"The bar measures itself, and the entries that do not fit collapse into a last one. Inside its panel each collapsed entry keeps its link and its toggle, and the toggle opens that entry's links in place. Give an entry a [prop]collapse[/prop] of never to keep it on the bar, or always to send it to the end whatever the room."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Narrow.svelte`}>
    <NarrowDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the entries run from the right, each toggle sits to the left of its link, and Tab walks them in that order. The panel takes the box's direction although it is drawn outside it: it hangs from the right edge of its entry and its links read from the right. A [prop]placement[/prop] you give is used as it stands."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>
