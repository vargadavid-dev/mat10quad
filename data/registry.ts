import { CurriculumItem } from '../types';
import { quadraticCurriculum } from './modules/algebra/quadratic_equations';
import { coordinateSystemCurriculum } from './modules/analysis/coordinate_system';
import { linearFunctionsCurriculum } from './modules/analysis/linear_functions';
import { functionBasicsCurriculum } from './modules/analysis/function_basics';

import { numberFunctionsCurriculum } from './modules/analysis/number_functions';

// Type for the registry mapping
export type CurriculumRegistry = {
    [key: string]: CurriculumItem[];
};

// The central registry
export const curriculumRegistry: CurriculumRegistry = {
    'quadratic': quadraticCurriculum,
    'functions': [...coordinateSystemCurriculum, ...functionBasicsCurriculum, ...numberFunctionsCurriculum, ...linearFunctionsCurriculum],
    // Add new modules here
};
