// Comprehensive translation database for API-generated content
// This handles dynamic content that comes from the API like strengths, opportunities, recommendations, and actions

export interface APIContentTranslations {
  [key: string]: {
    en: string
    es: string
    fr: string
    de: string
  }
}

export const apiContentTranslations: APIContentTranslations = {
  // Common Strengths
  'Some positive habits established': {
    en: 'Some positive habits established',
    es: 'Algunos hábitos positivos establecidos',
    fr: 'Quelques habitudes positives établies',
    de: 'Einige positive Gewohnheiten etabliert'
  },
  'Room for optimization exists': {
    en: 'Room for optimization exists',
    es: 'Existe espacio para optimización',
    fr: 'Il y a place à l\'optimisation',
    de: 'Raum für Optimierung vorhanden'
  },
  'Baseline competency achieved': {
    en: 'Baseline competency achieved',
    es: 'Competencia básica alcanzada',
    fr: 'Compétence de base atteinte',
    de: 'Grundkompetenz erreicht'
  },
  'Strong foundation in Health & Fitness': {
    en: 'Strong foundation in Health & Fitness',
    es: 'Base sólida en Salud y Ejercicio',
    fr: 'Base solide en Santé et Fitness',
    de: 'Starke Grundlage in Gesundheit & Fitness'
  },
  'Strong foundation in Social Life': {
    en: 'Strong foundation in Social Life',
    es: 'Base sólida en Vida Social',
    fr: 'Base solide en Vie Sociale',
    de: 'Starke Grundlage im sozialen Leben'
  },
  'Strong foundation in Personal Relationships': {
    en: 'Strong foundation in Personal Relationships',
    es: 'Base sólida en Relaciones Personales',
    fr: 'Base solide en Relations Personnelles',
    de: 'Starke Grundlage in persönlichen Beziehungen'
  },
  'Strong foundation in Financial Wellness': {
    en: 'Strong foundation in Financial Wellness',
    es: 'Base sólida en Bienestar Financiero',
    fr: 'Base solide en Bien-être Financier',
    de: 'Starke Grundlage im finanziellen Wohlbefinden'
  },
  'Consistent habits and routines': {
    en: 'Consistent habits and routines',
    es: 'Hábitos y rutinas consistentes',
    fr: 'Habitudes et routines cohérentes',
    de: 'Konsistente Gewohnheiten und Routinen'
  },
  'Above-average performance vs peers': {
    en: 'Above-average performance vs peers',
    es: 'Rendimiento por encima del promedio vs pares',
    fr: 'Performance supérieure à la moyenne vs pairs',
    de: 'Überdurchschnittliche Leistung im Vergleich zu Peers'
  },

  // Common Opportunities
  'Increase consistency in daily practices': {
    en: 'Increase consistency in daily practices',
    es: 'Aumentar consistencia en prácticas diarias',
    fr: 'Augmenter la cohérence dans les pratiques quotidiennes',
    de: 'Konsistenz in täglichen Praktiken erhöhen'
  },
  'Explore advanced strategies': {
    en: 'Explore advanced strategies',
    es: 'Explorar estrategias avanzadas',
    fr: 'Explorer des stratégies avancées',
    de: 'Erweiterte Strategien erkunden'
  },
  'Connect with mentors or experts': {
    en: 'Connect with mentors or experts',
    es: 'Conectar con mentores o expertos',
    fr: 'Se connecter avec des mentors ou experts',
    de: 'Mit Mentoren oder Experten verbinden'
  },
  'Maintain current momentum': {
    en: 'Maintain current momentum',
    es: 'Mantener el impulso actual',
    fr: 'Maintenir l\'élan actuel',
    de: 'Aktuelle Dynamik beibehalten'
  },
  'Share knowledge with others': {
    en: 'Share knowledge with others',
    es: 'Compartir conocimiento con otros',
    fr: 'Partager les connaissances avec d\'autres',
    de: 'Wissen mit anderen teilen'
  },
  'Focus on fine-tuning': {
    en: 'Focus on fine-tuning',
    es: 'Enfocarse en ajustar detalles',
    fr: 'Se concentrer sur l\'ajustement fin',
    de: 'Fokus auf Feinabstimmung'
  },

  // Common Recommendations/Quick Wins
  'Track progress weekly': {
    en: 'Track progress weekly',
    es: 'Rastrea el progreso semanalmente',
    fr: 'Suivre les progrès chaque semaine',
    de: 'Fortschritt wöchentlich verfolgen'
  },
  'Set specific, measurable goals': {
    en: 'Set specific, measurable goals',
    es: 'Establece objetivos específicos y medibles',
    fr: 'Fixer des objectifs spécifiques et mesurables',
    de: 'Spezifische, messbare Ziele setzen'
  },
  'Celebrate small wins regularly': {
    en: 'Celebrate small wins regularly',
    es: 'Celebra pequeñas victorias regularmente',
    fr: 'Célébrer régulièrement les petites victoires',
    de: 'Kleine Erfolge regelmäßig feiern'
  },
  'Review and adjust strategies monthly': {
    en: 'Review and adjust strategies monthly',
    es: 'Revisar y ajustar estrategias mensualmente',
    fr: 'Réviser et ajuster les stratégies mensuellement',
    de: 'Strategien monatlich überprüfen und anpassen'
  },
  'Build accountability partnerships': {
    en: 'Build accountability partnerships',
    es: 'Construir asociaciones de responsabilidad',
    fr: 'Construire des partenariats de responsabilité',
    de: 'Verantwortungspartnerschaften aufbauen'
  },
  'Focus on consistency over perfection': {
    en: 'Focus on consistency over perfection',
    es: 'Enfócate en consistencia sobre perfección',
    fr: 'Se concentrer sur la cohérence plutôt que la perfection',
    de: 'Fokus auf Konsistenz statt Perfektion'
  },

  // Common Action Plan Items
  'Complete daily self-assessment for baseline': {
    en: 'Complete daily self-assessment for baseline',
    es: 'Completar autoevaluación diaria para línea base',
    fr: 'Compléter l\'auto-évaluation quotidienne pour la référence',
    de: 'Tägliche Selbstbewertung für Baseline abschließen'
  },
  'Identify top 3 priorities across all life areas': {
    en: 'Identify top 3 priorities across all life areas',
    es: 'Identificar las 3 prioridades principales en todas las áreas de vida',
    fr: 'Identifier les 3 priorités principales dans tous les domaines de vie',
    de: 'Top 3 Prioritäten in allen Lebensbereichen identifizieren'
  },
  'Set up tracking systems and accountability': {
    en: 'Set up tracking systems and accountability',
    es: 'Configurar sistemas de seguimiento y responsabilidad',
    fr: 'Mettre en place des systèmes de suivi et de responsabilité',
    de: 'Tracking-Systeme und Verantwortlichkeit einrichten'
  },
  'Implement 2 high-impact habits from weakest category': {
    en: 'Implement 2 high-impact habits from weakest category',
    es: 'Implementar 2 hábitos de alto impacto de la categoría más débil',
    fr: 'Mettre en œuvre 2 habitudes à fort impact de la catégorie la plus faible',
    de: '2 wirkungsvolle Gewohnheiten aus der schwächsten Kategorie umsetzen'
  },
  'Schedule weekly review sessions': {
    en: 'Schedule weekly review sessions',
    es: 'Programar sesiones de revisión semanal',
    fr: 'Planifier des sessions de révision hebdomadaires',
    de: 'Wöchentliche Review-Sitzungen planen'
  },
  'Connect with support network or accountability partner': {
    en: 'Connect with support network or accountability partner',
    es: 'Conectar con red de apoyo o compañero de responsabilidad',
    fr: 'Se connecter avec le réseau de soutien ou partenaire de responsabilité',
    de: 'Mit Unterstützungsnetzwerk oder Verantwortungspartner verbinden'
  },
  'Scale successful habits from week 2': {
    en: 'Scale successful habits from week 2',
    es: 'Escalar hábitos exitosos de la semana 2',
    fr: 'Développer les habitudes réussies de la semaine 2',
    de: 'Erfolgreiche Gewohnheiten aus Woche 2 skalieren'
  },
  'Address secondary improvement areas': {
    en: 'Address secondary improvement areas',
    es: 'Abordar áreas de mejora secundarias',
    fr: 'Aborder les domaines d\'amélioration secondaires',
    de: 'Sekundäre Verbesserungsbereiche angehen'
  },
  'Measure and document progress': {
    en: 'Measure and document progress',
    es: 'Medir y documentar el progreso',
    fr: 'Mesurer et documenter les progrès',
    de: 'Fortschritt messen und dokumentieren'
  },
  'Refine routines for sustainability': {
    en: 'Refine routines for sustainability',
    es: 'Refinar rutinas para sostenibilidad',
    fr: 'Affiner les routines pour la durabilité',
    de: 'Routinen für Nachhaltigkeit verfeinern'
  },
  'Plan next 30-day cycle based on results': {
    en: 'Plan next 30-day cycle based on results',
    es: 'Planificar próximo ciclo de 30 días basado en resultados',
    fr: 'Planifier le prochain cycle de 30 jours basé sur les résultats',
    de: 'Nächsten 30-Tage-Zyklus basierend auf Ergebnissen planen'
  },
  'Celebrate achievements and reassess goals': {
    en: 'Celebrate achievements and reassess goals',
    es: 'Celebrar logros y reevaluar objetivos',
    fr: 'Célébrer les réussites et réévaluer les objectifs',
    de: 'Erfolge feiern und Ziele neu bewerten'
  },

  // Week Focus Areas
  'Foundation Building': {
    en: 'Foundation Building',
    es: 'Construcción de Cimientos',
    fr: 'Construction de Fondation',
    de: 'Grundlagenbau'
  },
  'Quick Wins Implementation': {
    en: 'Quick Wins Implementation',
    es: 'Implementación de Victorias Rápidas',
    fr: 'Mise en œuvre de Victoires Rapides',
    de: 'Schnelle Erfolge Umsetzung'
  },
  'Momentum Building': {
    en: 'Momentum Building',
    es: 'Construcción de Impulso',
    fr: 'Construction d\'Élan',
    de: 'Momentum-Aufbau'
  },
  'Integration & Optimization': {
    en: 'Integration & Optimization',
    es: 'Integración y Optimización',
    fr: 'Intégration et Optimisation',
    de: 'Integration & Optimierung'
  },

  // Time Commitments
  '30 min/day': {
    en: '30 min/day',
    es: '30 min/día',
    fr: '30 min/jour',
    de: '30 Min/Tag'
  },
  '45 min/day': {
    en: '45 min/day',
    es: '45 min/día',
    fr: '45 min/jour',
    de: '45 Min/Tag'
  },
  '60 min/day': {
    en: '60 min/day',
    es: '60 min/día',
    fr: '60 min/jour',
    de: '60 Min/Tag'
  }
}

// Helper function to translate API content
export function translateAPIContent(text: string, targetLanguage: string): string {
  const translation = apiContentTranslations[text]
  if (translation && translation[targetLanguage as keyof typeof translation]) {
    return translation[targetLanguage as keyof typeof translation]
  }
  return text // Return original if no translation found
}

// Helper function to translate arrays of content (like strengths, opportunities arrays)
export function translateAPIContentArray(items: string[], targetLanguage: string): string[] {
  return items.map(item => translateAPIContent(item, targetLanguage))
}