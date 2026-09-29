<svelte:options namespace="svg" />

<script lang="ts">
    import {
        SVGFilterDefs,
        SVGFilterDefsUtils,
        type SVGLightSourceDefs,
        type SVGLightSurfaceDefs,
        SVG_FILTER_DEFAULTS,
    } from "@thewaver/ss-components";

    import Markup from "../../../Utils/Markup.svelte";
    import type { SVGFilterElementProps } from "./SVGFilterDefsSvelte.types.js";

    let props: SVGFilterElementProps = $props();

    const surfaceDefaults = SVG_FILTER_DEFAULTS.lightSurface;
</script>

{#snippet lightSource(light: SVGLightSourceDefs)}
    {#if light.kind === "point"}
        <fePointLight x={light.x} y={light.y} z={light.z} />
    {:else}
        <feDistantLight azimuth={light.azimuth} elevation={light.elevation} />
    {/if}
{/snippet}

{#snippet lightSurface(surface: SVGLightSurfaceDefs, resultKey: string)}
    <feTurbulence
        type={surface.type ?? surfaceDefaults.type}
        baseFrequency={SVGFilterDefsUtils.computeBaseFrequency(surface.baseFrequency)}
        numOctaves={surface.numOctaves ?? surfaceDefaults.numOctaves}
        seed={surface.seed ?? surfaceDefaults.seed}
        stitchTiles={surface.stitchTiles ?? surfaceDefaults.stitchTiles}
        result={resultKey}
    />
{/snippet}

<filter id={props.filterId} {...props.assembly.region}>
    {#each props.assembly.inputs as input (input.key)}
        {@const primitive = props.primitives[input.key]}
        {#if primitive.kind === "dropShadow"}
            <feDropShadow
                in={input.srcIn}
                dx={primitive.defs.dx}
                dy={primitive.defs.dy}
                stdDeviation={primitive.defs.stdDeviation}
                result={primitive.key}
                flood-color={primitive.defs.floodColor}
                flood-opacity={primitive.defs.floodOpacity}
            >
                <Markup markup={primitive.custom} />
            </feDropShadow>
        {:else if primitive.kind === "gaussianBlur"}
            <feGaussianBlur in={input.srcIn} stdDeviation={primitive.defs.stdDeviation} result={primitive.key}>
                <Markup markup={primitive.custom} />
            </feGaussianBlur>
        {:else if primitive.kind === "turbulence"}
            {@const resolved = SVGFilterDefsUtils.resolveTurbulence(primitive.key, primitive.defs)}
            <feTurbulence
                type={resolved.type}
                baseFrequency={resolved.baseFrequency}
                numOctaves={resolved.numOctaves}
                seed={resolved.seed}
                stitchTiles={resolved.stitchTiles}
                result={resolved.keys.noise}
            >
                <Markup markup={primitive.custom} />
            </feTurbulence>

            {#if resolved.edgeFade > 0}
                <feColorMatrix
                    in={resolved.keys.noise}
                    type="matrix"
                    values={SVGFilterDefs.OPAQUE_ALPHA_MATRIX}
                    result={resolved.keys.opaque}
                />

                <feFlood flood-color={SVGFilterDefs.NEUTRAL_DISPLACEMENT_COLOR} result={resolved.keys.flat} />

                <feMorphology
                    in="SourceAlpha"
                    operator="erode"
                    radius={resolved.edgeFade}
                    result={resolved.keys.eroded}
                />

                <feGaussianBlur
                    in={resolved.keys.eroded}
                    stdDeviation={resolved.edgeFadeBlur}
                    result={resolved.keys.mask}
                />

                <feComposite
                    in={resolved.keys.opaque}
                    in2={resolved.keys.mask}
                    operator="in"
                    result={resolved.keys.maskedNoise}
                />

                <feComposite
                    in={resolved.keys.maskedNoise}
                    in2={resolved.keys.flat}
                    operator="over"
                    result={resolved.keys.map}
                />
            {/if}

            <feDisplacementMap
                in={input.srcIn}
                in2={resolved.edgeFade > 0 ? resolved.keys.map : resolved.keys.noise}
                scale={resolved.scale}
                xChannelSelector={resolved.xChannelSelector}
                yChannelSelector={resolved.yChannelSelector}
                result={primitive.key}
            />
        {:else if primitive.kind === "colorMatrix"}
            <feColorMatrix in={input.srcIn} type={primitive.type} values={primitive.values} result={primitive.key}>
                <Markup markup={primitive.custom} />
            </feColorMatrix>
        {:else if primitive.kind === "specularLighting"}
            {@render lightSurface(primitive.defs.surface, `${primitive.key}_surface`)}

            <feSpecularLighting
                in={`${primitive.key}_surface`}
                surfaceScale={`${primitive.defs.surfaceScale}`}
                specularConstant={`${primitive.defs.specularConstant ?? SVG_FILTER_DEFAULTS.specularConstant}`}
                specularExponent={`${primitive.defs.specularExponent ?? SVG_FILTER_DEFAULTS.specularExponent}`}
                lighting-color={primitive.defs.lightingColor ?? SVG_FILTER_DEFAULTS.lightingColor}
                color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                result={`${primitive.key}_light`}
            >
                {@render lightSource(primitive.defs.light)}
                <Markup markup={primitive.custom} />
            </feSpecularLighting>

            <feComposite
                in={`${primitive.key}_light`}
                in2="SourceAlpha"
                operator="in"
                color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                result={`${primitive.key}_mask`}
            />

            <feComposite
                in={input.srcIn}
                in2={`${primitive.key}_mask`}
                operator="arithmetic"
                k1={0}
                k2={1}
                k3={1}
                k4={0}
                color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                result={primitive.key}
            />
        {:else if primitive.kind === "diffuseLighting"}
            {@render lightSurface(primitive.defs.surface, `${primitive.key}_surface`)}

            <feDiffuseLighting
                in={`${primitive.key}_surface`}
                surfaceScale={`${primitive.defs.surfaceScale}`}
                diffuseConstant={`${primitive.defs.diffuseConstant ?? SVG_FILTER_DEFAULTS.diffuseConstant}`}
                lighting-color={primitive.defs.lightingColor ?? SVG_FILTER_DEFAULTS.lightingColor}
                color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                result={`${primitive.key}_light`}
            >
                {@render lightSource(primitive.defs.light)}
                <Markup markup={primitive.custom} />
            </feDiffuseLighting>

            <feComposite
                in={`${primitive.key}_light`}
                in2={input.srcIn}
                operator="arithmetic"
                k1={1}
                k2={0}
                k3={0}
                k4={0}
                color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                result={primitive.key}
            />
        {/if}
    {/each}

    {#if props.assembly.mergeKeys}
        <feMerge>
            {#each props.assembly.mergeKeys as key (key)}
                <feMergeNode in={key} />
            {/each}
        </feMerge>
    {/if}
</filter>
