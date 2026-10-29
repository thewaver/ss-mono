const DEFAULT_SIZE_PX = 64;
const WHOLE_PICTURE = 1;

const resolveThemeColor = (value: string) => {
    const name = value.match(/^var\((--[^),]+)/)?.[1];

    return name ? getComputedStyle(document.body).getPropertyValue(name).trim() : value;
};

export namespace ParticlePictureUtils {
    export const createDotSrc = (
        lightColor: string,
        darkColor: string,
        opts?: { fillShare?: number; sizePx?: number },
    ) => {
        const light = resolveThemeColor(lightColor);
        const dark = resolveThemeColor(darkColor);
        const size = opts?.sizePx ?? DEFAULT_SIZE_PX;
        const half = size * 0.5;
        const fillShare = opts?.fillShare ?? WHOLE_PICTURE;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><radialGradient id="g" cx="0.7" cy="0.3" fx="0.7" fy="0.3" r="0.99"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></radialGradient></defs><circle cx="${half}" cy="${half}" r="${half * fillShare}" fill="url(#g)"/></svg>`;

        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    };
}
