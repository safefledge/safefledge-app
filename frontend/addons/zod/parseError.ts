import { appendErrors, FieldError, FieldErrors, Resolver } from 'react-hook-form';
import {z, ZodError} from 'zod';


const isZodError = (error: any): error is ZodError => error.errors !== undefined;

const parseError = (error: any): FieldErrors => {
    if (isZodError(error)) {
        const errors: FieldErrors = {};
        error.errors.forEach((issue: any) => {
            if (issue.path) {
                const path = issue.path.join('.');
                errors[path] = { type: issue.code, message: issue.message };
            }
        });
        return errors;
    }
    return {};
}

export default parseError;