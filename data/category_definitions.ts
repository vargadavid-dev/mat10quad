export interface Category {
    id: string;
    title: string;
    icon?: string; // Optional icon name
    subcategories: SubCategory[];
}

export interface SubCategory {
    id: string;
    title: string;
    isAvailable?: boolean;
}

export const textColors = {
    algebra: "text-indigo-600",
    geometry: "text-emerald-600",
    analysis: "text-blue-600",
    thinking: "text-amber-600",
    stats: "text-rose-600",
    numberTheory: "text-purple-600",
    default: "text-slate-700"
};

export const bgColors = {
    algebra: "bg-indigo-50",
    geometry: "bg-emerald-50",
    analysis: "bg-blue-50",
    thinking: "bg-amber-50",
    stats: "bg-rose-50",
    numberTheory: "bg-purple-50",
    default: "bg-slate-50"
};

export const categories: Category[] = [
    {
        id: 'algebra',
        title: 'Algebra',
        subcategories: [
            { id: 'quadratic', title: 'Másodfokú kifejezések', isAvailable: true },
            { id: 'linear', title: 'Egyenletek, egyenletrendszerek' },
            { id: 'inequalities', title: 'Egyenlőtlenségek' },
        ]
    },
    {
        id: 'number_theory',
        title: 'Számelmélet',
        subcategories: [
            { id: 'divisibility', title: 'Oszthatóság' },
            { id: 'primes', title: 'Prímszámok' },
            { id: 'number_sets', title: 'Számhalmazok' }
        ]
    },
    {
        id: 'analysis',
        title: 'Analízis',
        subcategories: [
            { id: 'functions', title: 'Függvények', isAvailable: true },
            { id: 'sequences', title: 'Sorozatok' }
        ]
    },
    {
        id: 'geometry',
        title: 'Geometria',
        subcategories: [
            { id: 'circle', title: 'Kör', isAvailable: true },
            { id: 'plane_geometry', title: 'Egyéb Síkgeometria' },
            { id: 'trigonometry', title: 'Trigonometria' },
            { id: 'coord_geometry', title: 'Koordinátageometria' },
            { id: 'solid_geometry', title: 'Térgeometria' }
        ]
    },
    {
        id: 'thinking_methods',
        title: 'Gondolkodási módszerek',
        subcategories: [
            { id: 'sets', title: 'Halmazok' },
            { id: 'logic', title: 'Logika' },
            { id: 'combinatorics', title: 'Kombinatorika' },
            { id: 'graphs', title: 'Gráfok' }
        ]
    },
    {
        id: 'probability',
        title: 'Valószínűségszámítás',
        subcategories: [
            { id: 'classic_prob', title: 'Klasszikus valószínűség' },
        ]
    },
    {
        id: 'statistics',
        title: 'Statisztika',
        subcategories: [
            { id: 'data_analysis', title: 'Adatleírás' },
            { id: 'averages', title: 'Középértékek, szórás' }
        ]
    }
];
