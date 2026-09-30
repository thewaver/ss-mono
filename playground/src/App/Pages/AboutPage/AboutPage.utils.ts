import shellscript from "shiki/langs/shellscript.mjs";
import svelte from "shiki/langs/svelte.mjs";
import vue from "shiki/langs/vue.mjs";

import { getDefaultHighlighterConfig, highlighter } from "../../../shiki";
import { PLAYGROUND_FRAMEWORK_LABELS } from "../../PageComponents/FrameworkSwitch/FrameworkSwitch.const";
import type { PlaygroundFramework } from "../../PageComponents/FrameworkSwitch/PlaygroundFramework.types";
import type { AboutBlock, AboutCodeLanguage, AboutLink, AboutSection } from "./AboutPage.types";

const NPM_PACKAGE_ROOT = "https://www.npmjs.com/package/";
const UTILS_PACKAGE = "@thewaver/ss-utils";
const CORE_PACKAGE = "@thewaver/ss-components";
const SOURCE_LINK: AboutLink = { text: "open-source", href: "https://github.com/thewaver/ss-mono" };
const WCAG_LINK: AboutLink = { text: "WCAG", href: "https://www.w3.org/WAI/standards-guidelines/wcag/" };

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
    export const computeSections = (framework: PlaygroundFramework): AboutSection[] => {
        const packageName = `@thewaver/ss-components-${framework}`;

        return [
            {
                heading: "What it is",
                blocks: [
                    {
                        kind: "paragraph",
                        text: [
                            `ss-components-${framework} is a free, `,
                            SOURCE_LINK,
                            " library of interface components for ",
                            toFrameworkLink(framework),
                            ": buttons, text and number fields, date and time pickers, selects, menus, modals, tabs, trees, tables, carousels, and a set of visual and motion effects besides.",
                        ],
                    },
                    {
                        kind: "paragraph",
                        text: [
                            "It is headless. Every component brings its structure, its behavior and its accessibility wiring, and none of the color, spacing or type. What a component looks like is yours to draw.",
                        ],
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
                            ", with the same names and the same props. All four sit on one framework-free core, so a control behaves the same way in each. This site is that library, built four times: pick the framework in the heading above the search field and the page you are reading opens in it.",
                        ],
                    },
                ],
            },
            {
                heading: "Philosophy",
                blocks: [
                    {
                        kind: "list",
                        items: [
                            [
                                "The library owns behavior and you own looks. A component never decides its own paint, so there is nothing to override and nothing to fight.",
                            ],
                            [
                                "Accessible by default. Keyboard routes, focus handling and ARIA roles come built in and are checked against ",
                                WCAG_LINK,
                                ". Where a choice of yours would leave a control failing a criterion, the library says so loudly in development instead of quietly going along.",
                            ],
                            [
                                "Your words, not ours. Apart from the name of what a control is, the library ships no sentence a reader would hear or see. Labels and announcements arrive through props, so a page in another language is never read out in English.",
                            ],
                            [
                                "Controls stay out of the way. A component hands you a controller and draws no buttons of its own, so where the buttons go, and how they look, is your decision.",
                            ],
                            [
                                "Nothing is hidden. The pieces the components are built from are exported too, so you can build the control the library does not have.",
                            ],
                            [
                                "One name for one thing. A prop is called the same in every framework; only the way you hand it in changes.",
                            ],
                        ],
                    },
                ],
            },
            {
                heading: "How it works",
                blocks: [
                    {
                        kind: "paragraph",
                        text: [
                            "A component is a box that behaves. You mount it, give it its data, and give it a render function for whatever it draws. The library calls that function with the control's current state, such as hovered, pressed, showing a focus ring, disabled or open, and you return the markup and styling for that state.",
                        ],
                    },
                    {
                        kind: "paragraph",
                        text: [
                            `State that both you and the component change, such as a field's value or whether a popup is open, is handed in as ${TWO_WAY_STATE[framework]}. Every example on this site is a live component, and every page has a Docs tab with the full list of its props.`,
                        ],
                    },
                ],
            },
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
