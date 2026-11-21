// Ham JSON biçimi (src/data/*.json)
export interface RawChoice {
  id: string;
  soru: string;
  secenekler: string[];
  dogru: number;
  ipucu: string;
}

export interface RawOrder {
  id: string;
  soru: string;
  kelimeler: string[];
  cevap: string;
  ipucu: string;
}

export type RoomTip =
  | 'kelime'
  | 'kalip'
  | 'siralama'
  | 'karisik'
  | 'test'
  | 'unite_testi'
  | 'final';

export interface RawRoom {
  oda: number;
  tip: RoomTip;
  baslik: string;
  sorular?: (RawChoice | RawOrder)[];
  havuz?: number[];
  unite_havuz?: number[];
  soru_sayisi?: number;
  mod?: string;
}

export interface RawUnit {
  unite: number | string;
  baslik: string;
  odalar: RawRoom[];
}

// Oyunda kullanılan model
export type Question =
  | { kind: 'choice'; id: string; soru: string; secenekler: string[]; dogru: number; ipucu: string }
  | { kind: 'order'; id: string; soru: string; kelimeler: string[]; cevap: string; ipucu: string };

interface RoomBase {
  oda: number;
  unite: string;
  uniteBaslik: string;
  tip: RoomTip;
  baslik: string;
}

export interface LearningRoom extends RoomBase {
  kind: 'learning';
  questions: Question[];
}

export interface TestRoom extends RoomBase {
  kind: 'test';
  count: number;
  pool: number[];
  unitPool: number[];
}

export type Room = LearningRoom | TestRoom;

export interface Progress {
  // oda numarası -> en iyi yıldız sayısı (1-3)
  stars: Record<number, number>;
}
