const strings = {
  en: {
    'brand.tagline': 'Real appreciation — no ads, no noise.',
    'home.tabs.trending': 'Trending',
    'home.tabs.following': 'Following',
    'home.tabs.latest': 'Latest',
    'filter.all': 'All',
    'filter.video': 'Videos',
    'filter.article': 'Articles',
    'cta.tip': 'Tip',
    'cta.subscribe': 'Subscribe',
    'cta.supportersOnly': 'Supporters only',
    'cta.follow': 'Follow',
    'cta.following': 'Following',
    'cta.save': 'Save',
    'cta.share': 'Share',
    'cta.more': 'More',
    'tip.title': 'Send a quick tip',
    'tip.keepMore': 'Less platform cut. Creators keep more.',
    'tip.presets': ['$0.5', '$1', '$2'],
    'tip.customLabel': 'Custom',
    'tip.success': 'Thanks for the support!',
    'tip.error': 'Payment failed. Try again.',
    'sub.title': 'Choose your membership',
    'sub.perks': 'Perks',
    'sub.monthly': 'month',
    'sub.success': "You're a supporter now!",
    'sub.error': 'Subscription failed. Try again.',
    'paywall.title': 'Support to unlock',
    'paywall.subtitle': "Join this creator's community to access this post.",
    'player.next': 'Up next',
    'comments.title': 'Comments',
    'comments.placeholder': 'Say something nice…',
    'comments.send': 'Send',
    'wallet.title': 'Wallet',
    'wallet.addMethod': 'Add payment method',
    'wallet.balance': 'Balance',
    'wallet.transactions': 'Transactions',
    'settings.title': 'Settings',
    'search.placeholder': 'Search videos, articles, creators',
    'studio.title': 'Studio',
    'studio.uploadVideo': 'Upload Video',
    'studio.writeArticle': 'Write Article',
    'studio.monetization': 'Monetization',
    'studio.analytics': 'Analytics',
    'post.views': 'views',
    'post.readingTime': 'min read',
    'creator.followers': 'followers',
    'creator.supporters': 'supporters',
  },
};

export type Language = 'en';

let currentLanguage: Language = 'en';

export function t(key: string, lang: Language = currentLanguage): string {
  const value = strings[lang][key as keyof typeof strings.en];
  if (Array.isArray(value)) return value.join(', ');
  return value || key;
}

export function setLanguage(lang: Language) {
  currentLanguage = lang;
}

export function useTranslation() {
  return { t, setLanguage };
}
