<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.css";

    import type { NavMenuEntry, NavigationMenuExampleProps } from "../HoverCardPage.types";
    import NavFlyout from "./NavFlyout.svelte";

    const ENTRIES: NavMenuEntry[] = [
        { key: "keep", label: "Keep" },
        {
            key: "armory",
            label: "Armory",
            links: [
                { key: "armory-blades", label: "Blades" },
                { key: "armory-shields", label: "Shields" },
                { key: "armory-mail", label: "Mail and plate" },
            ],
        },
        {
            key: "stables",
            label: "Stables",
            links: [
                { key: "stables-destriers", label: "Destriers" },
                { key: "stables-farriers", label: "Farriers" },
                { key: "stables-feed", label: "Feed and tack" },
            ],
        },
        { key: "chronicle", label: "Chronicle" },
    ];

    let { openKey = $bindable(), ...props }: NavigationMenuExampleProps = $props();
</script>

<nav aria-label={"Castle"}>
    <ul class={styles.navList}>
        {#each ENTRIES as entry (entry.key)}
            <li>
                {#if entry.links}
                    <NavFlyout {...props} bind:openKey {entry} links={entry.links} />
                {:else}
                    <a href={`#${entry.key}`} class={styles.navLink}>{entry.label}</a>
                {/if}
            </li>
        {/each}
    </ul>
</nav>
