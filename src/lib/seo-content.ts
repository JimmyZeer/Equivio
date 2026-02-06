export interface SpecialtySEO {
    h1: string;
    intro: string[]; // Array of value paragraphs
    faq: {
        question: string;
        answer: string;
    }[];
}

export const SPECIALTY_CONTENT: Record<string, SpecialtySEO> = {
    osteopathes: {
        h1: "Annuaire des Ostéopathes animaliers en France",
        intro: [
            "L'ostéopathie équine est essentielle pour maintenir la santé locomotrice et le bien-être général de votre cheval. Que ce soit pour un suivi annuel, suite à une baisse de performance, ou pour soulager des tensions musculaires, l'intervention d'un professionnel qualifié est déterminante.",
            "Sur Equivio, vous accédez à une liste fiable d'ostéopathes animaliers dont l'activité professionnelle est vérifiée. Chaque praticien référencé intervient réellement sur le terrain, vous garantissant une prise en charge sérieuse, que vous soyez un propriétaire de loisir ou un compétiteur."
        ],
        faq: [
            {
                question: "Quand consulter un ostéopathe pour son cheval ?",
                answer: "Il est recommandé de consulter au moins une fois par an pour un bilan préventif. Une consultation est également conseillée en cas de raideur, de baisse de performance, de défense au travail, ou après un traumatisme (chute, glissade)."
            },
            {
                question: "Quel est le tarif moyen d'une séance d'ostéopathie équine ?",
                answer: "Le tarif moyen d'une consultation varie généralement entre 80€ et 120€, selon la région, l'expérience du praticien et les frais de déplacement inclus ou non."
            },
            {
                question: "L'ostéopathe peut-il manipuler sans ordonnance vétérinaire ?",
                answer: "Depuis l'ordonnance de 2011, les ostéopathes non-vétérinaires inscrits au Registre National d'Aptitude (RNA) peuvent intervenir librement sur les actes d'ostéopathie. Equivio vérifie ces statuts professionnels."
            }
        ]
    },
    marechaux: {
        h1: "Annuaire des Maréchaux-ferrants en France",
        intro: [
            "Le maréchal-ferrant est le partenaire incontournable de la santé des pieds de votre cheval. Du parage physiologique à la ferrure orthopédique complexe, son expertise garantit des aplombs corrects et prévient de nombreuses pathologies locomotrices.",
            "Trouver un maréchal-ferrant disponible et compétent peut être un défi. Equivio centralise les professionnels en activité par région, vous permettant de trouver un expert acceptant de nouveaux clients près de votre écurie pour un suivi régulier."
        ],
        faq: [
            {
                question: "À quelle fréquence mon cheval doit-il voir le maréchal ?",
                answer: "La fréquence idéale se situe généralement entre 6 et 8 semaines, selon la pousse de la corne et l'activité du cheval. Un suivi régulier évite les déséquilibres articulaires importants."
            },
            {
                question: "Quelle est la différence entre parage et ferrure ?",
                answer: "Le parage consiste à tailler la corne pour équilibrer le pied (cheval 'pieds nus'). La ferrure implique la pose d'un fer en métal ou plastique pour protéger le pied ou corriger des défauts d'aplomb."
            },
            {
                question: "Comment choisir entre pieds nus et ferrure ?",
                answer: "Ce choix dépend de la qualité de la corne, du terrain sur lequel évolue le cheval, et de son activité sportive. Votre maréchal-ferrant est le meilleur conseiller pour évaluer ces paramètres."
            }
        ]
    },
    dentistes: {
        h1: "Annuaire des Dentistes équins en France",
        intro: [
            "Une bonne dentition est la clé d'une alimentation valorisée et d'un confort au travail optimal. Les dents du cheval poussant en continu, elles nécessitent un entretien régulier pour éviter surdents et blessures dans la bouche.",
            "Les Techniciens Dentaires Équins (TDE) référencés sur Equivio sont des professionnels formés pour niveler la table dentaire et extraire les dents de loup. Ils travaillent souvent en collaboration avec votre vétérinaire pour assurer le confort global du cheval."
        ],
        faq: [
            {
                question: "À quelle fréquence faut-il faire voir les dents de son cheval ?",
                answer: "Un contrôle annuel est recommandé pour tous les chevaux. Pour les jeunes chevaux (jusqu'à 5 ans) et les chevaux âgés, un contrôle tous les 6 mois peut être nécessaire."
            },
            {
                question: "Quelle est la différence entre un TDE et un vétérinaire ?",
                answer: "Le Technicien Dentaire Équin est spécialiste de l'entretien courant (nivellement). En revanche, pour les extractions complexes, les chirurgies ou l'administration de sédatifs injectables, l'intervention d'un vétérinaire est légalement obligatoire."
            },
            {
                question: "Mon cheval lâche de la nourriture, est-ce les dents ?",
                answer: "C'est un signe classique (appelé 'faire du magasin'). Une gêne dentaire peut aussi se manifester par une défense au mors, une perte d'état ou une mauvaise digestion."
            }
        ]
    },
    "bien-etre": {
        h1: "Annuaire des Praticiens bien-être équin",
        intro: [
            "Au-delà des soins curatifs, le bien-être équin englobe de nombreuses pratiques visant à améliorer le confort physique et mental du cheval : massage, shiatsu, algothérapie ou encore communication animale.",
            "Ces approches complémentaires soutiennent la récupération sportive et l'équilibre émotionnel. Equivio recense les praticiens sérieux qui s'engagent dans une démarche professionnelle pour accompagner votre cheval au quotidien."
        ],
        faq: [
            {
                question: "Quelle est la différence entre massage et ostéopathie ?",
                answer: "L'ostéopathie vise à restaurer la mobilité articulaire et structurelle. Le massage agit principalement sur la détente musculaire, la circulation sanguine et lymphatique, et la récupération."
            },
            {
                question: "Le shiatsu peut-il remplacer le vétérinaire ?",
                answer: "Non, aucune pratique de bien-être ne remplace un diagnostic et un soin vétérinaire. Ce sont des approches complémentaires qui accompagnent la santé globale du cheval."
            },
            {
                question: "Quand faire appel à un praticien de bien-être ?",
                answer: "Idéalement en récupération après une compétition, en période de stress (changement d'écurie), ou en entretien régulier pour un cheval âgé ou anxieux."
            }
        ]
    }
};
