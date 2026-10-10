<script lang="ts">
    import { Satellite } from "@thewaver/ss-components-svelte";
    import type { SatelliteDefs } from "@thewaver/ss-components-svelte";

    import PageSatelliteBadge from "../../../StyledComponents/SatelliteContent/PageSatelliteBadge.svelte";
    import PageSatelliteSubject from "../../../StyledComponents/SatelliteContent/PageSatelliteSubject.svelte";
    import type { SatelliteExampleProps } from "../SatellitePage.types";

    const CORNER_SIZE = 48;
    const SIDE_SIZE = 72;
    const TUCKED_SIZE = 88;
    const CORNER_OVERHANG = 20;
    const TUCKED_DEPTH = 32;

    const SATELLITES: SatelliteDefs[] = [
        {
            placement: { x: "right-in", y: "top-in" },
            offset: { x: CORNER_OVERHANG, y: -CORNER_OVERHANG },
            renderSatellite: cornerBadge,
        },
        {
            placement: { x: "left-out", y: "center" },
            renderSatellite: sideBadge,
        },
        {
            placement: { x: "center", y: "bottom-out" },
            offset: { x: 0, y: -TUCKED_DEPTH },
            isBehindSubject: true,
            renderSatellite: tuckedBadge,
        },
    ];

    type Props = SatelliteExampleProps;

    let props: Props = $props();
</script>

{#snippet cornerBadge()}
    <PageSatelliteBadge size={CORNER_SIZE}>3</PageSatelliteBadge>
{/snippet}

{#snippet sideBadge()}
    <PageSatelliteBadge size={SIDE_SIZE} isMuted={true}>A</PageSatelliteBadge>
{/snippet}

{#snippet tuckedBadge()}
    <PageSatelliteBadge size={TUCKED_SIZE} isMuted={true} />
{/snippet}

<Satellite satellites={SATELLITES}>
    <PageSatelliteSubject width={props.subjectWidth} height={props.subjectHeight}>Subject</PageSatelliteSubject>
</Satellite>
