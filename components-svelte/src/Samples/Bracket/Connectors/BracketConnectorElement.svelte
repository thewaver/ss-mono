<svelte:options namespace="svg" />

<script lang="ts">
    import type { BracketConnectorElementProps } from "./BracketConnectorsSvelte.types.js";

    let props: BracketConnectorElementProps = $props();

    const gradientId = $derived(`bracketConnector-${props.paint.defs.id}`);
</script>

<g>
    <defs>
        <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={props.paint.defs.from.x}
            y1={props.paint.defs.from.y}
            x2={props.paint.defs.to.x}
            y2={props.paint.defs.to.y}
        >
            <stop offset="0%" style:stop-color={props.paint.fromColor} />
            <stop offset="100%" style:stop-color={props.paint.toColor} />
        </linearGradient>
    </defs>

    <path
        d={props.d}
        fill="none"
        stroke={`url(#${gradientId})`}
        stroke-width={props.paint.width}
        stroke-linecap="round"
        stroke-linejoin="round"
    />

    {#if props.tips}
        <circle
            cx={props.paint.defs.to.x}
            cy={props.paint.defs.to.y}
            r={props.tips.ballRadius}
            style:fill={props.paint.toColor}
        />

        <polygon points={props.tips.arrowPoints} style:fill={props.paint.fromColor} />
    {/if}
</g>
