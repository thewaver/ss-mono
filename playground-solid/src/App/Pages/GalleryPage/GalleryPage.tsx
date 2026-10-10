import { For, Show, createSignal } from "solid-js";

import { A } from "@solidjs/router";
import { ElementObserverSolidUtils } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/GalleryPage/GalleryPage.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { PagePreview } from "../../PageComponents/Preview/Preview";
import type { GalleryPageProps, GalleryTileProps } from "./GalleryPage.types";

const GalleryTile = (props: GalleryTileProps) => {
    const [getPreviewRef, setPreviewRef] = createSignal<HTMLElement>();

    const getIsOnScreen = ElementObserverSolidUtils.createViewportIntersectionObserver(getPreviewRef);

    return (
        <div class={styles.galleryTile} data-gallery-tile data-testid={props.item.href}>
            <PageLayer level={1}>
                <A class={styles.galleryTileName} href={props.item.href}>
                    {props.item.name}
                </A>

                <div ref={setPreviewRef} class={styles.galleryPreview}>
                    <Show when={getIsOnScreen()}>
                        <PagePreview component={props.item.component} />
                    </Show>
                </div>
            </PageLayer>
        </div>
    );
};

export const GalleryPage = (props: GalleryPageProps) => {
    return (
        <div class={styles.galleryPage} data-view={"gallery"}>
            <h1 class={styles.galleryTitle}>{"Gallery"}</h1>

            <For each={props.sections}>
                {(section) => (
                    <section class={styles.gallerySection}>
                        <h2 class={styles.galleryHeading}>{section.name}</h2>

                        <Show when={section.description}>
                            {(getDescription) => <p class={styles.galleryDescription}>{getDescription()}</p>}
                        </Show>

                        <div class={styles.galleryGrid}>
                            <For each={section.items}>{(item) => <GalleryTile item={item} />}</For>
                        </div>
                    </section>
                )}
            </For>
        </div>
    );
};
