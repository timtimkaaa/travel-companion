export async function fetchWikipediaExtract(wikipediaTag) {
    if (!wikipediaTag) return null;

    // Format: "pl:Article_Name"
    const [lang, title] = wikipediaTag.split(':');

    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();

    return {
        title: data.title,
        extract: data.extract,
        image: data.thumbnail?.source
    };
}
