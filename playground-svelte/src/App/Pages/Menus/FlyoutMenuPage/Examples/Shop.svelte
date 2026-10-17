<script lang="ts">
    import { FlyoutMenu } from "@thewaver/ss-components-svelte";
    import { OVERFLOW_CAPTION } from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlyoutMenuContent/FlyoutMenuContent.css";

    import PageLayer from "../../../../PageComponents/Layer/Layer.svelte";
    import PageFlyoutMenuLink from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuLink.svelte";
    import PageFlyoutMenuOverflowToggle from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuOverflowToggle.svelte";
    import PageFlyoutMenuToggle from "../../../../StyledComponents/FlyoutMenuContent/PageFlyoutMenuToggle.svelte";
    import PagePopoverSurface from "../../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import type { FlyoutMenuExampleProps } from "../FlyoutMenuPageSvelte.types";

    const OFFSET = { x: 0, y: 6 };

    let props: FlyoutMenuExampleProps = $props();
</script>

<FlyoutMenu
    entries={props.entries}
    ariaLabel={"Shop"}
    offset={OFFSET}
    hoverShowDelayMs={props.hoverShowDelayMs}
    transitionDurationMs={props.transitionDurationMs}
    computeToggleLabel={(value) => `${value} submenu`}
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
