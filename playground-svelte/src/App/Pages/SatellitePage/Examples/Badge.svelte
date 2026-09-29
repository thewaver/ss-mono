<script lang="ts">
    import { Satellite } from "@thewaver/ss-components-svelte";
    import type { AnchorPlacement, SatelliteDefs } from "@thewaver/ss-components-svelte";
    import type { Point2d } from "@thewaver/ss-utils";

    import PageSatellitePill from "../../../StyledComponents/SatelliteContent/PageSatellitePill.svelte";
    import PageSatelliteSubject from "../../../StyledComponents/SatelliteContent/PageSatelliteSubject.svelte";
    import type { SatelliteBadgeCorner, SatelliteBadgeExampleProps } from "../SatellitePage.types";

    const PLACEMENTS: Record<SatelliteBadgeCorner, AnchorPlacement> = {
        "top-left": { x: "left-in", y: "top-in" },
        "top-right": { x: "right-in", y: "top-in" },
        "bottom-left": { x: "left-in", y: "bottom-in" },
        "bottom-right": { x: "right-in", y: "bottom-in" },
    };

    const OUTWARD: Record<SatelliteBadgeCorner, Point2d> = {
        "top-left": { x: -1, y: -1 },
        "top-right": { x: 1, y: -1 },
        "bottom-left": { x: -1, y: 1 },
        "bottom-right": { x: 1, y: 1 },
    };

    type Props = SatelliteBadgeExampleProps;

    let props: Props = $props();

    const offset = $derived({
        x: OUTWARD[props.corner].x * props.overhang,
        y: OUTWARD[props.corner].y * props.overhang,
    });

    const satellites: SatelliteDefs[] = $derived([
        {
            placement: PLACEMENTS[props.corner],
            offset,
            renderSatellite: pill,
        },
    ]);
</script>

{#snippet pill()}
    <PageSatellitePill>{props.count}</PageSatellitePill>
{/snippet}

<Satellite {satellites}>
    <PageSatelliteSubject width={props.subjectWidth} height={props.subjectHeight}>Inbox</PageSatelliteSubject>
</Satellite>
