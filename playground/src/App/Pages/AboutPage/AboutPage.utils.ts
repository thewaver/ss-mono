import shellscript from "shiki/langs/shellscript.mjs";
import svelte from "shiki/langs/svelte.mjs";
import vue from "shiki/langs/vue.mjs";

import { getDefaultHighlighterConfig, highlighter } from "../../../shiki";
import { PLAYGROUND_FRAMEWORK_LABELS } from "../../PageComponents/FrameworkSwitch/FrameworkSwitch.const";
import type { PlaygroundFramework } from "../../PageComponents/FrameworkSwitch/PlaygroundFramework.types";
import {
    ABOUT_COMPONENT_KINDS,
    ABOUT_HEADLESS,
    ABOUT_HOW_IT_WORKS,
    ABOUT_PHILOSOPHY,
    ABOUT_SHARED_CORE,
    ABOUT_SOURCE_LINK,
} from "./AboutPage.const";
import type { AboutBlock, AboutCodeLanguage, AboutLink, AboutSection } from "./AboutPage.types";

const NPM_PACKAGE_ROOT = "https://www.npmjs.com/package/";
const UTILS_PACKAGE = "@thewaver/ss-utils";
const CORE_PACKAGE = "@thewaver/ss-components";

const FRAMEWORK_SITES: Record<PlaygroundFramework, string> = {
    solid: "https://www.solidjs.com",
    react: "https://react.dev",
    vue: "https://vuejs.org",
    svelte: "https://svelte.dev",
};

const toFrameworkLink = (framework: PlaygroundFramework): AboutLink => ({
    text: PLAYGROUND_FRAMEWORK_LABELS[framework],
    href: FRAMEWORK_SITES[framework],
});

const toNpmLink = (packageName: string): AboutLink => ({
    text: packageName,
    href: `${NPM_PACKAGE_ROOT}${packageName}`,
});

const PEER_DEPENDENCIES: Record<PlaygroundFramework, string> = {
    solid: "solid-js",
    react: "react react-dom",
    vue: "vue",
    svelte: "svelte",
};

const TWO_WAY_STATE: Record<PlaygroundFramework, string> = {
    solid: "a signal pair, the two functions createSignal returns",
    react: "a [value, setValue] pair, as useState returns",
    vue: "v-model, written v-model:value",
    svelte: "bind:, written bind:value",
};

const USAGE_SOURCES: Record<PlaygroundFramework, (packageName: string) => AboutBlock> = {
    solid: (packageName) => ({
        kind: "code",
        language: "tsx",
        source: `import { Button } from "${packageName}";
import "@thewaver/ss-components/styles.css";

function Example() {
    return <Button onClick={() => console.log("clicked")} renderContent={() => "Click me"} />;
}`,
    }),
    react: (packageName) => ({
        kind: "code",
        language: "tsx",
        source: `import { Button } from "${packageName}";
import "@thewaver/ss-components/styles.css";

function Example() {
    return <Button onClick={() => console.log("clicked")} renderContent={() => "Click me"} />;
}`,
    }),
    vue: (packageName) => ({
        kind: "code",
        language: "vue",
        source: `<script setup lang="ts">
import { Button } from "${packageName}";
import "@thewaver/ss-components/styles.css";

const onClick = () => console.log("clicked");
</script>

<template>
    <Button @click="onClick">
        <template #renderContent>Click me</template>
    </Button>
</template>`,
    }),
    svelte: (packageName) => ({
        kind: "code",
        language: "svelte",
        source: `<script lang="ts">
    import { Button } from "${packageName}";
    import "@thewaver/ss-components/styles.css";
</script>

<Button onClick={() => console.log("clicked")}>
    {#snippet renderContent()}Click me{/snippet}
</Button>`,
    }),
};

const HIGHLIGHTER_LANGUAGES: Record<AboutCodeLanguage, string> = {
    shell: "shellscript",
    tsx: "tsx",
    vue: "vue",
    svelte: "svelte",
};

await highlighter.loadLanguage(shellscript, svelte, vue);

export namespace AboutPageUtils {
    export const computeSections = (framework: PlaygroundFramework): AboutSection[] => [
        {
            heading: "What it is",
            blocks: [
                {
                    kind: "paragraph",
                    text: [
                        `ss-components-${framework} is a free, `,
                        ABOUT_SOURCE_LINK,
                        " library of interface components for ",
                        toFrameworkLink(framework),
                        `: ${ABOUT_COMPONENT_KINDS}.`,
                    ],
                },
                {
                    kind: "paragraph",
                    text: [ABOUT_HEADLESS],
                },
                {
                    kind: "paragraph",
                    text: [
                        "The same components exist for ",
                        toFrameworkLink("solid"),
                        ", ",
                        toFrameworkLink("react"),
                        ", ",
                        toFrameworkLink("vue"),
                        " and ",
                        toFrameworkLink("svelte"),
                        `, with the same names and the same props. ${ABOUT_SHARED_CORE} This site is that library, built four times: pick the framework in the heading above the search field and the page you are reading opens in it.`,
                    ],
                },
            ],
        },
        {
            heading: "Philosophy",
            blocks: [
                {
                    kind: "list",
                    items: ABOUT_PHILOSOPHY,
                },
            ],
        },
        {
            heading: "How it works",
            blocks: [
                {
                    kind: "paragraph",
                    text: [ABOUT_HOW_IT_WORKS],
                },
                {
                    kind: "paragraph",
                    text: [
                        `State that both you and the component change, such as a field's value or whether a popup is open, is handed in as ${TWO_WAY_STATE[framework]}. Every example on this site is a live component, and every page has a Docs tab with the full list of its props.`,
                    ],
                },
            ],
        },
    ];

    export const computeGettingStartedSections = (framework: PlaygroundFramework): AboutSection[] => {
        const packageName = `@thewaver/ss-components-${framework}`;

        return [
            {
                heading: "Install",
                blocks: [
                    {
                        kind: "code",
                        language: "shell",
                        source: `npm install ${packageName}`,
                    },
                    {
                        kind: "paragraph",
                        text: [
                            "The rest comes along on its own. ",
                            toNpmLink(UTILS_PACKAGE),
                            ` and ${PEER_DEPENDENCIES[framework].replace(" ", " and ")} are peer dependencies, which npm installs for you, and the framework-free core, `,
                            toNpmLink(CORE_PACKAGE),
                            ", is a dependency. Import its stylesheet once, in your app's entry. It holds the structural CSS every component depends on, so it is required.",
                        ],
                    },
                    USAGE_SOURCES[framework](packageName),
                ],
            },
        ];
    };

    export const toCodeHtml = (language: AboutCodeLanguage, source: string) =>
        highlighter.codeToHtml(source, { ...getDefaultHighlighterConfig(), lang: HIGHLIGHTER_LANGUAGES[language] });
}
