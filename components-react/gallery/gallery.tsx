import { type ComponentType, StrictMode } from "react";
import { flushSync } from "react-dom";
import { type Root, createRoot } from "react-dom/client";

type MountParams = { story: string; props?: Record<string, unknown> };

declare global {
    interface Window {
        mount: (params: MountParams) => Promise<void>;
        unmount: () => Promise<void>;
    }
}

const STORY_SUFFIX = ".story.tsx";

type StoryModule = Record<string, ComponentType<Record<string, unknown>>>;

const modules = import.meta.glob<StoryModule>("./**/*.story.tsx");

const loadStory = async (id: string) => {
    const split = id.lastIndexOf("/");
    const path = `./${id.slice(0, split)}${STORY_SUFFIX}`;
    const load = modules[path];

    if (!load) throw new Error(`No story file for "${id}". Known files: ${Object.keys(modules).join(", ")}`);

    const story = (await load())[id.slice(split + 1)];

    if (!story) throw new Error(`No story "${id}".`);

    return story;
};

const container = document.getElementById("root")!;

let root: Root | undefined;
let renderError: unknown;

window.mount = async ({ story, props }) => {
    const Story = await loadStory(story);

    root ??= createRoot(container, {
        onUncaughtError: (error) => {
            renderError = error;
        },
    });
    renderError = undefined;

    flushSync(() =>
        root!.render(
            <StrictMode>
                <Story {...props} />
            </StrictMode>,
        ),
    );

    if (renderError !== undefined) throw renderError;
};

window.unmount = async () => {
    root?.unmount();
    root = undefined;
};
