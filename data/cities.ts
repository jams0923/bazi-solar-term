export interface ClimateNormal {
  station: { id: string; name: string; latitude: number; longitude: number };
  period: { start: number; end: number };
  metrics: {
    annualMeanTemperatureC: number;
    annualPrecipitationMm: number;
    annualRelativeHumidityPercent?: number;
  };
  source: { agency: string; url: string; accessedAt: string };
  verification: 'pending' | 'verified';
}
export interface BirthCity {
  id: string;
  name: string;
  country: string;
  zone: string;
  longitude: number;
}
export interface City extends BirthCity {
  heat: number;
  moisture: number;
  status: 'exploratory' | 'verified';
  tagSource: string;
  normal?: ClimateNormal;
}
// Coordinates are city-centre approximations for optional solar time, not weather stations.
// Climate axes are hand-authored exploration tags (-2..2), not observed normals.
export const cities: City[] = [
  {
    id: 'taipei',
    name: '臺北',
    country: '臺灣',
    zone: 'Asia/Taipei',
    longitude: 121.52,
    heat: 2,
    moisture: 2,
  },
  {
    id: 'taichung',
    name: '臺中',
    country: '臺灣',
    zone: 'Asia/Taipei',
    longitude: 120.67,
    heat: 2,
    moisture: 2,
  },
  {
    id: 'kaohsiung',
    name: '高雄',
    country: '臺灣',
    zone: 'Asia/Taipei',
    longitude: 120.3,
    heat: 2,
    moisture: 2,
  },
  {
    id: 'tokyo',
    name: '東京',
    country: '日本',
    zone: 'Asia/Tokyo',
    longitude: 139.69,
    heat: 0,
    moisture: 2,
  },
  {
    id: 'osaka',
    name: '大阪',
    country: '日本',
    zone: 'Asia/Tokyo',
    longitude: 135.5,
    heat: 0,
    moisture: 2,
  },
  {
    id: 'sapporo',
    name: '札幌',
    country: '日本',
    zone: 'Asia/Tokyo',
    longitude: 141.35,
    heat: -2,
    moisture: 0,
  },
  {
    id: 'singapore',
    name: '新加坡',
    country: '新加坡',
    zone: 'Asia/Singapore',
    longitude: 103.85,
    heat: 2,
    moisture: 2,
  },
  {
    id: 'bangkok',
    name: '曼谷',
    country: '泰國',
    zone: 'Asia/Bangkok',
    longitude: 100.5,
    heat: 2,
    moisture: 2,
  },
  {
    id: 'bengaluru',
    name: '班加羅爾',
    country: '印度',
    zone: 'Asia/Kolkata',
    longitude: 77.59,
    heat: 0,
    moisture: 0,
  },
  {
    id: 'dubai',
    name: '杜拜',
    country: '阿聯',
    zone: 'Asia/Dubai',
    longitude: 55.27,
    heat: 2,
    moisture: -2,
  },
  {
    id: 'london',
    name: '倫敦',
    country: '英國',
    zone: 'Europe/London',
    longitude: -0.13,
    heat: 0,
    moisture: 0,
  },
  {
    id: 'berlin',
    name: '柏林',
    country: '德國',
    zone: 'Europe/Berlin',
    longitude: 13.41,
    heat: -2,
    moisture: 0,
  },
  {
    id: 'munich',
    name: '慕尼黑',
    country: '德國',
    zone: 'Europe/Berlin',
    longitude: 11.58,
    heat: -2,
    moisture: 0,
  },
  {
    id: 'amsterdam',
    name: '阿姆斯特丹',
    country: '荷蘭',
    zone: 'Europe/Amsterdam',
    longitude: 4.9,
    heat: 0,
    moisture: 0,
  },
  {
    id: 'paris',
    name: '巴黎',
    country: '法國',
    zone: 'Europe/Paris',
    longitude: 2.35,
    heat: 0,
    moisture: 0,
  },
  {
    id: 'vancouver',
    name: '溫哥華',
    country: '加拿大',
    zone: 'America/Vancouver',
    longitude: -123.12,
    heat: 0,
    moisture: 2,
  },
  {
    id: 'toronto',
    name: '多倫多',
    country: '加拿大',
    zone: 'America/Toronto',
    longitude: -79.38,
    heat: -2,
    moisture: 0,
  },
  {
    id: 'seattle',
    name: '西雅圖',
    country: '美國',
    zone: 'America/Los_Angeles',
    longitude: -122.33,
    heat: 0,
    moisture: 2,
  },
  {
    id: 'san-francisco',
    name: '舊金山',
    country: '美國',
    zone: 'America/Los_Angeles',
    longitude: -122.42,
    heat: 0,
    moisture: 0,
  },
  {
    id: 'austin',
    name: '奧斯汀',
    country: '美國',
    zone: 'America/Chicago',
    longitude: -97.74,
    heat: 2,
    moisture: 0,
  },
  {
    id: 'new-york',
    name: '紐約',
    country: '美國',
    zone: 'America/New_York',
    longitude: -74.01,
    heat: 0,
    moisture: 2,
  },
  {
    id: 'brisbane',
    name: '布里斯本',
    country: '澳洲',
    zone: 'Australia/Brisbane',
    longitude: 153.03,
    heat: 2,
    moisture: 2,
  },
  {
    id: 'sydney',
    name: '雪梨',
    country: '澳洲',
    zone: 'Australia/Sydney',
    longitude: 151.21,
    heat: 0,
    moisture: 0,
  },
  {
    id: 'melbourne',
    name: '墨爾本',
    country: '澳洲',
    zone: 'Australia/Melbourne',
    longitude: 144.96,
    heat: 0,
    moisture: 0,
  },
  {
    id: 'perth',
    name: '伯斯',
    country: '澳洲',
    zone: 'Australia/Perth',
    longitude: 115.86,
    heat: 2,
    moisture: -2,
  },
  {
    id: 'auckland',
    name: '奧克蘭',
    country: '紐西蘭',
    zone: 'Pacific/Auckland',
    longitude: 174.76,
    heat: 0,
    moisture: 2,
  },
  {
    id: 'christchurch',
    name: '基督城',
    country: '紐西蘭',
    zone: 'Pacific/Auckland',
    longitude: 172.64,
    heat: -2,
    moisture: 0,
  },
  {
    id: 'cape-town',
    name: '開普敦',
    country: '南非',
    zone: 'Africa/Johannesburg',
    longitude: 18.42,
    heat: 0,
    moisture: -2,
  },
  {
    id: 'santiago',
    name: '聖地牙哥',
    country: '智利',
    zone: 'America/Santiago',
    longitude: -70.67,
    heat: 0,
    moisture: -2,
  },
  {
    id: 'sao-paulo',
    name: '聖保羅',
    country: '巴西',
    zone: 'America/Sao_Paulo',
    longitude: -46.63,
    heat: 2,
    moisture: 2,
  },
  {
    id: 'apia',
    name: '阿皮亞',
    country: '薩摩亞',
    zone: 'Pacific/Apia',
    longitude: -171.7514,
    heat: 2,
    moisture: 2,
  },
].map((city) => ({
  ...city,
  status: 'exploratory',
  tagSource:
    'Sites 參考版人工探索標籤（2026-10-12）；阿皮亞為新增人工標籤；未以共同期間逐城氣候常值核驗',
}));
// Birth-city choices do not automatically enter the climate comparison catalog.
export const birthCities: BirthCity[] = [
  ...cities,
  { id: 'taoyuan', name: '桃園', country: '臺灣', zone: 'Asia/Taipei', longitude: 121.3 },
  { id: 'hsinchu', name: '新竹', country: '臺灣', zone: 'Asia/Taipei', longitude: 120.97 },
  { id: 'tainan', name: '臺南', country: '臺灣', zone: 'Asia/Taipei', longitude: 120.2 },
  { id: 'hualien', name: '花蓮', country: '臺灣', zone: 'Asia/Taipei', longitude: 121.6 },
  { id: 'hong-kong', name: '香港', country: '香港', zone: 'Asia/Hong_Kong', longitude: 114.17 },
  { id: 'seoul', name: '首爾', country: '韓國', zone: 'Asia/Seoul', longitude: 126.98 },
  {
    id: 'los-angeles',
    name: '洛杉磯',
    country: '美國',
    zone: 'America/Los_Angeles',
    longitude: -118.24,
  },
];
export function getCity(id = 'taipei') {
  const city = birthCities.find((c) => c.id === id);
  if (!city) throw new Error('未收錄的城市，請重新選擇。');
  return city;
}
