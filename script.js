// Fetch live prices from CoinGecko public API
const priceSymbols = {
    XRP: 'ripple',
    XLM: 'stellar',
    SOL: 'solana'
};

async function fetchPrices() {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ripple,stellar,solana&vs_currencies=usd';
    try {
        const res = await fetch(url);
        const data = await res.json();
        const pricesContainer = document.getElementById('prices-container');
        if (!pricesContainer) return;
        pricesContainer.innerHTML = '';
        for (const [symbol, id] of Object.entries(priceSymbols)) {
            const price = data[id]?.usd ? `$${data[id].usd.toLocaleString()}` : 'N/A';
            pricesContainer.innerHTML += `
                <div class="price-card">
                    <div class="price-title">${symbol}</div>
                    <div class="price-value">${price}</div>
                </div>
            `;
        }
    } catch (err) {
        console.error('Error fetching prices:', err);
    }
}

// Fetch news from CryptoPanic API (no API key needed for public RSS)
async function fetchNews() {
    const url = 'https://cryptopanic.com/news/rss/';
    const newsList = document.getElementById('news-list');
    if (!newsList) return;
    try {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const items = xml.querySelectorAll('item');
        let count = 0;
        newsList.innerHTML = '';
        items.forEach(item => {
            if (count >= 10) return;
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            const lower = title.toLowerCase();
            // Only show news for XRP, XLM, or SOL
            if (lower.includes('xrp') || lower.includes('stellar') || lower.includes('xlm') || lower.includes('solana') || lower.includes('sol')) {
                newsList.innerHTML += `<li><a href="${link}" target="_blank">${title}</a></li>`;
                count++;
            }
        });
        if (newsList.innerHTML === '') {
            newsList.innerHTML = '<li>No recent news found for XRP, XLM, or SOL.</li>';
        }
    } catch (err) {
        newsList.innerHTML = '<li>Error fetching news.</li>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPrices();
    fetchNews();
});