const siteUrl = (process.env.SITE_URL || "https://malekfouda.com").replace(/\/$/, "");
const key = process.env.INDEXNOW_KEY || "2f72e46d7f9a4e7eb9d54bd3d6db8921";

const sitemapResponse = await fetch(`${siteUrl}/sitemap.xml`);
if (!sitemapResponse.ok) {
  throw new Error(`Could not fetch ${siteUrl}/sitemap.xml (${sitemapResponse.status})`);
}

const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
if (!urlList.length) throw new Error("The sitemap did not contain any URLs");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(siteUrl).host,
    key,
    keyLocation: `${siteUrl}/${key}.txt`,
    urlList,
  }),
});

if (!response.ok && response.status !== 202) {
  throw new Error(`IndexNow returned ${response.status}: ${(await response.text()).slice(0, 500)}`);
}

console.log(`Submitted ${urlList.length} URLs to IndexNow (${response.status}).`);
