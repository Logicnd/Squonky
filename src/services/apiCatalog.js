const SOURCES = [
    {
        name: "quote",
        url: "https://api.quotable.io/random",
        transform: data => ({ text: data?.content, author: data?.author })
    },
    {
        name: "joke",
        url: "https://official-joke-api.appspot.com/jokes/random",
        transform: data => ({ text: data?.setup, extra: data?.punchline })
    },
    {
        name: "catfact",
        url: "https://catfact.ninja/fact",
        transform: data => ({ text: data?.fact })
    }
];

function getApiSource(name) {
    return SOURCES.find(source => source.name === name);
}

module.exports = {
    getApiSource
};
