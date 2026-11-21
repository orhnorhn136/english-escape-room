# English Escape Room

Ünite bazlı İngilizce escape room oyunu. 100 oda, her ünitenin sonunda boss testi ve genel tekrar odaları içerir. Telefonda tarayıcıdan açılır ve ana ekrana eklenerek uygulama gibi kullanılabilir. İlk yüklemeden sonra internet olmadan da çalışır.

## Çalıştırma

```powershell
npm install
npm run dev
```

## Test ve derleme

```powershell
npm test
npm run build
```

`npm run build` çıktısını `dist` klasörüne yazar. Bu klasör herhangi bir statik barındırmaya (GitHub Pages, Netlify) yüklenebilir.

## Soruları düzenleme

Sorular `src/data/` klasöründeki JSON dosyalarındadır. Her dosya bir üniteye aittir. Şema ve oda yapısı için `docs/SCHEMA.md` dosyasına bakın.

Önemli kurallar:
- Her sorunun `id` değeri benzersiz olmalıdır.
- `dogru` alanı doğru seçeneğin sıra numarasıdır (0'dan başlar).
- Sıralama sorularında `cevap` cümlesi, `kelimeler` listesiyle aynı kelimeleri içermelidir.
- Değişiklikten sonra `npm test` çalıştırın; şema hataları testlerde yakalanır.

## Mimari

- `src/game/` oyun mantığı: oda üretimi, test havuzu, puanlama, ilerleme kaydı. Arayüzden bağımsızdır ve testleri vardır.
- `src/components/` ekranlar: oda haritası ve oda oynanışı.
- `public/sw.js` çevrimdışı önbellek (yalnızca production build'de kayıt olur).
- İlerleme yalnızca tarayıcıda (localStorage) tutulur. Öğrenci hesabı ve kişisel veri yoktur.
