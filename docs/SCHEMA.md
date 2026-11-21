# Escape Room İngilizce - Soru Bankası

Bu klasör 100 odalık oyunun tüm içeriğini içerir. Her ünite ayrı bir JSON dosyasındadır.

## Dosyalar

| Dosya | İçerik | Oda aralığı |
|---|---|---|
| unit1.json | School Life and Education | 1-12 |
| unit2.json | Classroom Life and Learning | 13-24 |
| unit3.json | Personal Life and Well-being | 25-36 |
| unit4.json | Family Life and Home | 37-48 |
| unit5.json | Life in the Neighbourhood, City and Social Life | 49-60 |
| unit6.json | Life in the World and Culture | 61-72 |
| unit7.json | Life in Nature and Global Problems | 73-84 |
| unit8.json | Life in the Universe and the Future | 85-96 |
| final.json | Genel tekrar ve final | 97-100 |

## Her ünitenin oda yapısı (12 oda)

1. Kelime odası (1)
2. Kelime odası (2)
3. Kelime odası (3)
4. Kelime odası (4)
5. Mini test 1 (1-4 odalarından 5 soru)
6. Kalıp odası (present simple, passive vb.)
7. Kalıp odası
8. Kalıp odası
9. Cümle kurma (sıralama)
10. Karışık tekrar
11. Mini test 2 (6-10 odalarından 5 soru)
12. Ünite boss testi (ünitenin tamamından 10 soru)

## Oda türleri (`tip`)

- `kelime`: Kelime anlamı sorusu
- `kalip`: Dilbilgisi boşluk doldurma
- `siralama`: Kelimeleri doğru cümleye dizme
- `karisik`: Karışık çoktan seçmeli
- `test`: Havuzdan rastgele soru seçen mini test
- `unite_testi`: Ünitenin büyük testi
- `final`: Son sınav

## Soru formatı

Çoktan seçmeli:

```json
{
  "id": "u1-o1-s1",
  "soru": "What does 'timetable' mean?",
  "secenekler": ["ders programı", "ödev", "kantin", "sınav"],
  "dogru": 0,
  "ipucu": "Derslerin hangi gün ve saatte olduğunu gösterir."
}
```

- `dogru` doğru seçeneğin sıra numarasıdır (0'dan başlar).

Sıralama:

```json
{
  "id": "u1-o9-s1",
  "soru": "Put the words in order.",
  "kelimeler": ["do", "you", "every", "study", "day", "English"],
  "cevap": "Do you study English every day?",
  "ipucu": "Soru yapısı: Do + özne + fiil."
}
```

## Test odaları

- `havuz`: Sorunun çekileceği oda numaraları
- `soru_sayisi`: Testte gösterilecek soru sayısı
- `unite_havuz` (final.json): Ünite numaralarına göre havuz

## Notlar

- Kelime ve kalıp soruları özgündür, Stepwise kitabındaki metinler kopyalanmamıştır.
- Yeni soru eklemek için ilgili oda içine yeni bir `sorular` öğesi yazmanız yeterlidir. `id` değeri benzersiz olmalıdır.
