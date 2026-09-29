<script lang="ts">
    import COMPONENT_DEPENDENCIES from "virtual:component-dependencies";
    import type { DependencyNames } from "virtual:component-dependencies";

    import { Collapsible } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/App.css";

    import { DEPENDENCY_GROUPS, DEPENDENCY_SECTIONS, EMPTY_DEPENDENCY_NAMES, LIST_PAGELESS_COMPONENTS } from "./App.const";
    import { COMPONENT_CONFIGS, toPageHref } from "./App.router";
    import PageRouterLink from "./PageComponents/RouterLink/RouterLink.svelte";
    import type { PageViewKey } from "./PageComponents/ViewTabs/ViewTabs.types";
    import { getLayerClass } from "./StyledComponents/Layer/Layer.context";

    const CONFIGS_BY_KEY = new Map(COMPONENT_CONFIGS.map((config) => [config.name.toLowerCase(), config]));

    const listNames = (names: string[]) =>
        LIST_PAGELESS_COMPONENTS ? names : names.filter((name) => CONFIGS_BY_KEY.has(name.toLowerCase()));

    const listDependencyNames = (names: DependencyNames): DependencyNames => ({
        abstracts: listNames(names.abstracts),
        generators: listNames(names.generators),
        primitives: listNames(names.primitives),
        components: listNames(names.components),
    });

    const DEPENDENCIES_BY_KEY = new Map(
        Object.entries(COMPONENT_DEPENDENCIES).map(([name, dependencies]) => [
            name.toLowerCase(),
            { uses: listDependencyNames(dependencies.uses), usedBy: listDependencyNames(dependencies.usedBy) },
        ]),
    );

    const computeDependencySummary = (names: DependencyNames) =>
        DEPENDENCY_GROUPS.filter((group) => names[group.key].length > 0)
            .map(
                (group) => `${names[group.key].length} ${names[group.key].length === 1 ? group.singular : group.label}`,
            )
            .join(" and ");

    let props: { name: string; view: PageViewKey } = $props();

    let expandedSections = $derived.by((): string[] => {
        void props.name;

        return [];
    });

    const layerClass = $derived.by(getLayerClass());

    const dependencies = $derived(DEPENDENCIES_BY_KEY.get(props.name.toLowerCase()));
</script>

<div class={[styles.pageDependencies, layerClass]}>
    {#each DEPENDENCY_SECTIONS as section (section.key)}
        {@const sectionNames = dependencies?.[section.key] ?? EMPTY_DEPENDENCY_NAMES}

        {#if DEPENDENCY_GROUPS.some((group) => sectionNames[group.key].length)}
            <span class={styles.dependencySectionLabel}>{section.label}</span>

            <div class={styles.dependencyDisclosure}>
                <Collapsible
                    bind:expanded={
                        () => expandedSections.includes(section.key),
                        (next) => {
                            expandedSections = next
                                ? [...expandedSections, section.key]
                                : expandedSections.filter((key) => key !== section.key);
                        }
                    }
                    sizing={"fill"}
                    isPanelBuiltOnExpand={true}
                >
                    {#snippet renderTrigger(flags)}
                        <div
                            class={[
                                styles.dependencySummary,
                                flags.isExpanded && styles.isExpanded,
                                flags.isHovered && styles.isHovered,
                            ]}
                        >
                            <span>{computeDependencySummary(sectionNames)}</span>

                            <span class={styles.dependencySummaryMarker} aria-hidden="true">{"▶"}</span>
                        </div>
                    {/snippet}

                    {#snippet renderPanel(visibilityTarget, transitionDurationMs)}
                        <div
                            class={styles.dependencyGroups}
                            style:opacity={visibilityTarget}
                            style:transition={`opacity ${transitionDurationMs}ms`}
                        >
                            {#each DEPENDENCY_GROUPS as group (group.key)}
                                {#if sectionNames[group.key].length}
                                    <div class={styles.dependencyGroup}>
                                        <span class={styles.dependencyLabel}>{group.label}</span>

                                        {#each sectionNames[group.key] as name (name)}
                                            {@const pageConfig = CONFIGS_BY_KEY.get(name.toLowerCase())}

                                            {#if pageConfig}
                                                <PageRouterLink
                                                    class={styles.dependencyLink}
                                                    href={toPageHref(pageConfig, props.view)}
                                                >
                                                    {name}
                                                </PageRouterLink>
                                            {:else}
                                                <span class={styles.dependencyName}>{name}</span>
                                            {/if}
                                        {/each}
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    {/snippet}
                </Collapsible>
            </div>
        {/if}
    {/each}
</div>
