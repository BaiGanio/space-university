async function fetchNasaImage(query) {
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
  const res = await fetch(url);
  const data = await res.json();

  const items = data.collection.items;
  if (!items || items.length === 0) return null;

  const first = items[0];
  const imageHref = first.links && first.links[0] ? first.links[0].href : null;
  return imageHref;
}
