<script lang="ts">
    import { Button, Sunburst, TreemapUtils } from "@thewaver/ss-components-svelte";
    import type { SunburstNode } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SunburstPage/SunburstPage.css";
    import { LIBRARY, formatLines } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";
    import { PAGE_SUNBURST_FAMILIES } from "@thewaver/ss-playground/App/StyledComponents/SunburstContent/SunburstContent.css";

    import PageSunburstArc from "../../../StyledComponents/SunburstContent/PageSunburstArc.svelte";
    import PageSunburstHub from "../../../StyledComponents/SunburstContent/PageSunburstHub.svelte";
    import type { SunburstExampleProps } from "../SunburstPage.types";

    const PARENT_FROM_END = 2;
    const ROOT_ONLY = 1;
    const TOP_LEVEL = 1;
    const HALF_PERCENT = 50;

    type Props = SunburstExampleProps;

    let { branch = $bindable(), ...props }: Props = $props();

    const getFamily = (node: SunburstNode<string>) => {
        const topLevel = TreemapUtils.findPath(LIBRARY, node)?.[TOP_LEVEL] ?? node;
        const index = Math.max(0, LIBRARY.children?.indexOf(topLevel) ?? 0);

        return PAGE_SUNBURST_FAMILIES[index % PAGE_SUNBURST_FAMILIES.length];
    };

    const getTitle = (node: SunburstNode<string>, weight: number) =>
        `${(TreemapUtils.findPath(LIBRARY, node) ?? [node]).map((step) => step.value).join("/")}\n${formatLines(weight)}`;

    const weights = TreemapUtils.computeWeights(LIBRARY);

    const path = $derived(TreemapUtils.findPath(LIBRARY, branch) ?? [LIBRARY]);

    const hubInset = $derived(`${(props.ringCount / (props.ringCount + ROOT_ONLY)) * HALF_PERCENT}%`);
</script>

<div class={styles.frame}>
    <Sunburst
        root={LIBRARY}
        bind:branch
        ringCount={props.ringCount}
        zoomDurationMs={props.zoomDurationMs}
        ariaLabel={"The library's source, by lines of code"}
    >
        {#snippet renderArc(node, state)}
            <PageSunburstArc {state} family={getFamily(node)} name={node.value} title={getTitle(node, state.weight)} />
        {/snippet}
    </Sunburst>

    <div class={styles.hub} style:inset={hubInset}>
        <Button
            id={"sunburstUp"}
            sizing={"fill"}
            isDisabled={path.length <= ROOT_ONLY}
            onClick={() => {
                const parent = path[path.length - PARENT_FROM_END];

                if (parent) branch = parent;
            }}
        >
            {#snippet renderContent(flags)}
                <PageSunburstHub {flags} name={branch.value} weight={formatLines(weights.get(branch) ?? 0)} />
            {/snippet}
        </Button>
    </div>
</div>
