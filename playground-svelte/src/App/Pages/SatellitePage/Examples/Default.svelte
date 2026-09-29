<script lang="ts">
    import { Satellite } from "@thewaver/ss-components-svelte";

    import PageSatelliteBadge from "../../../StyledComponents/SatelliteContent/PageSatelliteBadge.svelte";
    import PageSatelliteSubject from "../../../StyledComponents/SatelliteContent/PageSatelliteSubject.svelte";
    import type { SatelliteDefaultExampleProps } from "../SatellitePage.types";

    type Props = SatelliteDefaultExampleProps;

    let props: Props = $props();
</script>

{#snippet badge()}
    <PageSatelliteBadge size={props.badgeSize}>{props.badgeSize}</PageSatelliteBadge>
{/snippet}

<Satellite
    satellites={props.hasSatellite
        ? [
              {
                  placement: props.placement,
                  offset: props.offset,
                  isBehindSubject: props.isBehindSubject,
                  renderSatellite: badge,
              },
          ]
        : []}
>
    <PageSatelliteSubject width={props.subjectWidth} height={props.subjectHeight}>Subject</PageSatelliteSubject>
</Satellite>
