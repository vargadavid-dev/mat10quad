import { CurriculumItem } from '../types';
import { quadraticCurriculum } from './modules/algebra/quadratic_equations';
import { factorizationCurriculum } from './modules/algebra/factorization';
import { coordinateSystemCurriculum } from './modules/analysis/coordinate_system';
import { linearFunctionsCurriculum } from './modules/analysis/linear_functions';
import { functionBasicsCurriculum } from './modules/analysis/function_basics';

import { numberFunctionsCurriculum } from './modules/analysis/number_functions';
import { circleBasicsCurriculum } from './modules/geometry/circle_basics';
import { circleFormulasCurriculum } from './modules/geometry/circle_formulas';
import { centralAnglesCurriculum } from './modules/geometry/central_angles';
import { pythagorasCurriculum } from './modules/geometry/pythagoras_sample';

// Type for the registry mapping
export type CurriculumRegistry = {
    [key: string]: CurriculumItem[];
};

// The central registry
export const curriculumRegistry: CurriculumRegistry = {
    'pythagoras': pythagorasCurriculum,
    'factorization': factorizationCurriculum,
    'quadratic': quadraticCurriculum,
    'functions': [...coordinateSystemCurriculum, ...functionBasicsCurriculum, ...numberFunctionsCurriculum, ...linearFunctionsCurriculum],
    'circle': [...circleBasicsCurriculum, ...centralAnglesCurriculum, ...circleFormulasCurriculum],
    // Add new modules here
};
