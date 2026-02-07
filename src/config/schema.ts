export const schema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'AutomotiveBusiness'],
  name: 'MezDepann - Épaviste Agréé',
  description: 'Épaviste agréé en Île-de-France. Enlèvement gratuit d\'épaves et rachat de véhicules jusqu\'à 250€.',
  url: 'https://mezdepann.fr',
  telephone: '+33766463392',
  email: 'contact@mezdepann.fr',
  areaServed: {
    '@type': 'State',
    name: 'Île-de-France',
    containsPlace: [
      { '@type': 'City', name: 'Paris' },
      { '@type': 'City', name: 'Boulogne-Billancourt' },
      { '@type': 'City', name: 'Nanterre' },
      { '@type': 'City', name: 'Versailles' },
      { '@type': 'City', name: 'Créteil' },
      { '@type': 'City', name: 'Argenteuil' },
      { '@type': 'City', name: 'Saint-Denis' },
      { '@type': 'City', name: 'Montreuil' },
    ],
  },
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Île-de-France',
    addressCountry: 'FR',
  },
  priceRange: '€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Bank Transfer',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  serviceType: ['Épaviste', 'Rachat de véhicules', 'Enlèvement d\'épaves'],
  knowsAbout: ['Épaviste', 'Enlèvement épave', 'Rachat véhicule', 'Centre VHU agréé'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services d\'épaviste',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Enlèvement d\'épave gratuit',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Rachat de véhicules',
          description: 'Jusqu\'à 250€ selon l\'état',
        },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
  },
};

