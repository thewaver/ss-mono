<script lang="ts">
    import { FLYOUT_MENU_DEFAULTS, type FlyoutMenuEntryRecord } from "@thewaver/ss-components-svelte";
    import { FlyoutMenuKnobs } from "@thewaver/ss-playground/App/Knobs/FlyoutMenus.const";
    import {
        EXAMPLES_ROOT,
        EXAMPLE_NAMES,
        FIELD_WIDTH,
        NOTHING_FOLLOWED,
        SHOP_ENTRIES,
    } from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";

    import { route } from "../../../App.router";
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import NarrowExample from "./Examples/Narrow.svelte";
    import ShopExample from "./Examples/Shop.svelte";

    let hoverShowDelayMs = $state(FLYOUT_MENU_DEFAULTS.hoverShowDelayMs);
    let transitionDurationMs = $state(FLYOUT_MENU_DEFAULTS.transitionDurationMs);

    const hash = $derived(route.hash);

    const followed = $derived(hash ? `followed ${hash}` : NOTHING_FOLLOWED);

    const entries: FlyoutMenuEntryRecord<string>[] = $derived(
        SHOP_ENTRIES.map((entry) => ({
            ...entry,
            isCurrent: entry.href === hash,
            links: entry.links?.map((link) => ({ ...link, isCurrent: link.href === hash })),
        })),
    );

    const examples: ExampleDefs[] = [
        {
            key: "shop",
            name: EXAMPLE_NAMES.shop,
            span: 2,
            readout: () =>
                `${followed} — every entry is a link to its own page; hovering one with a panel opens it, the arrow beside it opens and closes it from the keyboard or a touch, and tabbing along the bar opens nothing`,
            component: shopExample,
            path: `${EXAMPLES_ROOT}/Shop.svelte`,
        },
        {
            key: "narrow",
            name: EXAMPLE_NAMES.narrow,
            readout: () =>
                `${followed} — the entries that do not fit collapse into "More", where each keeps its link and its arrow, and the arrow opens its links in place`,
            component: narrowExample,
            path: `${EXAMPLES_ROOT}/Narrow.svelte`,
        },
    ];
</script>

{#snippet shopExample()}
    <ShopExample {entries} {hoverShowDelayMs} {transitionDurationMs} />
{/snippet}

{#snippet narrowExample()}
    <NarrowExample {entries} {hoverShowDelayMs} {transitionDurationMs} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"hoverShowDelayMs"}
        label={"Hover delay (ms)"}
        hint={"How long the pointer has to rest on an entry before its panel opens."}
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
</PagePropsPanel>

<PageExamples items={examples} />
