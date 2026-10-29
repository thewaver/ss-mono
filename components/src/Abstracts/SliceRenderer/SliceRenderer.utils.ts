import type { Size2d } from "@thewaver/ss-utils";

import { CellAnimationUtils } from "../../Exotics/Animations/CellAnimation/CellAnimation.utils";
import type { SVGColorMixing } from "../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.types";
import type { SliceAnimationEasing } from "../../Generators/SliceAnimationBreakpoints/SliceAnimationBreakpoints.types";
import { SliceAnimationBreakpointUtils } from "../../Generators/SliceAnimationBreakpoints/SliceAnimationBreakpoints.utils";
import type { SliceStop } from "../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import type { SliceAnimationRenderer } from "../SliceAnimation/SliceAnimation.types";
import { SliceRendererConst } from "./SliceRenderer.internal.const";
import type {
    SliceRendererFrame,
    SliceRendererItem,
    SliceRendererMode,
    SliceRendererPicture,
    SliceRendererSlice,
    SliceRendererTint,
} from "./SliceRenderer.types";

type Program = {
    program: WebGLProgram;
    uniforms: Record<string, WebGLUniformLocation | null>;
};

type Resources = {
    draw: Program;
    corners: WebGLBuffer;
    textures: Map<string, Map<string, WebGLTexture>>;
    maxTextureSize: number;
};

type Renderer = {
    gl: WebGL2RenderingContext;
    canvas: OffscreenCanvas;
    resources: Resources | undefined;
};

type Submission = {
    width: number;
    height: number;
    render: () => void;
    present: (picture: ImageBitmap) => void;
};

type Placement = { submission: Submission; left: number; top: number };

type Batch = { placements: Placement[]; width: number; height: number };

type PictureEntry = {
    picture: SliceRendererPicture;
    image: HTMLImageElement | undefined;
    listeners: Set<() => void>;
};

const TRACK_KEYS = SliceRendererConst.TRACK_KEYS_IN_ORDER;
const MAX_STOPS = SliceRendererConst.MAX_STOPS_PER_TRACK;
const EASING_SIZE = SliceRendererConst.EASING_SAMPLE_COUNT;
const INSTANCE_FLOATS = 14;
const BYTES_PER_FLOAT = 4;
const TEXEL_FLOATS = 4;
const CORNERS = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
const CORNER_COUNT = 4;
const WHOLE_WINDOW: [number, number, number] = [0, 0.5, 1];
const NO_TINT: SliceRendererTint = [1, 1, 1, 1];
const NO_TINT_COLOR = "#ffffff";
const NO_DIRECT: [number, number, number, number] = [1, 1, 0, 1];
const NO_SIZE: Size2d = { width: 0, height: 0 };
const NOTHING_TO_NOTIFY = () => undefined;
const SPRITE_RESOLUTION = 128;
const ATLAS_WIDTH_PX = 4096;
const SPRITE_KEY = "sprite";
const MODES: Record<SliceRendererMode, number> = { slices: 0, particles: 1, direct: 2 };
const CHANNEL_MODES = { additive: 1, subtractive: 2 } as const;
const NO_CHANNELS = 0;
const NO_PERSPECTIVE = 0;
const PERCENT = 100;
const BLUR_REACH = 3;
const CHANNEL_MAX = 255;
const MULTI_FRAME_FORMATS = /^data:image\/(gif|png|apng|webp|avif)|\.(gif|png|apng|webp|avif)([?#]|$)/i;
const UNIFORM_NAMES = [
    "u_tables",
    "u_easingRow",
    "u_mode",
    "u_timeline",
    "u_half",
    "u_desc",
    "u_clock",
    "u_lifetime",
    "u_size",
    "u_area",
    "u_perspective",
    "u_viewport",
    "u_scale",
    "u_src",
    "u_channelMode",
    "u_isSprite",
    "u_srcScale",
];

const pictures = new Map<string, PictureEntry>();
const framesChecked = new Set<string>();
const subscribers = new Set<() => void>();
const tints = new Map<string, SliceRendererTint>();

let renderer: Renderer | null | undefined;
let tintContext: CanvasRenderingContext2D | null | undefined;
let flushId: ReturnType<typeof requestAnimationFrame> | undefined;

const submissions = new Map<object, Submission>();

const notify = () => {
    for (const subscriber of [...subscribers]) subscriber();
};

const compileShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);

    if (!shader) throw new Error("SliceRenderer: the graphics card refused to create a shader.");

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "");

    return shader;
};

const linkProgram = (gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): Program => {
    const program = gl.createProgram();

    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "");

    return {
        program,
        uniforms: Object.fromEntries(UNIFORM_NAMES.map((name) => [name, gl.getUniformLocation(program, name)])),
    };
};

const createResources = (gl: WebGL2RenderingContext): Resources => {
    const corners = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, corners);
    gl.bufferData(gl.ARRAY_BUFFER, CORNERS, gl.STATIC_DRAW);

    return {
        draw: linkProgram(gl, SliceRendererConst.VERTEX_SHADER, SliceRendererConst.FRAGMENT_SHADER),
        corners,
        textures: new Map(),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    };
};

const createRenderer = (): Renderer | null => {
    if (typeof OffscreenCanvas === "undefined") return null;

    const canvas = new OffscreenCanvas(1, 1);
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: true });

    if (!gl) return null;

    const created: Renderer = { gl, canvas, resources: createResources(gl) };

    canvas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        created.resources = undefined;
        notify();
    });

    canvas.addEventListener("webglcontextrestored", () => {
        created.resources = createResources(gl);
        notify();
    });

    return created;
};

const getRenderer = () => {
    if (renderer === undefined) renderer = createRenderer();

    return renderer;
};

const loadImage = (src: string, isShared: boolean) => {
    const image = new Image();

    if (isShared) image.crossOrigin = "anonymous";

    image.src = src;

    return image.decode().then(() => image);
};

const settlePicture = (
    entry: PictureEntry,
    status: SliceRendererPicture["status"],
    image: HTMLImageElement | undefined,
) => {
    entry.picture = {
        status,
        size: image ? { width: image.naturalWidth, height: image.naturalHeight } : NO_SIZE,
    };
    entry.image = status === "shareable" ? image : undefined;

    for (const listener of [...entry.listeners]) listener();

    entry.listeners.clear();
};

const requestPictureEntry = (src: string, onSettled: () => void) => {
    const existing = pictures.get(src);

    if (existing) {
        if (existing.picture.status === "loading") existing.listeners.add(onSettled);

        return existing;
    }

    const entry: PictureEntry = {
        picture: { status: "loading", size: NO_SIZE },
        image: undefined,
        listeners: new Set([onSettled]),
    };

    pictures.set(src, entry);

    loadImage(src, true)
        .then((image) => settlePicture(entry, "shareable", image))
        .catch(() =>
            loadImage(src, false)
                .then((image) => {
                    console.warn(
                        `SliceRenderer: the server of ${src} gives no cross-origin permission, so the graphics card may not draw it and it is drawn with page elements instead.`,
                    );
                    settlePicture(entry, "unshareable", image);
                })
                .catch(() => settlePicture(entry, "broken", undefined)),
        );

    return entry;
};

const checkFrames = (src: string) => {
    if (framesChecked.has(src)) return;

    framesChecked.add(src);

    if (typeof ImageDecoder === "undefined" || !MULTI_FRAME_FORMATS.test(src)) return;

    fetch(src)
        .then((response) => response.blob())
        .then(async (blob) => {
            if (!(await ImageDecoder.isTypeSupported(blob.type))) return;

            const decoder = new ImageDecoder({ data: blob.stream(), type: blob.type });

            await decoder.tracks.ready;

            if (decoder.tracks.selectedTrack?.animated) {
                console.warn(
                    `SliceRenderer: ${src} has more than one frame, and the graphics card draws only the first. Set the renderer to "elements" to keep it playing.`,
                );
            }

            decoder.close();
        })
        .catch(() => undefined);
};

const uploadTexture = (gl: WebGL2RenderingContext, image: CanvasImageSource, width: number, height: number) => {
    const scaled = new OffscreenCanvas(width, height);
    const context = scaled.getContext("2d");
    const texture = gl.createTexture();

    if (context) {
        context.imageSmoothingQuality = "high";
        context.drawImage(image, 0, 0, width, height);
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scaled);
    gl.generateMipmap(gl.TEXTURE_2D);

    return texture;
};

const getTexture = (
    current: Renderer,
    resources: Resources,
    src: string,
    image: HTMLImageElement,
    key: string,
    size: Size2d,
) => {
    const bySrc = resources.textures.get(src) ?? new Map<string, WebGLTexture>();
    const existing = bySrc.get(key);

    if (existing) return existing;

    const texture = uploadTexture(current.gl, image, size.width, size.height);

    bySrc.set(key, texture);
    resources.textures.set(src, bySrc);

    return texture;
};

const getSpriteSize = (image: HTMLImageElement): Size2d => {
    const longest = Math.max(image.naturalWidth, image.naturalHeight, 1);
    const ratio = SPRITE_RESOLUTION / longest;

    return {
        width: Math.max(1, Math.round(image.naturalWidth * ratio)),
        height: Math.max(1, Math.round(image.naturalHeight * ratio)),
    };
};

const toTableData = (tables: SliceStop[][], easing: Float32Array, maxTextureSize: number) => {
    const tracks = tables.map((stops) =>
        TRACK_KEYS.map((key) => {
            const track = stops.filter((stop) => stop[key] !== undefined);

            if (track.length > MAX_STOPS) {
                throw new Error(
                    `SliceRenderer: a table has ${track.length} stops for "${key}"; the graphics card reads ${MAX_STOPS}.`,
                );
            }

            return track.map((stop) => [stop.at, stop[key] ?? 0]);
        }),
    );
    const rowWidths = tracks.map((table) => TRACK_KEYS.length + table.reduce((sum, track) => sum + track.length, 0));
    const width = Math.max(EASING_SIZE, ...rowWidths);
    const height = tables.length + 1;

    if (width > maxTextureSize || height > maxTextureSize) {
        throw new Error(
            `SliceRenderer: the tables need a ${width} × ${height} texture; this graphics card allows ${maxTextureSize}.`,
        );
    }

    const data = new Float32Array(width * height * TEXEL_FLOATS);

    tracks.forEach((table, row) => {
        let offset = TRACK_KEYS.length;

        table.forEach((track, trackIdx) => {
            data.set([offset, track.length, 0, 0], (row * width + trackIdx) * TEXEL_FLOATS);
            track.forEach(([at, value], stopIdx) => {
                data.set([at, value, 0, 0], (row * width + offset + stopIdx) * TEXEL_FLOATS);
            });
            offset += track.length;
        });
    });

    easing.forEach((value, idx) => {
        data[((height - 1) * width + idx) * TEXEL_FLOATS] = value;
    });

    return { data, width, height, easingRow: height - 1 };
};

const computePerspectivePx = (size: Size2d) =>
    parseFloat(CellAnimationUtils.computePerspective(size)) || NO_PERSPECTIVE;

const toInstanceData = (slices: SliceRendererSlice[], mode: SliceRendererMode) => {
    const ordered =
        mode === "slices"
            ? slices
                  .map((slice, idx) => ({ slice, idx, depth: CellAnimationUtils.computeCellDepth(slice.weight) }))
                  .sort((a, b) => a.depth - b.depth || a.idx - b.idx)
                  .map(({ slice }) => slice)
            : slices;
    const data = new Float32Array(ordered.length * INSTANCE_FLOATS);

    ordered.forEach((slice, idx) => {
        data.set(
            [
                slice.left,
                slice.top,
                slice.width,
                slice.height,
                slice.weight,
                slice.table,
                ...(slice.tint ?? NO_TINT),
                ...(slice.direct ?? NO_DIRECT),
            ],
            idx * INSTANCE_FLOATS,
        );
    });

    return data;
};

const getTrackExtreme = (stops: SliceStop[], key: keyof SliceStop, fallback: number) =>
    stops.reduce((most, stop) => Math.max(most, Math.abs(stop[key] ?? fallback)), Math.abs(fallback));

const getTintContext = () => {
    if (tintContext === undefined) {
        tintContext =
            typeof document === "undefined"
                ? null
                : document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    }

    return tintContext;
};

const layoutBatches = (pending: Submission[], maxTextureSize: number): Batch[] => {
    const atlasWidth = Math.min(maxTextureSize, Math.max(ATLAS_WIDTH_PX, ...pending.map((item) => item.width)));
    const batches: Batch[] = [];

    let batch: Batch = { placements: [], width: 0, height: 0 };
    let left = 0;
    let rowTop = 0;
    let rowHeight = 0;

    for (const submission of pending) {
        if (left > 0 && left + submission.width > atlasWidth) {
            left = 0;
            rowTop += rowHeight;
            rowHeight = 0;
        }

        if (batch.placements.length > 0 && rowTop + submission.height > maxTextureSize) {
            batches.push(batch);
            batch = { placements: [], width: 0, height: 0 };
            left = 0;
            rowTop = 0;
            rowHeight = 0;
        }

        batch.placements.push({ submission, left, top: rowTop });
        batch.width = Math.max(batch.width, left + submission.width);
        batch.height = Math.max(batch.height, rowTop + submission.height);
        left += submission.width;
        rowHeight = Math.max(rowHeight, submission.height);
    }

    if (batch.placements.length > 0) batches.push(batch);

    return batches;
};

const drawBatch = (current: Renderer, batch: Batch) => {
    const { gl, canvas } = current;

    if (canvas.width < batch.width) canvas.width = batch.width;
    if (canvas.height < batch.height) canvas.height = batch.height;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.disable(gl.SCISSOR_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.SCISSOR_TEST);

    for (const { submission, left, top } of batch.placements) {
        const bottom = canvas.height - top - submission.height;

        gl.viewport(left, bottom, submission.width, submission.height);
        gl.scissor(left, bottom, submission.width, submission.height);
        submission.render();
    }

    gl.disable(gl.SCISSOR_TEST);

    const atlas = canvas.transferToImageBitmap();

    Promise.all(
        batch.placements.map(({ submission, left, top }) =>
            createImageBitmap(atlas, left, top, submission.width, submission.height).then(submission.present),
        ),
    )
        .catch(() => undefined)
        .finally(() => atlas.close());
};

const flush = () => {
    flushId = undefined;

    const current = renderer;
    const pending = [...submissions.values()];

    submissions.clear();

    if (!current?.resources || pending.length === 0) return;

    for (const batch of layoutBatches(pending, current.resources.maxTextureSize)) drawBatch(current, batch);
};

const submit = (key: object, submission: Submission) => {
    submissions.set(key, submission);

    if (flushId === undefined) flushId = requestAnimationFrame(flush);
};

/**
 * Draws slice animations and particles on the graphics card, into a canvas each component owns.
 *
 * One WebGL context serves the whole page, since browsers keep only a few alive at once. A component asks for an item
 * bound to its own canvas and hands it a frame; once per animation frame every component's frame is drawn into one
 * shared picture, handed over once and cut into each component's piece. The tables a sample is built from are uploaded once and worked out per
 * slice on the graphics card, so the page only advances the clock. Where the graphics card cannot be used — no
 * WebGL 2 in an offscreen canvas, a picture whose server gives no cross-origin permission, a context the browser has
 * taken away — {@link getCanDraw} says so and the component draws with page elements instead.
 */
export namespace SliceRendererUtils {
    /**
     * Whether the graphics card can draw right now.
     *
     * `false` where the browser has no WebGL 2 in an offscreen canvas, and while the browser has taken the context away;
     * {@link subscribe} hears when that changes.
     */
    export const getIsAvailable = () => !!getRenderer()?.resources;

    /**
     * Hears whenever the graphics card stops or starts being available, so a component can move between its canvas and
     * its page elements. Items made before a change no longer draw and are made again.
     *
     * @param listener Runs on every change.
     * @returns Stops listening.
     */
    export const subscribe = (listener: () => void) => {
        subscribers.add(listener);

        return () => {
            subscribers.delete(listener);
        };
    };

    /**
     * A picture as the graphics card sees it, loading it the first time it is asked for.
     *
     * The picture is requested with cross-origin permission, which the graphics card needs before it may read it. A
     * server that refuses it gets a second, plain request, so the picture's size is still known; the picture is then
     * `unshareable`, a warning names it, and a component draws it with page elements. A picture that loads neither
     * way is `broken`, and nothing can draw it.
     *
     * @param src The picture's address.
     * @param onSettled Runs once, when a picture still loading has settled. Not run for one already settled.
     * @returns Its status and its own size — `0` by `0` until it has loaded.
     */
    export const requestPicture = (src: string, onSettled: () => void): SliceRendererPicture =>
        requestPictureEntry(src, onSettled).picture;

    /**
     * Whether a component should draw on the graphics card rather than with page elements.
     *
     * @param requested The renderer the consumer asked for.
     * @param picture The picture, from {@link requestPicture}.
     * @returns `true` only when the graphics card was asked for, is available, and may read the picture. A picture
     * still loading counts as readable, so a component does not draw it twice over while it arrives.
     */
    export const getCanDraw = (requested: SliceAnimationRenderer, picture: SliceRendererPicture | undefined) =>
        requested === "graphics_card" &&
        getIsAvailable() &&
        picture?.status !== "unshareable" &&
        picture?.status !== "broken";

    /**
     * Any CSS color as the four numbers the graphics card multiplies a picture by, each `0`–`1`.
     *
     * Parsed by the browser, so a named color, `hsl()` or `color-mix()` all work. Remembered by its text.
     *
     * @param color The color, as CSS writes it. A `var()` is not resolved and comes out as no tint.
     */
    export const toTint = (color: string): SliceRendererTint => {
        const cached = tints.get(color);

        if (cached) return cached;

        const context = getTintContext();

        if (!context) return NO_TINT;

        context.clearRect(0, 0, 1, 1);
        context.fillStyle = NO_TINT_COLOR;
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);

        const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
        const tint: SliceRendererTint = [
            red / CHANNEL_MAX,
            green / CHANNEL_MAX,
            blue / CHANNEL_MAX,
            alpha / CHANNEL_MAX,
        ];

        tints.set(color, tint);

        return tint;
    };

    /**
     * A tint as the two styles that reproduce it on a page element: the color with its alpha taken out, and that
     * alpha as an opacity.
     *
     * @param tint From {@link toTint}.
     */
    export const toTintStyle = ([red, green, blue, alpha]: SliceRendererTint) => ({
        color: `rgb(${Math.round(red * CHANNEL_MAX)} ${Math.round(green * CHANNEL_MAX)} ${Math.round(blue * CHANNEL_MAX)})`,
        opacity: alpha,
    });

    /**
     * An easing curve sampled for the graphics card, which reads it rather than working it out.
     *
     * @param easing The curve; linear if left out.
     */
    export const computeEasing = (easing: SliceAnimationEasing | undefined) =>
        Float32Array.from({ length: EASING_SIZE }, (_, idx) =>
            SliceAnimationBreakpointUtils.computeLocalTimeline(WHOLE_WINDOW, idx / (EASING_SIZE - 1), easing),
        );

    /**
     * How far past a component's box its canvas has to reach for everything its tables move to stay inside it.
     *
     * Counts only what carries a slice past the box: travel, growth beyond full size, turning, nearness under
     * perspective and blur.
     *
     * @param tables The tables the slices play.
     * @param size The largest slice.
     * @param box The component's box, for slices that turn in depth; `undefined` where nothing is drawn in depth.
     * @returns The reach on every side, in pixels.
     */
    export const computeReach = (tables: SliceStop[][], size: Size2d, box: Size2d | undefined) => {
        const longest = Math.max(size.width, size.height);
        const diagonal = Math.hypot(size.width, size.height);

        return tables.reduce((most, stops) => {
            const travel = Math.max(
                (getTrackExtreme(stops, "translateX", 0) * size.width) / PERCENT,
                (getTrackExtreme(stops, "translateY", 0) * size.height) / PERCENT,
            );
            const scale =
                Math.max(getTrackExtreme(stops, "scaleX", PERCENT), getTrackExtreme(stops, "scaleY", PERCENT)) /
                PERCENT;
            const isTurned = ["rotate", "skewX", "skewY"].some(
                (key) => getTrackExtreme(stops, key as keyof SliceStop, 0) > 0,
            );
            const isTilted = ["rotateX", "rotateY", "translateZ", "depth"].some(
                (key) => getTrackExtreme(stops, key as keyof SliceStop, 0) > 0,
            );
            const grown = (Math.max(scale, 1) - 1) * longest * 0.5 + (isTurned ? (diagonal - longest) * 0.5 : 0);
            const near = isTilted ? getTrackExtreme(stops, "translateZ", 0) + diagonal * Math.max(scale, 1) * 0.5 : 0;
            const viewer = box ? computePerspectivePx(box) : 0;
            const bulge =
                box && near > 0 && near < viewer ? (Math.max(box.width, box.height) * 0.5 * near) / (viewer - near) : 0;

            return Math.max(
                most,
                Math.ceil(
                    travel + grown + bulge + near * (isTilted ? 1 : 0) + BLUR_REACH * getTrackExtreme(stops, "blur", 0),
                ),
            );
        }, 0);
    };

    /**
     * Binds a component's canvas to the shared context.
     *
     * {@link SliceRendererItem.draw} only takes note of the frame and returns the size of the component's picture, in
     * the canvas's pixels, at once. Once per animation frame every component noted since the last is drawn into one
     * shared picture, which is handed over once and cut into each component's piece, so a component's canvas shows its
     * frame one animation frame after it was asked for.
     *
     * A picture still loading draws nothing; the component hears it arrive through {@link requestPicture} and draws
     * again.
     *
     * @param canvas The component's own canvas. It must not be given another context.
     * @returns The item, or `undefined` where the graphics card is not available right now.
     */
    export const createItem = (canvas: HTMLCanvasElement): SliceRendererItem | undefined => {
        const current = getRenderer();
        const resources = current?.resources;
        const output = canvas.getContext("bitmaprenderer");

        if (!current || !resources || !output) return undefined;

        const { gl } = current;
        const program = resources.draw;
        const vao = gl.createVertexArray();
        const instances = gl.createBuffer();
        const tableTexture = gl.createTexture();
        const stride = INSTANCE_FLOATS * BYTES_PER_FLOAT;

        let layoutSlices: SliceRendererSlice[] | undefined;
        let layoutTables: SliceStop[][] | undefined;
        let layoutEasing: Float32Array | undefined;
        let easingRow = 0;

        const isCurrent = () => current.resources === resources;

        const pointInstances = (offset: number) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, instances);
            gl.vertexAttribPointer(1, 4, gl.FLOAT, false, stride, offset);
            gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, offset + 4 * BYTES_PER_FLOAT);
            gl.vertexAttribPointer(3, 1, gl.FLOAT, false, stride, offset + 5 * BYTES_PER_FLOAT);
            gl.vertexAttribPointer(4, 4, gl.FLOAT, false, stride, offset + 6 * BYTES_PER_FLOAT);
            gl.vertexAttribPointer(5, 4, gl.FLOAT, false, stride, offset + 10 * BYTES_PER_FLOAT);
        };

        gl.bindTexture(gl.TEXTURE_2D, tableTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, resources.corners);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        for (const location of [1, 2, 3, 4, 5]) {
            gl.enableVertexAttribArray(location);
            gl.vertexAttribDivisor(location, 1);
        }

        pointInstances(0);
        gl.bindVertexArray(null);

        const key = {};

        let submitted = 0;
        let presented = 0;
        let isDisposed = false;

        const drawLayers = (mixing: SVGColorMixing, count: number) => {
            for (let idx = 0; idx < count; idx++) {
                if (idx === 0) {
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                } else if (mixing === "additive") {
                    gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                } else {
                    gl.blendFuncSeparate(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                }

                pointInstances(idx * stride);
                gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, CORNER_COUNT, 1);
            }

            pointInstances(0);
        };

        const render = (frame: SliceRendererFrame, width: number, height: number) => {
            if (!isCurrent()) return;

            const entry = requestPictureEntry(frame.src, NOTHING_TO_NOTIFY);
            const image = entry.image;

            if (!frame.isShown || !image || frame.slices.length === 0 || frame.size.width <= 0) return;

            checkFrames(frame.src);

            const isSprite = frame.mode !== "slices";

            if (layoutSlices !== frame.slices) {
                gl.bindBuffer(gl.ARRAY_BUFFER, instances);
                gl.bufferData(gl.ARRAY_BUFFER, toInstanceData(frame.slices, frame.mode), gl.DYNAMIC_DRAW);
                layoutSlices = frame.slices;
            }

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, tableTexture);

            if (layoutTables !== frame.tables || layoutEasing !== frame.easing) {
                const tables = toTableData(frame.tables, frame.easing, resources.maxTextureSize);

                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA32F,
                    tables.width,
                    tables.height,
                    0,
                    gl.RGBA,
                    gl.FLOAT,
                    tables.data,
                );
                layoutTables = frame.tables;
                layoutEasing = frame.easing;
                easingRow = tables.easingRow;
            }

            const sliceSize = {
                width: Math.max(1, Math.round(frame.size.width * frame.scale)),
                height: Math.max(1, Math.round(frame.size.height * frame.scale)),
            };
            const texture = isSprite
                ? getTexture(current, resources, frame.src, image, SPRITE_KEY, getSpriteSize(image))
                : getTexture(current, resources, frame.src, image, `${sliceSize.width}x${sliceSize.height}`, sliceSize);
            const sourceScale = isSprite
                ? SPRITE_RESOLUTION / Math.max(frame.slices[0].width, frame.slices[0].height, 1)
                : frame.scale;
            const { uniforms } = program;

            gl.bindVertexArray(vao);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.useProgram(program.program);
            gl.uniform1i(uniforms.u_src, 0);
            gl.uniform1i(uniforms.u_tables, 1);
            gl.uniform1i(uniforms.u_easingRow, easingRow);
            gl.uniform1i(uniforms.u_mode, MODES[frame.mode]);
            gl.uniform1f(uniforms.u_timeline, frame.timeline);
            gl.uniform1f(uniforms.u_half, frame.half);
            gl.uniform1f(uniforms.u_desc, frame.isDescending ? 1 : 0);
            gl.uniform1f(uniforms.u_clock, frame.clockMs ?? 0);
            gl.uniform1f(uniforms.u_lifetime, frame.lifetimeMs ?? 0);
            gl.uniform2f(uniforms.u_size, frame.size.width, frame.size.height);
            gl.uniform4f(uniforms.u_area, frame.area.x, frame.area.y, frame.area.width, frame.area.height);
            gl.uniform1f(
                uniforms.u_perspective,
                frame.hasPerspective ? computePerspectivePx(frame.size) : NO_PERSPECTIVE,
            );
            gl.uniform2f(uniforms.u_viewport, width, height);
            gl.uniform2f(uniforms.u_scale, width / frame.area.width, height / frame.area.height);
            gl.uniform1i(uniforms.u_isSprite, isSprite ? 1 : 0);
            gl.uniform1f(uniforms.u_srcScale, sourceScale);
            gl.uniform1i(
                uniforms.u_channelMode,
                frame.channelMixing ? CHANNEL_MODES[frame.channelMixing] : NO_CHANNELS,
            );

            if (frame.channelMixing) {
                drawLayers(frame.channelMixing, frame.slices.length);
            } else {
                gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, CORNER_COUNT, frame.slices.length);
            }

            gl.bindVertexArray(null);
        };

        const draw = (frame: SliceRendererFrame): Size2d => {
            if (!isCurrent()) return NO_SIZE;

            const width = Math.max(1, Math.round(frame.area.width * frame.scale));
            const height = Math.max(1, Math.round(frame.area.height * frame.scale));
            const sequence = ++submitted;

            submit(key, {
                width,
                height,
                render: () => render(frame, width, height),
                present: (picture) => {
                    if (isDisposed || sequence < presented) {
                        picture.close();

                        return;
                    }

                    presented = sequence;
                    output.transferFromImageBitmap(picture);
                },
            });

            return { width, height };
        };

        const dispose = () => {
            isDisposed = true;
            submissions.delete(key);

            if (!isCurrent()) return;

            gl.deleteVertexArray(vao);
            gl.deleteBuffer(instances);
            gl.deleteTexture(tableTexture);
        };

        return { draw, dispose };
    };
}
