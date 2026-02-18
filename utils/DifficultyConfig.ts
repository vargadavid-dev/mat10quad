
export type DifficultyLevel = 1 | 2 | 3;

export interface DifficultyConfig {
    [topic: string]: {
        [subType: string]: DifficultyLevel;
    };
}

export const DIFFICULTY_CONFIG: DifficultyConfig = {
    'quadratic': {
        'coeffs': 1,
        'vertex_x': 1,
        'vertex_y': 1,
        'num_roots': 1,
        'discriminant': 2,
        'missing_param': 2,
        'roots': 3,
        'vieta_sum': 3,
        'vieta_prod': 3,
        'inequality': 3,
    },
    'coord_geometry': {
        'read': 1,
        'plot': 2,
    },
    'functions': {
        'mapping': 1,
        'linear_int': 2,  // Integer slope/intercept
        'linear_frac': 3, // Fractional slope
    }
};

export const getDifficulty = (topic: string, subType: string): DifficultyLevel => {
    const topicConfig = DIFFICULTY_CONFIG[topic];
    if (!topicConfig) return 2; // Default Medium

    return topicConfig[subType] || 2;
};

export const setDifficulty = (topic: string, subType: string, level: DifficultyLevel): void => {
    if (!DIFFICULTY_CONFIG[topic]) {
        DIFFICULTY_CONFIG[topic] = {};
    }
    DIFFICULTY_CONFIG[topic][subType] = level;
};
