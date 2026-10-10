import { useRef } from "react";
import { Link } from "react-router";

import { ElementObserverReactUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/GalleryPage/GalleryPage.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { PagePreview } from "../../PageComponents/Preview/Preview";
import type { GalleryPageProps, GalleryTileProps } from "./GalleryPage.types";

const GalleryTile = (props: GalleryTileProps) => {
    const previewRef = useRef<HTMLDivElement | null>(null);

    const isOnScreen = ElementObserverReactUtils.useViewportIntersection(previewRef);

    return (
        <div className={styles.galleryTile} data-gallery-tile="" data-testid={props.item.href}>
            <PageLayer level={1}>
                <Link className={styles.galleryTileName} to={props.item.href}>
                    {props.item.name}
                </Link>

                <div ref={previewRef} className={styles.galleryPreview}>
                    {isOnScreen && <PagePreview component={props.item.component} />}
                </div>
            </PageLayer>
        </div>
    );
};

export const GalleryPage = (props: GalleryPageProps) => {
    return (
        <div className={styles.galleryPage} data-view={"gallery"}>
            <h1 className={styles.galleryTitle}>{"Gallery"}</h1>

            {props.sections.map((section) => (
                <section key={section.name} className={styles.gallerySection}>
                    <h2 className={styles.galleryHeading}>{section.name}</h2>

                    {section.description && <p className={styles.galleryDescription}>{section.description}</p>}

                    <div className={styles.galleryGrid}>
                        {section.items.map((item) => (
                            <GalleryTile key={item.href} item={item} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};
