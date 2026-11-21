# Karanlık Bölümler: İçerik Rehberi

120 bölüm, altı seviye: A1 (1–20), A2 (21–40), B1 (41–60), B2 (61–80), C1 (81–100), C2 (101–120).
Dosyalar: `src/data/chapters.json` (A1–A2), `src/data/chapters-b.json` (B1–B2), `src/data/chapters-c.json` (C1–C2).

## Bölüm yapısı

```json
{
  "bolum": 41,
  "seviye": "B1",
  "baslik": "Yeni Tarif",
  "sahne": "mutfak",
  "notlar": [
    {"slot": "tablo", "metin": "The cake was baked by Ayse yesterday."},
    {"slot": "kitap", "metin": "If I had more time, I would learn Japanese."},
    {"slot": "cekmece", "metin": "She said that she had finished the report."}
  ],
  "kilitler": [
    {"tip": "kod", "soru": "Who baked the cake?", "cevap": "ayse", "ipuclari": ["Read the first note.", "It is a Turkish girl's name."]}
  ]
}
```

- `sahne`: `koridor`, `oda`, `kutuphane`, `bodrum`, `mutfak`, `cati`
- `notlar`: Oyuncu eşyaya dokunup notu bulur. Slot: `tablo`, `kitap`, `ayna`, `cekmece` (bir bölümde her slot en fazla bir kez).
- `kilitler`: Sırayla açılan kilitler. Tüm kilitler bitince kapı açılır.
  - `tip: "kod"`: Oyuncu cevabı yazar. Büyük/küçük harf ve boşluk önemli değildir.
  - `tip: "secim"`: Oyuncu seçeneklerden birini seçer. `secenekler` ve `dogru` (0'dan başlar) gerekir.
- `ipuclari`: Seviyeye göre sayı zorunludur:

| Seviye | Kilit başına ipucu |
|---|---|
| A1 | 3 |
| A2 | 2 |
| B1 | 2 |
| B2 | 1 |
| C1 | 1 |
| C2 | 0 (dizi boş olmalı) |

Değişiklikten sonra `npm test` çalıştırın; ipucu sayısı, slot ve seçenek hataları testlerde yakalanır.

## Kelime odaları için ek sorular

`src/data/extra.json` dosyasındaki sorular, ilgili ünitenin test odalarına eklenir. Her soru `unite` alanıyla (`"1"`–`"8"`) bağlanır. Bir test son 20 soru içinde çıkan soruları mümkünse tekrar etmez.
