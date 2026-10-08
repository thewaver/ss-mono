<script lang="ts">
    import { ShapeLayerUtils, ShapeStyles as styles } from "@thewaver/ss-components";
    import { Size2d } from "@thewaver/ss-utils";

    import Markup from "../../Utils/Markup.svelte";
    import type { ShapeProps } from "./Shape.types.js";

    const INITIAL_SIZE: Size2d = { width: 0, height: 0 };

    let props: ShapeProps = $props();

    let root = $state<HTMLDivElement>();
    let rootSize = $state.raw(INITIAL_SIZE);

    $effect(() => {
        const element = root;

        if (!element) return;

        const observer = new ResizeObserver(() => {
            const next = { width: element.offsetWidth, height: element.offsetHeight };

            if (!Size2d.isSame(rootSize, next)) rootSize = next;
        });

        observer.observe(element);

        return () => observer.disconnect();
    });

    const fillDefs = $derived(props.computeFillDefs?.(rootSize, root ?? undefined));
    const strokeDefs = $derived(props.computeStrokeDefs?.(rootSize, root ?? undefined));

    const geometry = $derived(
        ShapeLayerUtils.computeGeometry(
            props.computePoints(rootSize),
            props.joinRadii,
            props.lameExponents,
            props.strokeGeom,
        ),
    );

    const paths = $derived(
        ShapeLayerUtils.computeLayerPaths(
            geometry.points,
            strokeDefs,
            geometry.strokeGeom,
            geometry.joinRadii,
            geometry.lameExponents,
        ),
    );

    const viewBox = $derived(`0 0 ${rootSize.width} ${rootSize.height}`);
</script>

<div
    bind:this={root}
    class={styles.shapeRoot}
    style:shape-outside={ShapeLayerUtils.computeShapeOutside(paths[0].outerContour)}
>
    {#if fillDefs}
        <svg
            class={styles.shapeFillSVG}
            width={rootSize.width}
            height={rootSize.height}
            {viewBox}
            overflow="visible"
        >
            <defs>
                {#each fillDefs as def, index (index)}
                    <Markup markup={def.gradientOrPattern?.renderDefsElement()} />
                    <Markup markup={def.filter?.renderDefsElement()} />
                    <Markup markup={def.clipPath?.renderDefsElement()} />
                {/each}
            </defs>

            {#each fillDefs as def, index (index)}
                {@const paint = ShapeLayerUtils.computePaint(def)}
                <path
                    d={paths[0].outerPath}
                    fill={paint.fill}
                    fill-opacity={paint.fillOpacity}
                    filter={paint.filter}
                    clip-path={paint.clipPath}
                    style:mix-blend-mode={paint.mixBlendMode}
                />
            {/each}
        </svg>
    {/if}

    {@render props.renderChildren(rootSize, paths[0].outerPath, paths[0].outerPoints)}

    {#if strokeDefs}
        <svg
            class={styles.shapeStrokeSVG}
            width={rootSize.width}
            height={rootSize.height}
            {viewBox}
            overflow="visible"
        >
            <defs>
                {#each strokeDefs as def, index (index)}
                    <Markup markup={def.gradientOrPattern?.renderDefsElement()} />
                    <Markup markup={def.filter?.renderDefsElement()} />
                    <Markup markup={def.clipPath?.renderDefsElement()} />
                {/each}
            </defs>

            {#each strokeDefs as def, index (index)}
                {@const paint = ShapeLayerUtils.computePaint(def)}
                <path
                    d={`${paths[index].outerPath} ${paths[index].innerPath}`}
                    fill-rule="evenodd"
                    fill={paint.fill}
                    fill-opacity={paint.fillOpacity}
                    filter={paint.filter}
                    clip-path={paint.clipPath}
                    style:mix-blend-mode={paint.mixBlendMode}
                />
            {/each}
        </svg>
    {/if}
</div>
