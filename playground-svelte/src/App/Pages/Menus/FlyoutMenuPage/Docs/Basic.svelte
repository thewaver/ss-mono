<script lang="ts">
    import { FlyoutMenu } from "@thewaver/ss-components-svelte";
    import type { FlyoutMenuEntryRecord } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        NOTHING_FOLLOWED,
        OVERFLOW_CAPTION,
        SHOP_ENTRIES,
    } from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

    import { route } from "../../../../App.router";
    import PageLayer from "../../../../PageComponents/Layer/Layer.svelte";
    import PageFlyoutMenuLink from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuLink.svelte";
    import PageFlyoutMenuOverflowToggle from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuOverflowToggle.svelte";
    import PageFlyoutMenuToggle from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuToggle.svelte";
    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PagePopoverSurface from "../../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import type { FlyoutMenuBasicDocsExampleProps } from "../FlyoutMenuPageSvelte.types";

    const OFFSET = { x: 0, y: 6 };

    type Props = FlyoutMenuBasicDocsExampleProps;

    let props: Props = $props();

    const hash = $derived(route.hash);

    const entries: FlyoutMenuEntryRecord<string>[] = $derived(
        SHOP_ENTRIES.map((entry) => ({
            ...entry,
            isCurrent: entry.href === hash,
            links: entry.links?.map((link) => ({ ...link, isCurrent: link.href === hash })),
        })),
    );
</script>

<FlyoutMenu
    {entries}
    ariaLabel={"Shop"}
    offset={OFFSET}
    hoverShowDelayMs={props.hoverShowDelayMs}
    transitionDurationMs={props.transitionDurationMs}
    computeToggleLabel={(value) => `${value} submenu`}
    renderHighlightFloater={renderPageHighlightFloater}
>
    {#snippet renderLink(link, flags)}
        <PageFlyoutMenuLink {flags}>{link.value}</PageFlyoutMenuLink>
    {/snippet}

    {#snippet renderToggle(_entry, flags)}
        <PageFlyoutMenuToggle {flags} />
    {/snippet}

    {#snippet renderOverflowToggle(flags)}
        <PageFlyoutMenuOverflowToggle {flags}>{OVERFLOW_CAPTION}</PageFlyoutMenuOverflowToggle>
    {/snippet}

    {#snippet renderPanel(renderLinks, visibilityTarget, transitionDurationMs, placement, size)}
        <PageLayer level={2}>
            <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
                <div
                    class={styles.flyoutMenuPanelBody}
                    style:width={size ? `${size.width}px` : undefined}
                    style:height={size ? `${size.height}px` : undefined}
                    style:transition={`width ${transitionDurationMs}ms ease, height ${transitionDurationMs}ms ease`}
                >
                    {@render renderLinks()}
                </div>
            </PagePopoverSurface>
        </PageLayer>
    {/snippet}
</FlyoutMenu>

<div class={exampleStyles.exampleReadout} data-readout>{`Followed: ${hash || NOTHING_FOLLOWED}`}</div>
