export type CountryCode = 'IT' | 'FR' | 'ES' | 'DE' | 'NL';

export interface GeoCity {
  id: string;
  nameZh: string;
  nameLocal: string;
  countryCode: CountryCode;
  countryName: string;
  lat: number;
  lng: number;
  chinesePopulationEst: string;
}

export type CategoryKey =
  | 'all'
  | 'housing'
  | 'jobs'
  | 'businesses'
  | 'transfers'
  | 'marketplace'
  | 'services'
  | 'government'
  | 'document_ai'
  | 'translator'
  | 'map'
  | 'forum'
  | 'coo_admin'
  | 'architecture';

export interface ListingItem {
  id: string;
  category: 'housing' | 'jobs' | 'marketplace' | 'transfers' | 'services';
  subCategory: string;
  title: string;
  summary: string;
  description: string;
  price: number;
  currency: string;
  period?: 'month' | 'once' | 'year';
  cityId: string;
  cityName: string;
  countryCode: CountryCode;
  address: string;
  lat: number;
  lng: number;
  contact: {
    name: string;
    phone: string;
    whatsapp?: string;
    wechat?: string;
    speaksChinese: boolean;
  };
  tags: string[];
  images: string[];
  badge?: string;
  trustScore: number; // 0-100
  isVerified: boolean;
  publishedDaysAgo: number;
  expiresInDays: number;
  meta: Record<string, any>;
}

export interface BusinessItem {
  id: string;
  nameZh: string;
  nameLocal: string;
  category: string;
  subCategory: string;
  cityId: string;
  cityName: string;
  countryCode: CountryCode;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp?: string;
  wechat?: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isClaimed: boolean;
  openingHours: string;
  services: string[];
  aiAssistantKnowledge: string;
  coverImage: string;
  featuredOffer?: string;
}

export interface ForumThreadItem {
  id: string;
  title: string;
  author: string;
  authorBadge: string;
  cityId: string;
  cityName: string;
  countryCode: CountryCode;
  category: 'residence' | 'tax' | 'living' | 'law' | 'study';
  replyCount: number;
  viewCount: number;
  createdAt: string;
  content: string;
  aiSummary: {
    overview: string;
    mainPoints: string[];
    officialPolicyNotice: string;
    communityConsensus: string;
    isPotentiallyOutdated: boolean;
  };
}

export interface GovProcedureItem {
  id: string;
  title: string;
  targetGroup: string;
  countryCode: CountryCode;
  countryName: string;
  category: 'residence' | 'tax' | 'health' | 'driving';
  officialSource: string;
  officialSourceUrl: string;
  steps: {
    step: number;
    title: string;
    description: string;
    requiredDocs: string[];
    fees?: string;
  }[];
  tips: string[];
  risks: string[];
}
