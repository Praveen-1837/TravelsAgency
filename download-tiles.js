const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, 'frontend/public/images/hero/tiles');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const names = [
  "kashmir-dal-lake", "kerala-backwaters", "rajasthan-fort", "ladakh",
  "himachal-snow", "goa-beach", "andaman-beach", "meghalaya-root-bridge",
  "uttarakhand-kedarnath", "taj-mahal", "varanasi-ghats", "bali-temple",
  "dubai-skyline", "munnar-tea-hills"
];

const urls = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
  "https://images.unsplash.com/photo-1477587458883-47145ed94245",
  "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
  "https://images.unsplash.com/photo-1593693397690-362cb9666fc2",
  "https://images.unsplash.com/photo-1548013146-72479768bada",
  "https://images.unsplash.com/photo-1598091383021-15ddea10925d",
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
  "https://images.unsplash.com/photo-1506461883276-594a12b11cf3",
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8",
  "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
  "https://images.unsplash.com/photo-1504150558240-0b4fd8946624",
  "https://images.unsplash.com/photo-1621847468516-1ed0d0e2ab46", // taj mahal
  "https://images.unsplash.com/photo-1587595431973-160d0d94add1", // varanasi
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4", // bali
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c", // dubai
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944", // kerala
];

async function download() {
  let downloadedCount = 0;
  for (let i = 0; i < urls.length && downloadedCount < 14; i++) {
    const url = `${urls[i]}?auto=format&fit=crop&w=240&h=240&q=80&fm=webp`;
    await new Promise((resolve) => {
      https.get(url, (res) => {
        if (res.statusCode === 200 && res.headers['content-type'].includes('image')) {
          const file = fs.createWriteStream(path.join(dir, `${names[downloadedCount]}.webp`));
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${names[downloadedCount]}`);
            downloadedCount++;
            resolve();
          });
        } else {
          console.log(`Failed URL: ${urls[i]}`);
          res.resume();
          resolve();
        }
      }).on('error', resolve);
    });
  }
  
  // Fill rest with placeholders if needed
  while (downloadedCount < 14) {
    console.log(`Missing image for ${names[downloadedCount]}, creating placeholder.`);
    // We'll let CSS handle the placeholder if the file is 0 bytes or we'll just skip
    fs.writeFileSync(path.join(dir, `${names[downloadedCount]}.webp`), "");
    downloadedCount++;
  }
}

download();
