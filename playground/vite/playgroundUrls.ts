const STANDALONE_URLS = {
    solid: "http://localhost:8080/",
    react: "http://localhost:8081/",
    vue: "http://localhost:8086/",
    svelte: "http://localhost:8087/",
};

export const definePlaygroundUrls = () => ({
    "import.meta.env.VITE_PLAYGROUND_URLS": process.env.VITE_PLAYGROUND_URLS ?? JSON.stringify(STANDALONE_URLS),
});
