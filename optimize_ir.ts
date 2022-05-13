import { Type, SourceLocation } from './ast';
import * as IR from './ir';

export function optimizeIr(program: IR.Program<[Type, SourceLocation]>) : IR.Program<[Type, SourceLocation]> {
    // TODO: Add more details
    return { ...program};
}

