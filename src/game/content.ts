import type { RawUnit } from './types';
import unit1 from '../data/unit1.json';
import unit2 from '../data/unit2.json';
import unit3 from '../data/unit3.json';
import unit4 from '../data/unit4.json';
import unit5 from '../data/unit5.json';
import unit6 from '../data/unit6.json';
import unit7 from '../data/unit7.json';
import unit8 from '../data/unit8.json';
import final from '../data/final.json';

// JSON dosyaları oda şemasına uygun; tip daraltması burada yapılır.
export const RAW_UNITS = [unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, final] as unknown as RawUnit[];
