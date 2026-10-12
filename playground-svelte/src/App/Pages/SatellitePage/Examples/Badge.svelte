<script lang="ts">
    import { Satellite } from "@thewaver/ss-components-svelte";
    import type { AnchorPlacement, SatelliteDefs } from "@thewaver/ss-components-svelte";
    import type { Point2d } from "@thewaver/ss-utils";

    import PageSatellitePill from "../../../StyledComponents/SatelliteContent/PageSatellitePill.svelte";
    import PageSatelliteSubject from "../../../StyledComponents/SatelliteContent/PageSatelliteSubject.svelte";
    import type { SatelliteBadgeCorner, SatelliteBadgeExampleProps } from "../SatellitePage.types";

    const PLACEMENTS: Record<SatelliteBadgeCorner, AnchorPlacement> = {
        "top_left": { x: "left_in", y: "top_in" },
        "top_right": { x: "right_in", y: "top_in" },
        "bottom_left": { x: "left_in", y: "bottom_in" },
        "bottom_right": { x: "right_in", y: "bottom_in" },
    };

    const OUTWARD: Record<SatelliteBadgeCorner, Point2d> = {
        "top_left": { x: -1, y: -1 },
        "top_right": { x: 1, y: -1 },
        "bottom_left": { x: -1, y: 1 },
        "bottom_right": { x: 1, y: 1 },
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
