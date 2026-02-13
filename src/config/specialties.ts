export interface SpecialtyConfig {
    plural: string;
    singular: string;
    db: string;
}

export const SPECIALTIES_CONFIG: Record<string, SpecialtyConfig> = {
    osteopathes: {
        plural: "Ostéopathes équins",
        singular: "ostéopathe équin",
        db: "Ostéopathe animalier"
    },
    marechaux: {
        plural: "Maréchaux-ferrants",
        singular: "maréchal-ferrant",
        db: "Maréchal-ferrant"
    },
    dentistes: {
        plural: "Dentistes équins",
        singular: "dentiste équin",
        db: "Dentisterie équine"
    },
    "bien-etre": {
        plural: "Praticiens bien-être",
        singular: "praticien bien-être",
        db: "Praticien bien-être"
    },
};

export const DEFAULT_SPECIALTY: SpecialtyConfig = {
    plural: "Praticiens équins",
    singular: "praticien équin",
    db: "Praticien équin" // Fallback if needed, though usually indicates "all" or "unknown"
};
