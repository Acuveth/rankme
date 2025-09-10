// Question translations for the assessment
// This file contains translations for all assessment questions, options, and descriptions

export interface QuestionTranslations {
  [questionId: string]: {
    en: {
      label: string
      options?: string[]
      description?: string
    }
    es: {
      label: string
      options?: string[]
      description?: string
    }
    fr: {
      label: string
      options?: string[]
      description?: string
    }
    de: {
      label: string
      options?: string[]
      description?: string
    }
  }
}

export const questionTranslations: QuestionTranslations = {
  // Financial Questions
  fin_net_worth: {
    en: {
      label: "What is your current net worth (assets - liabilities)?",
      options: [
        "Significant debt (negative net worth)",
        "Minimal assets, some debt (near zero)",
        "Building wealth (positive, growing)",
        "Comfortable reserves (several years expenses)",
        "Financially independent (could live off assets)",
        "Wealthy (more than needed for lifetime)"
      ],
      description: "Consider all your assets (savings, investments, property) minus all debts (loans, credit cards, mortgages)."
    },
    es: {
      label: "¿Cuál es tu patrimonio neto actual (activos - pasivos)?",
      options: [
        "Deuda significativa (patrimonio neto negativo)",
        "Activos mínimos, algo de deuda (cerca de cero)",
        "Construyendo riqueza (positivo, creciendo)",
        "Reservas cómodas (gastos de varios años)",
        "Financieramente independiente (podría vivir de activos)",
        "Rico (más de lo necesario para toda la vida)"
      ],
      description: "Considera todos tus activos (ahorros, inversiones, propiedades) menos todas tus deudas (préstamos, tarjetas de crédito, hipotecas)."
    },
    fr: {
      label: "Quelle est votre valeur nette actuelle (actifs - passifs)?",
      options: [
        "Dette importante (valeur nette négative)",
        "Actifs minimaux, quelques dettes (près de zéro)",
        "Construction de richesse (positive, croissante)",
        "Réserves confortables (plusieurs années d'expenses)",
        "Financièrement indépendant (pourrait vivre d'actifs)",
        "Riche (plus que nécessaire pour la vie)"
      ],
      description: "Considérez tous vos actifs (épargne, investissements, propriété) moins toutes vos dettes (prêts, cartes de crédit, hypothèques)."
    },
    de: {
      label: "Wie hoch ist Ihr aktuelles Nettovermögen (Vermögen - Verbindlichkeiten)?",
      options: [
        "Erhebliche Schulden (negatives Nettovermögen)",
        "Minimale Vermögenswerte, einige Schulden (nahe null)",
        "Vermögensaufbau (positiv, wachsend)",
        "Komfortable Rücklagen (mehrjährige Ausgaben)",
        "Finanziell unabhängig (könnte von Vermögen leben)",
        "Wohlhabend (mehr als für das Leben benötigt)"
      ],
      description: "Berücksichtigen Sie alle Ihre Vermögenswerte (Ersparnisse, Investitionen, Eigentum) abzüglich aller Schulden (Darlehen, Kreditkarten, Hypotheken)."
    }
  },

  fin_income_avg3y: {
    en: {
      label: "What is your average annual income over the last 3 years?",
      options: [
        "Bottom 20% for my region",
        "Below median for my region",
        "Around median for my region",
        "Above median for my region",
        "Top 20% for my region",
        "Top 5% for my region"
      ],
      description: "Compare your income to others in your geographic region and age group. Median household income varies significantly by location."
    },
    es: {
      label: "¿Cuál es tu ingreso anual promedio durante los últimos 3 años?",
      options: [
        "20% inferior para mi región",
        "Por debajo de la mediana para mi región",
        "Alrededor de la mediana para mi región",
        "Por encima de la mediana para mi región",
        "20% superior para mi región",
        "5% superior para mi región"
      ],
      description: "Compara tus ingresos con otros en tu región geográfica y grupo de edad. El ingreso familiar mediano varía significativamente por ubicación."
    },
    fr: {
      label: "Quel est votre revenu annuel moyen au cours des 3 dernières années?",
      options: [
        "20% inférieurs pour ma région",
        "En dessous de la médiane pour ma région",
        "Autour de la médiane pour ma région",
        "Au-dessus de la médiane pour ma région",
        "20% supérieurs pour ma région",
        "5% supérieurs pour ma région"
      ],
      description: "Comparez vos revenus à ceux d'autres personnes dans votre région géographique et votre groupe d'âge. Le revenu médian des ménages varie considérablement selon l'emplacement."
    },
    de: {
      label: "Wie hoch ist Ihr durchschnittliches Jahreseinkommen der letzten 3 Jahre?",
      options: [
        "Untere 20% für meine Region",
        "Unter dem Median für meine Region",
        "Um den Median für meine Region",
        "Über dem Median für meine Region",
        "Obere 20% für meine Region",
        "Obere 5% für meine Region"
      ],
      description: "Vergleichen Sie Ihr Einkommen mit anderen in Ihrer geografischen Region und Altersgruppe. Das mittlere Haushaltseinkommen variiert erheblich je nach Standort."
    }
  },

  fin_income_trend: {
    en: {
      label: "Compared to 12 months ago, your income has...",
      options: [
        "Decreased >20%",
        "Decreased 10-20%",
        "Stayed about the same",
        "Increased 10-20%",
        "Increased >20%"
      ]
    },
    es: {
      label: "Comparado con hace 12 meses, tus ingresos han...",
      options: [
        "Disminuido >20%",
        "Disminuido 10-20%",
        "Se han mantenido igual",
        "Aumentado 10-20%",
        "Aumentado >20%"
      ]
    },
    fr: {
      label: "Par rapport à il y a 12 mois, vos revenus ont...",
      options: [
        "Diminué >20%",
        "Diminué 10-20%",
        "Resté à peu près les mêmes",
        "Augmenté 10-20%",
        "Augmenté >20%"
      ]
    },
    de: {
      label: "Verglichen mit vor 12 Monaten hat sich Ihr Einkommen...",
      options: [
        "Um >20% verringert",
        "Um 10-20% verringert",
        "Etwa gleich geblieben",
        "Um 10-20% erhöht",
        "Um >20% erhöht"
      ]
    }
  },

  fin_savings_rate: {
    en: {
      label: "What % of your net income did you save or invest in the last 12 months?",
      options: [
        "0% (spent everything)",
        "1-10%",
        "11-20%",
        "21-30%",
        "31-50%",
        "More than 50%"
      ]
    },
    es: {
      label: "¿Qué % de tu ingreso neto ahorraste o invertiste en los últimos 12 meses?",
      options: [
        "0% (gasté todo)",
        "1-10%",
        "11-20%",
        "21-30%",
        "31-50%",
        "Más del 50%"
      ]
    },
    fr: {
      label: "Quel % de votre revenu net avez-vous économisé ou investi au cours des 12 derniers mois?",
      options: [
        "0% (tout dépensé)",
        "1-10%",
        "11-20%",
        "21-30%",
        "31-50%",
        "Plus de 50%"
      ]
    },
    de: {
      label: "Welchen % Ihres Nettoeinkommens haben Sie in den letzten 12 Monaten gespart oder investiert?",
      options: [
        "0% (alles ausgegeben)",
        "1-10%",
        "11-20%",
        "21-30%",
        "31-50%",
        "Mehr als 50%"
      ]
    }
  },

  fin_emergency_fund: {
    en: {
      label: "Your emergency fund covers roughly...",
      options: [
        "<1 month",
        "1-3 months",
        "3-6 months",
        "6-12 months",
        ">12 months"
      ]
    },
    es: {
      label: "Tu fondo de emergencia cubre aproximadamente...",
      options: [
        "<1 mes",
        "1-3 meses",
        "3-6 meses",
        "6-12 meses",
        ">12 meses"
      ]
    },
    fr: {
      label: "Votre fonds d'urgence couvre environ...",
      options: [
        "<1 mois",
        "1-3 mois",
        "3-6 mois",
        "6-12 mois",
        ">12 mois"
      ]
    },
    de: {
      label: "Ihr Notfallfonds deckt ungefähr ab...",
      options: [
        "<1 Monat",
        "1-3 Monate",
        "3-6 Monate",
        "6-12 Monate",
        ">12 Monate"
      ]
    }
  },

  fin_debt_payments: {
    en: {
      label: "What percentage of your monthly income goes to debt payments?",
      options: [
        "0% (debt-free)",
        "1-10% (minimal debt)",
        "11-20% (moderate debt)",
        "21-35% (significant debt)",
        "36-50% (high debt burden)",
        "Over 50% (overwhelming debt)"
      ],
      description: "Include all debt payments: credit cards, loans, mortgages, student loans, etc. as a percentage of gross monthly income."
    },
    es: {
      label: "¿Qué porcentaje de tu ingreso mensual va a pagos de deuda?",
      options: [
        "0% (libre de deudas)",
        "1-10% (deuda mínima)",
        "11-20% (deuda moderada)",
        "21-35% (deuda significativa)",
        "36-50% (alta carga de deuda)",
        "Más del 50% (deuda abrumadora)"
      ],
      description: "Incluye todos los pagos de deuda: tarjetas de crédito, préstamos, hipotecas, préstamos estudiantiles, etc. como porcentaje del ingreso bruto mensual."
    },
    fr: {
      label: "Quel pourcentage de votre revenu mensuel va aux paiements de dettes?",
      options: [
        "0% (sans dette)",
        "1-10% (dette minimale)",
        "11-20% (dette modérée)",
        "21-35% (dette importante)",
        "36-50% (charge de dette élevée)",
        "Plus de 50% (dette accablante)"
      ],
      description: "Incluez tous les paiements de dettes : cartes de crédit, prêts, hypothèques, prêts étudiants, etc. en pourcentage du revenu brut mensuel."
    },
    de: {
      label: "Welcher Prozentsatz Ihres monatlichen Einkommens geht für Schuldenzahlungen drauf?",
      options: [
        "0% (schuldenfrei)",
        "1-10% (minimale Schulden)",
        "11-20% (moderate Schulden)",
        "21-35% (erhebliche Schulden)",
        "36-50% (hohe Schuldenlast)",
        "Über 50% (erdrückende Schulden)"
      ],
      description: "Schließen Sie alle Schuldenzahlungen ein: Kreditkarten, Darlehen, Hypotheken, Studiendarlehen usw. als Prozentsatz des monatlichen Bruttoeinkommens."
    }
  },

  fin_high_interest_debt: {
    en: {
      label: "Did you carry high-interest debt (e.g., credit card) in the last 3 months?",
      options: [
        "No",
        "Yes, <$1k",
        "Yes, $1-5k",
        "Yes, >$5k"
      ]
    },
    es: {
      label: "¿Has tenido deuda de alto interés (ej. tarjeta de crédito) en los últimos 3 meses?",
      options: [
        "No",
        "Sí, <$1k",
        "Sí, $1-5k",
        "Sí, >$5k"
      ]
    },
    fr: {
      label: "Avez-vous porté des dettes à taux d'intérêt élevé (ex. carte de crédit) au cours des 3 derniers mois?",
      options: [
        "Non",
        "Oui, <$1k",
        "Oui, $1-5k",
        "Oui, >$5k"
      ]
    },
    de: {
      label: "Hatten Sie in den letzten 3 Monaten hochverzinsliche Schulden (z.B. Kreditkarte)?",
      options: [
        "Nein",
        "Ja, <$1k",
        "Ja, $1-5k",
        "Ja, >$5k"
      ]
    }
  },

  fin_retirement_savings: {
    en: {
      label: "What percentage of your income do you save for retirement?",
      options: [
        "0% (no retirement savings)",
        "1-5% (minimal savings)",
        "6-10% (basic savings)",
        "11-15% (good savings rate)",
        "16-20% (excellent savings)",
        "Over 20% (exceptional savings)"
      ],
      description: "Include employer contributions, personal retirement accounts, and pension contributions."
    },
    es: {
      label: "¿Qué porcentaje de tus ingresos ahorras para la jubilación?",
      options: [
        "0% (sin ahorros para jubilación)",
        "1-5% (ahorros mínimos)",
        "6-10% (ahorros básicos)",
        "11-15% (buena tasa de ahorro)",
        "16-20% (ahorros excelentes)",
        "Más del 20% (ahorros excepcionales)"
      ],
      description: "Incluye contribuciones del empleador, cuentas de jubilación personales y contribuciones de pensión."
    },
    fr: {
      label: "Quel pourcentage de vos revenus épargnez-vous pour la retraite?",
      options: [
        "0% (aucune épargne retraite)",
        "1-5% (épargne minimale)",
        "6-10% (épargne de base)",
        "11-15% (bon taux d'épargne)",
        "16-20% (excellente épargne)",
        "Plus de 20% (épargne exceptionnelle)"
      ],
      description: "Incluez les contributions de l'employeur, les comptes de retraite personnels et les contributions de pension."
    },
    de: {
      label: "Welchen Prozentsatz Ihres Einkommens sparen Sie für die Rente?",
      options: [
        "0% (keine Rentenersparnisse)",
        "1-5% (minimale Ersparnisse)",
        "6-10% (grundlegende Ersparnisse)",
        "11-15% (gute Sparquote)",
        "16-20% (ausgezeichnete Ersparnisse)",
        "Über 20% (außergewöhnliche Ersparnisse)"
      ],
      description: "Schließen Sie Arbeitgeberbeiträge, persönliche Rentenkonten und Rentenbeiträge ein."
    }
  },

  fin_investment_portfolio: {
    en: {
      label: "How would you describe your investment portfolio?",
      options: [
        "No investments",
        "Just getting started (small emergency fund)",
        "Building wealth (several months expenses invested)",
        "Good progress (1-2 years expenses invested)",
        "Strong portfolio (multiple years expenses invested)",
        "Investment-focused (significant wealth in investments)"
      ],
      description: "Consider all investments: retirement accounts, stocks, bonds, mutual funds, ETFs, real estate investments, etc."
    },
    es: {
      label: "¿Cómo describirías tu cartera de inversiones?",
      options: [
        "Sin inversiones",
        "Recién comenzando (pequeño fondo de emergencia)",
        "Construyendo riqueza (gastos de varios meses invertidos)",
        "Buen progreso (gastos de 1-2 años invertidos)",
        "Cartera sólida (gastos de múltiples años invertidos)",
        "Enfoque en inversiones (riqueza significativa en inversiones)"
      ],
      description: "Considera todas las inversiones: cuentas de jubilación, acciones, bonos, fondos mutuos, ETFs, inversiones inmobiliarias, etc."
    },
    fr: {
      label: "Comment décririez-vous votre portefeuille d'investissement?",
      options: [
        "Aucun investissement",
        "Juste commencé (petit fonds d'urgence)",
        "Construction de richesse (plusieurs mois de dépenses investies)",
        "Bon progrès (1-2 ans de dépenses investies)",
        "Portefeuille solide (plusieurs années de dépenses investies)",
        "Axé sur l'investissement (richesse importante en investissements)"
      ],
      description: "Considérez tous les investissements : comptes de retraite, actions, obligations, fonds communs, ETF, investissements immobiliers, etc."
    },
    de: {
      label: "Wie würden Sie Ihr Anlageportfolio beschreiben?",
      options: [
        "Keine Investitionen",
        "Gerade angefangen (kleiner Notfallfonds)",
        "Vermögensaufbau (mehrere Monate Ausgaben investiert)",
        "Guter Fortschritt (1-2 Jahre Ausgaben investiert)",
        "Starkes Portfolio (mehrjährige Ausgaben investiert)",
        "Investitionsorientiert (erhebliches Vermögen in Investitionen)"
      ],
      description: "Berücksichtigen Sie alle Investitionen: Rentenkonten, Aktien, Anleihen, Investmentfonds, ETFs, Immobilieninvestitionen usw."
    }
  },

  // Health & Fitness Questions
  health_bmi_range: {
    en: {
      label: "What best describes your current physical health status?",
      options: [
        "Significantly underweight (BMI <18.5)",
        "Healthy weight range (BMI 18.5-24.9)",
        "Slightly overweight (BMI 25-29.9)",
        "Moderately overweight (BMI 30-34.9)",
        "Significantly overweight (BMI 35+)"
      ],
      description: "This assessment is based on your overall health status rather than specific measurements. Choose the option that best reflects your current physical condition."
    },
    es: {
      label: "¿Qué describe mejor tu estado de salud física actual?",
      options: [
        "Significativamente bajo peso (IMC <18.5)",
        "Rango de peso saludable (IMC 18.5-24.9)",
        "Ligeramente sobrepeso (IMC 25-29.9)",
        "Moderadamente sobrepeso (IMC 30-34.9)",
        "Significativamente sobrepeso (IMC 35+)"
      ],
      description: "Esta evaluación se basa en tu estado general de salud en lugar de medidas específicas. Elige la opción que mejor refleje tu condición física actual."
    },
    fr: {
      label: "Qu'est-ce qui décrit le mieux votre état de santé physique actuel?",
      options: [
        "Considérablement en sous-poids (IMC <18.5)",
        "Plage de poids santé (IMC 18.5-24.9)",
        "Légèrement en surpoids (IMC 25-29.9)",
        "Modérément en surpoids (IMC 30-34.9)",
        "Considérablement en surpoids (IMC 35+)"
      ],
      description: "Cette évaluation est basée sur votre état de santé général plutôt que sur des mesures spécifiques. Choisissez l'option qui reflète le mieux votre condition physique actuelle."
    },
    de: {
      label: "Was beschreibt Ihren aktuellen körperlichen Gesundheitszustand am besten?",
      options: [
        "Erhebliches Untergewicht (BMI <18.5)",
        "Gesunder Gewichtsbereich (BMI 18.5-24.9)",
        "Leichtes Übergewicht (BMI 25-29.9)",
        "Mäßiges Übergewicht (BMI 30-34.9)",
        "Erhebliches Übergewicht (BMI 35+)"
      ],
      description: "Diese Bewertung basiert auf Ihrem allgemeinen Gesundheitszustand und nicht auf spezifischen Messungen. Wählen Sie die Option, die Ihre aktuelle körperliche Verfassung am besten widerspiegelt."
    }
  },

  health_exercise_freq: {
    en: {
      label: "Exercise frequency: days/week with ≥20 min moderate/vigorous activity",
      options: [
        "0",
        "1-2",
        "3-4",
        "5-6",
        "7"
      ]
    },
    es: {
      label: "Frecuencia de ejercicio: días/semana con ≥20 min de actividad moderada/vigorosa",
      options: [
        "0",
        "1-2",
        "3-4",
        "5-6",
        "7"
      ]
    },
    fr: {
      label: "Fréquence d'exercice : jours/semaine avec ≥20 min d'activité modérée/vigoureuse",
      options: [
        "0",
        "1-2",
        "3-4",
        "5-6",
        "7"
      ]
    },
    de: {
      label: "Trainingsfrequenz: Tage/Woche mit ≥20 Min mäßiger/intensiver Aktivität",
      options: [
        "0",
        "1-2",
        "3-4",
        "5-6",
        "7"
      ]
    }
  },

  health_sleep: {
    en: {
      label: "Sleep: average hours/night",
      options: [
        "<5",
        "5-6",
        "6-7",
        "7-8",
        ">8"
      ]
    },
    es: {
      label: "Sueño: horas promedio/noche",
      options: [
        "<5",
        "5-6",
        "6-7",
        "7-8",
        ">8"
      ]
    },
    fr: {
      label: "Sommeil : heures moyennes/nuit",
      options: [
        "<5",
        "5-6",
        "6-7",
        "7-8",
        ">8"
      ]
    },
    de: {
      label: "Schlaf: durchschnittliche Stunden/Nacht",
      options: [
        "<5",
        "5-6",
        "6-7",
        "7-8",
        ">8"
      ]
    }
  },

  health_nutrition: {
    en: {
      label: "How would you rate your nutrition habits?",
      options: [
        "Very poor (mostly fast food/processed)",
        "Poor (some home cooking)",
        "Average (balanced most days)",
        "Good (consistent healthy meals)",
        "Excellent (optimized nutrition)"
      ]
    },
    es: {
      label: "¿Cómo calificarías tus hábitos nutricionales?",
      options: [
        "Muy malos (principalmente comida rápida/procesada)",
        "Malos (algo de cocina casera)",
        "Promedio (balanceado la mayoría de días)",
        "Buenos (comidas saludables consistentes)",
        "Excelentes (nutrición optimizada)"
      ]
    },
    fr: {
      label: "Comment évalueriez-vous vos habitudes nutritionnelles?",
      options: [
        "Très mauvaises (principalement restauration rapide/transformés)",
        "Mauvaises (quelques repas maisons)",
        "Moyennes (équilibrées la plupart des jours)",
        "Bonnes (repas sains cohérents)",
        "Excellentes (nutrition optimisée)"
      ]
    },
    de: {
      label: "Wie würden Sie Ihre Ernährungsgewohnheiten bewerten?",
      options: [
        "Sehr schlecht (hauptsächlich Fast Food/verarbeitet)",
        "Schlecht (etwas Hausmannskost)",
        "Durchschnittlich (an den meisten Tagen ausgewogen)",
        "Gut (konsistent gesunde Mahlzeiten)",
        "Ausgezeichnet (optimierte Ernährung)"
      ]
    }
  },

  fin_real_estate: {
    en: {
      label: "Real estate ownership",
      options: [
        "None",
        "Primary residence",
        "Rental(s)",
        "Both"
      ]
    },
    es: {
      label: "Propiedad inmobiliaria",
      options: [
        "Ninguna",
        "Residencia principal",
        "Alquiler(es)",
        "Ambos"
      ]
    },
    fr: {
      label: "Propriété immobilière",
      options: [
        "Aucune",
        "Résidence principale",
        "Location(s)",
        "Les deux"
      ]
    },
    de: {
      label: "Immobilienbesitz",
      options: [
        "Keine",
        "Hauptwohnsitz",
        "Mietimmobilie(n)",
        "Beides"
      ]
    }
  },

  fin_financial_stress: {
    en: {
      label: "Financial stress level in the past month",
      options: [
        "Extremely stressed",
        "Very stressed",
        "Moderately stressed",
        "Slightly stressed",
        "Not stressed at all"
      ]
    },
    es: {
      label: "Nivel de estrés financiero en el mes pasado",
      options: [
        "Extremadamente estresado",
        "Muy estresado",
        "Moderadamente estresado",
        "Ligeramente estresado",
        "Nada estresado"
      ]
    },
    fr: {
      label: "Niveau de stress financier au cours du mois passé",
      options: [
        "Extrêmement stressé",
        "Très stressé",
        "Modérément stressé",
        "Légèrement stressé",
        "Pas du tout stressé"
      ]
    },
    de: {
      label: "Finanzieller Stresslevel im vergangenen Monat",
      options: [
        "Extrem gestresst",
        "Sehr gestresst",
        "Mäßig gestresst",
        "Leicht gestresst",
        "Überhaupt nicht gestresst"
      ]
    }
  },

  fin_insurance_coverage: {
    en: {
      label: "Insurance coverage you currently have",
      options: [
        "None",
        "Health only",
        "Health + Auto",
        "Health + Auto + Life",
        "Comprehensive (Health/Auto/Life/Disability)"
      ]
    },
    es: {
      label: "Cobertura de seguro que tienes actualmente",
      options: [
        "Ninguna",
        "Solo salud",
        "Salud + Auto",
        "Salud + Auto + Vida",
        "Integral (Salud/Auto/Vida/Discapacidad)"
      ]
    },
    fr: {
      label: "Couverture d'assurance que vous avez actuellement",
      options: [
        "Aucune",
        "Santé seulement",
        "Santé + Auto",
        "Santé + Auto + Vie",
        "Complète (Santé/Auto/Vie/Invalidité)"
      ]
    },
    de: {
      label: "Versicherungsschutz, den Sie derzeit haben",
      options: [
        "Keinen",
        "Nur Krankenversicherung",
        "Kranken- + Autoversicherung",
        "Kranken- + Auto- + Lebensversicherung",
        "Umfassend (Kranken/Auto/Leben/Berufsunfähigkeit)"
      ]
    }
  },

  health_body_composition: {
    en: {
      label: "How would you describe your body composition and fitness level?",
      options: [
        "Low muscle mass, high body fat",
        "Average muscle mass, moderate body fat",
        "Good muscle tone, healthy body fat",
        "Athletic build, low body fat",
        "Very muscular, very low body fat"
      ]
    },
    es: {
      label: "¿Cómo describirías tu composición corporal y nivel de forma física?",
      options: [
        "Poca masa muscular, grasa corporal alta",
        "Masa muscular promedio, grasa corporal moderada",
        "Buen tono muscular, grasa corporal saludable",
        "Constitución atlética, grasa corporal baja",
        "Muy musculoso, grasa corporal muy baja"
      ]
    },
    fr: {
      label: "Comment décririez-vous votre composition corporelle et votre niveau de forme physique?",
      options: [
        "Faible masse musculaire, graisse corporelle élevée",
        "Masse musculaire moyenne, graisse corporelle modérée",
        "Bon tonus musculaire, graisse corporelle saine",
        "Constitution athlétique, faible graisse corporelle",
        "Très musclé, très faible graisse corporelle"
      ]
    },
    de: {
      label: "Wie würden Sie Ihre Körperzusammensetzung und Ihr Fitnessniveau beschreiben?",
      options: [
        "Geringe Muskelmasse, hoher Körperfettanteil",
        "Durchschnittliche Muskelmasse, moderater Körperfettanteil",
        "Gute Muskelspannung, gesunder Körperfettanteil",
        "Athletischer Körperbau, niedriger Körperfettanteil",
        "Sehr muskulös, sehr niedriger Körperfettanteil"
      ]
    }
  },

  health_training_minutes: {
    en: {
      label: "Weekly training minutes (all exercise combined)",
      options: [
        "0",
        "1-149",
        "150-299",
        "300-449",
        "450+"
      ]
    },
    es: {
      label: "Minutos de entrenamiento semanal (todo ejercicio combinado)",
      options: [
        "0",
        "1-149",
        "150-299",
        "300-449",
        "450+"
      ]
    },
    fr: {
      label: "Minutes d'entraînement hebdomadaires (tous exercices combinés)",
      options: [
        "0",
        "1-149",
        "150-299",
        "300-449",
        "450+"
      ]
    },
    de: {
      label: "Wöchentliche Trainingsminuten (alle Übungen kombiniert)",
      options: [
        "0",
        "1-149",
        "150-299",
        "300-449",
        "450+"
      ]
    }
  },

  health_pushups: {
    en: {
      label: "Push-ups in one unbroken set",
      options: [
        "0",
        "1-9",
        "10-19",
        "20-34",
        "35-49",
        "50+"
      ]
    },
    es: {
      label: "Flexiones en una serie continua",
      options: [
        "0",
        "1-9",
        "10-19",
        "20-34",
        "35-49",
        "50+"
      ]
    },
    fr: {
      label: "Pompes en une série ininterrompue",
      options: [
        "0",
        "1-9",
        "10-19",
        "20-34",
        "35-49",
        "50+"
      ]
    },
    de: {
      label: "Liegestütze in einem ununterbrochenen Satz",
      options: [
        "0",
        "1-9",
        "10-19",
        "20-34",
        "35-49",
        "50+"
      ]
    }
  },

  health_pullups: {
    en: {
      label: "Pull-ups (strict) in one set",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-9",
        "10+"
      ]
    },
    es: {
      label: "Dominadas (estrictas) en una serie",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-9",
        "10+"
      ]
    },
    fr: {
      label: "Tractions (strictes) en une série",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-9",
        "10+"
      ]
    },
    de: {
      label: "Klimmzüge (strikt) in einem Satz",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-9",
        "10+"
      ]
    }
  },

  health_cooper_or_5k: {
    en: {
      label: "How would you rate your cardiovascular fitness?",
      options: [
        "Poor - get winded climbing stairs",
        "Below average - struggle with moderate exercise",
        "Average - can jog for 10-15 minutes",
        "Good - can run 3+ miles comfortably",
        "Very good - can run 5+ miles easily",
        "Excellent - could run a half marathon"
      ]
    },
    es: {
      label: "¿Cómo calificarías tu condición cardiovascular?",
      options: [
        "Pobre - me quedo sin aliento subiendo escaleras",
        "Por debajo del promedio - tengo dificultades con ejercicio moderado",
        "Promedio - puedo trotar por 10-15 minutos",
        "Bueno - puedo correr 3+ millas cómodamente",
        "Muy bueno - puedo correr 5+ millas fácilmente",
        "Excelente - podría correr un medio maratón"
      ]
    },
    fr: {
      label: "Comment évalueriez-vous votre forme cardiovasculaire?",
      options: [
        "Pauvre - essoufflé en montant les escaliers",
        "En dessous de la moyenne - lutte avec exercice modéré",
        "Moyenne - peut faire du jogging pendant 10-15 minutes",
        "Bon - peut courir 3+ miles confortablement",
        "Très bon - peut courir 5+ miles facilement",
        "Excellent - pourrait courir un semi-marathon"
      ]
    },
    de: {
      label: "Wie würden Sie Ihre Herz-Kreislauf-Fitness bewerten?",
      options: [
        "Schlecht - außer Atem beim Treppensteigen",
        "Unterdurchschnittlich - Schwierigkeiten mit moderater Bewegung",
        "Durchschnittlich - kann 10-15 Minuten joggen",
        "Gut - kann 3+ Meilen bequem laufen",
        "Sehr gut - kann 5+ Meilen leicht laufen",
        "Ausgezeichnet - könnte einen Halbmarathon laufen"
      ]
    }
  },

  health_alcohol: {
    en: {
      label: "Alcohol: standard drinks/week",
      options: [
        "0",
        "1-3",
        "4-7",
        "8-14",
        ">14"
      ]
    },
    es: {
      label: "Alcohol: bebidas estándar/semana",
      options: [
        "0",
        "1-3",
        "4-7",
        "8-14",
        ">14"
      ]
    },
    fr: {
      label: "Alcool : verres standard/semaine",
      options: [
        "0",
        "1-3",
        "4-7",
        "8-14",
        ">14"
      ]
    },
    de: {
      label: "Alkohol: Standardgetränke/Woche",
      options: [
        "0",
        "1-3",
        "4-7",
        "8-14",
        ">14"
      ]
    }
  },

  health_mental_health: {
    en: {
      label: "Overall mental health and well-being",
      options: [
        "Very poor",
        "Poor",
        "Fair",
        "Good",
        "Excellent"
      ]
    },
    es: {
      label: "Salud mental y bienestar general",
      options: [
        "Muy mala",
        "Mala",
        "Regular",
        "Buena",
        "Excelente"
      ]
    },
    fr: {
      label: "Santé mentale et bien-être global",
      options: [
        "Très mauvaise",
        "Mauvaise",
        "Passable",
        "Bonne",
        "Excellente"
      ]
    },
    de: {
      label: "Gesamte psychische Gesundheit und Wohlbefinden",
      options: [
        "Sehr schlecht",
        "Schlecht",
        "Ordentlich",
        "Gut",
        "Ausgezeichnet"
      ]
    }
  },

  health_stress_management: {
    en: {
      label: "Stress management practices you regularly use",
      options: [
        "None",
        "Occasional (breathing, walks)",
        "Regular (meditation, yoga)",
        "Multiple practices",
        "Professional support + practices"
      ]
    },
    es: {
      label: "Prácticas de manejo del estrés que usas regularmente",
      options: [
        "Ninguna",
        "Ocasionales (respiración, caminatas)",
        "Regulares (meditación, yoga)",
        "Múltiples prácticas",
        "Apoyo profesional + prácticas"
      ]
    },
    fr: {
      label: "Pratiques de gestion du stress que vous utilisez régulièrement",
      options: [
        "Aucune",
        "Occasionnelles (respiration, marche)",
        "Régulières (méditation, yoga)",
        "Multiples pratiques",
        "Soutien professionnel + pratiques"
      ]
    },
    de: {
      label: "Stressmanagement-Praktiken, die Sie regelmäßig anwenden",
      options: [
        "Keine",
        "Gelegentlich (Atmung, Spaziergänge)",
        "Regelmäßig (Meditation, Yoga)",
        "Mehrere Praktiken",
        "Professionelle Unterstützung + Praktiken"
      ]
    }
  },

  health_medical_checkups: {
    en: {
      label: "Regular medical checkups and preventive care",
      options: [
        "Never/rarely",
        "When sick only",
        "Every 2-3 years",
        "Annually",
        "Bi-annually + specialists"
      ]
    },
    es: {
      label: "Chequeos médicos regulares y cuidado preventivo",
      options: [
        "Nunca/raramente",
        "Solo cuando estoy enfermo",
        "Cada 2-3 años",
        "Anualmente",
        "Semestralmente + especialistas"
      ]
    },
    fr: {
      label: "Examens médicaux réguliers et soins préventifs",
      options: [
        "Jamais/rarement",
        "Seulement quand malade",
        "Tous les 2-3 ans",
        "Annuellement",
        "Semestriellement + spécialistes"
      ]
    },
    de: {
      label: "Regelmäßige Gesundheitschecks und Vorsorge",
      options: [
        "Nie/selten",
        "Nur bei Krankheit",
        "Alle 2-3 Jahre",
        "Jährlich",
        "Halbjährlich + Fachärzte"
      ]
    }
  },

  health_energy_levels: {
    en: {
      label: "Average daily energy levels",
      options: [
        "Always exhausted",
        "Often tired",
        "Moderate energy",
        "Usually energetic",
        "High energy all day"
      ]
    },
    es: {
      label: "Niveles de energía diarios promedio",
      options: [
        "Siempre agotado",
        "A menudo cansado",
        "Energía moderada",
        "Usualmente enérgico",
        "Alta energía todo el día"
      ]
    },
    fr: {
      label: "Niveaux d'énergie quotidiens moyens",
      options: [
        "Toujours épuisé",
        "Souvent fatigué",
        "Énergie modérée",
        "Habituellement énergique",
        "Haute énergie toute la journée"
      ]
    },
    de: {
      label: "Durchschnittliche tägliche Energielevel",
      options: [
        "Immer erschöpft",
        "Oft müde",
        "Moderate Energie",
        "Meist energisch",
        "Hohe Energie den ganzen Tag"
      ]
    }
  },

  // Social Questions
  social_emergency_contacts: {
    en: {
      label: "If you needed $1,000 by tomorrow, how many friends/family could you realistically ask?",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-10",
        "10+"
      ]
    },
    es: {
      label: "Si necesitaras $1,000 para mañana, ¿a cuántos amigos/familiares podrías pedírselo realmente?",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-10",
        "10+"
      ]
    },
    fr: {
      label: "Si vous aviez besoin de 1 000 $ pour demain, combien d'amis/famille pourriez-vous réellement demander?",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-10",
        "10+"
      ]
    },
    de: {
      label: "Wenn Sie bis morgen 1.000 $ bräuchten, wie viele Freunde/Familie könnten Sie realistisch fragen?",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-10",
        "10+"
      ]
    }
  },

  social_close_friends: {
    en: {
      label: "Close friends you can confide in",
      options: [
        "0",
        "1",
        "2-3",
        "4-5",
        "6+"
      ]
    },
    es: {
      label: "Amigos cercanos en los que puedes confiar",
      options: [
        "0",
        "1",
        "2-3",
        "4-5",
        "6+"
      ]
    },
    fr: {
      label: "Amis proches en qui vous pouvez avoir confiance",
      options: [
        "0",
        "1",
        "2-3",
        "4-5",
        "6+"
      ]
    },
    de: {
      label: "Enge Freunde, denen Sie vertrauen können",
      options: [
        "0",
        "1",
        "2-3",
        "4-5",
        "6+"
      ]
    }
  },

  social_meetups: {
    en: {
      label: "Meet-ups with friends (offline)",
      options: [
        "<monthly",
        "monthly",
        "2-3x/month",
        "weekly",
        "2-3x/week",
        "daily"
      ]
    },
    es: {
      label: "Encuentros con amigos (fuera de línea)",
      options: [
        "<mensual",
        "mensual",
        "2-3x/mes",
        "semanal",
        "2-3x/semana",
        "diario"
      ]
    },
    fr: {
      label: "Rencontres avec des amis (hors ligne)",
      options: [
        "<mensuel",
        "mensuel",
        "2-3x/mois",
        "hebdomadaire",
        "2-3x/semaine",
        "quotidien"
      ]
    },
    de: {
      label: "Treffen mit Freunden (offline)",
      options: [
        "<monatlich",
        "monatlich",
        "2-3x/Monat",
        "wöchentlich",
        "2-3x/Woche",
        "täglich"
      ]
    }
  },

  social_initiation: {
    en: {
      label: "Initiation: how often do you initiate plans?",
      options: [
        "Rarely",
        "Sometimes",
        "About half",
        "Often",
        "Almost always"
      ]
    },
    es: {
      label: "Iniciativa: ¿qué tan seguido inicias planes?",
      options: [
        "Raramente",
        "A veces",
        "Aproximadamente la mitad",
        "Frecuentemente",
        "Casi siempre"
      ]
    },
    fr: {
      label: "Initiative : à quelle fréquence initiez-vous des plans?",
      options: [
        "Rarement",
        "Parfois",
        "Environ la moitié",
        "Souvent",
        "Presque toujours"
      ]
    },
    de: {
      label: "Initiative: Wie oft initiieren Sie Pläne?",
      options: [
        "Selten",
        "Manchmal",
        "Etwa die Hälfte",
        "Oft",
        "Fast immer"
      ]
    }
  },

  social_circle_diversity: {
    en: {
      label: "Social circle diversity",
      options: [
        "Mostly one group",
        "2 distinct groups",
        "3+ distinct groups"
      ]
    },
    es: {
      label: "Diversidad del círculo social",
      options: [
        "Principalmente un grupo",
        "2 grupos distintos",
        "3+ grupos distintos"
      ]
    },
    fr: {
      label: "Diversité du cercle social",
      options: [
        "Principalement un groupe",
        "2 groupes distincts",
        "3+ groupes distincts"
      ]
    },
    de: {
      label: "Vielfalt des sozialen Kreises",
      options: [
        "Hauptsächlich eine Gruppe",
        "2 verschiedene Gruppen",
        "3+ verschiedene Gruppen"
      ]
    }
  },

  social_community: {
    en: {
      label: "Community membership (club/sport/volunteer)",
      options: [
        "None",
        "1",
        "2+"
      ]
    },
    es: {
      label: "Membresía comunitaria (club/deporte/voluntario)",
      options: [
        "Ninguna",
        "1",
        "2+"
      ]
    },
    fr: {
      label: "Adhésion communautaire (club/sport/bénévolat)",
      options: [
        "Aucune",
        "1",
        "2+"
      ]
    },
    de: {
      label: "Gemeinschaftsmitgliedschaft (Club/Sport/Ehrenamt)",
      options: [
        "Keine",
        "1",
        "2+"
      ]
    }
  },

  social_professional_network: {
    en: {
      label: "Professional favors: people who'd intro you to a job lead in 48h",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-10",
        "10+"
      ]
    },
    es: {
      label: "Favores profesionales: personas que te recomendarían para un trabajo en 48h",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-10",
        "10+"
      ]
    },
    fr: {
      label: "Faveurs professionnelles : personnes qui vous recommanderaient pour un emploi en 48h",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-10",
        "10+"
      ]
    },
    de: {
      label: "Berufliche Gefälligkeiten: Personen, die Sie in 48h für einen Job empfehlen würden",
      options: [
        "0",
        "1-2",
        "3-5",
        "6-10",
        "10+"
      ]
    }
  },

  social_loneliness: {
    en: {
      label: "Loneliness in last 2 weeks",
      options: [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Very often"
      ]
    },
    es: {
      label: "Soledad en las últimas 2 semanas",
      options: [
        "Nunca",
        "Raramente",
        "A veces",
        "Frecuentemente",
        "Muy frecuentemente"
      ]
    },
    fr: {
      label: "Solitude dans les 2 dernières semaines",
      options: [
        "Jamais",
        "Rarement",
        "Parfois",
        "Souvent",
        "Très souvent"
      ]
    },
    de: {
      label: "Einsamkeit in den letzten 2 Wochen",
      options: [
        "Nie",
        "Selten",
        "Manchmal",
        "Oft",
        "Sehr oft"
      ]
    }
  },

  social_family_relationships: {
    en: {
      label: "Quality of family relationships",
      options: [
        "Very poor",
        "Poor",
        "Fair",
        "Good",
        "Excellent"
      ]
    },
    es: {
      label: "Calidad de las relaciones familiares",
      options: [
        "Muy mala",
        "Mala",
        "Regular",
        "Buena",
        "Excelente"
      ]
    },
    fr: {
      label: "Qualité des relations familiales",
      options: [
        "Très mauvaise",
        "Mauvaise",
        "Passable",
        "Bonne",
        "Excellente"
      ]
    },
    de: {
      label: "Qualität der Familienbeziehungen",
      options: [
        "Sehr schlecht",
        "Schlecht",
        "Ordentlich",
        "Gut",
        "Ausgezeichnet"
      ]
    }
  },

  social_conflict_resolution: {
    en: {
      label: "How do you handle interpersonal conflicts?",
      options: [
        "Avoid completely",
        "Struggle significantly",
        "Handle with difficulty",
        "Navigate well",
        "Excel at resolution"
      ]
    },
    es: {
      label: "¿Cómo manejas los conflictos interpersonales?",
      options: [
        "Los evito completamente",
        "Lucho significativamente",
        "Los manejo con dificultad",
        "Navego bien",
        "Sobresalgo en la resolución"
      ]
    },
    fr: {
      label: "Comment gérez-vous les conflits interpersonnels?",
      options: [
        "J'évite complètement",
        "Je lutte significativement",
        "Je gère avec difficulté",
        "Je navigue bien",
        "J'excelle à la résolution"
      ]
    },
    de: {
      label: "Wie gehen Sie mit zwischenmenschlichen Konflikten um?",
      options: [
        "Völlig vermeiden",
        "Kämpfe erheblich",
        "Bewältige mit Schwierigkeiten",
        "Navigiere gut",
        "Übertreffe in der Lösung"
      ]
    }
  },

  social_giving_back: {
    en: {
      label: "Volunteering or giving back to community",
      options: [
        "Never",
        "Rare occasions",
        "Few times per year",
        "Monthly",
        "Weekly commitment"
      ]
    },
    es: {
      label: "Voluntariado o contribuir a la comunidad",
      options: [
        "Nunca",
        "Ocasiones raras",
        "Pocas veces al año",
        "Mensual",
        "Compromiso semanal"
      ]
    },
    fr: {
      label: "Bénévolat ou contribution à la communauté",
      options: [
        "Jamais",
        "Occasions rares",
        "Quelques fois par an",
        "Mensuel",
        "Engagement hebdomadaire"
      ]
    },
    de: {
      label: "Ehrenamtliche Arbeit oder Beitrag zur Gemeinschaft",
      options: [
        "Nie",
        "Seltene Gelegenheiten",
        "Wenige Male pro Jahr",
        "Monatlich",
        "Wöchentliche Verpflichtung"
      ]
    }
  }
}

// Import extended translations
import { extendedQuestionTranslations } from './question-translations-extended'

// Helper function to get translated question content
export function getTranslatedQuestion(questionId: string, language: string) {
  // First check main translations
  let translation = questionTranslations[questionId]
  
  // If not found, check extended translations
  if (!translation) {
    translation = extendedQuestionTranslations[questionId]
  }
  
  if (translation && translation[language as keyof typeof translation]) {
    return translation[language as keyof typeof translation]
  }
  // Fallback to English if translation not found
  return translation?.en || null
}