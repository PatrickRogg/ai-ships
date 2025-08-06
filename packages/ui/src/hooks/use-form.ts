'use client';

import { logger } from '@company/common/logger';
import { useEffect } from 'react';
import {
  DefaultValues,
  FieldError,
  FieldErrors,
  FieldValues,
  useForm,
  UseFormProps
} from 'react-hook-form';
import { z, ZodError, ZodType } from 'zod';

export type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

const zodToHookFormErrors = (zodError: ZodError): FieldErrors => {
  const errors: FieldErrors = {};

  for (const issue of zodError.issues) {
    const path = issue.path.join('.') || 'root';
    errors[path] = {
      type: issue.code,
      message: issue.message
    } as FieldError;
  }

  return errors;
};

const zodResolver = <T extends FieldValues>(schema: ZodType<T>) => {
  return async (
    values: FieldValues
  ): Promise<{
    values: T;
    errors: FieldErrors<T>;
  }> => {
    try {
      const result = await schema.safeParseAsync(values);

      if (result.success) {
        return {
          values: result.data,
          errors: {} as FieldErrors<T>
        };
      } else {
        return {
          values: {} as T,
          errors: zodToHookFormErrors(result.error) as FieldErrors<T>
        };
      }
    } catch (error) {
      logger.error('Resolver error: ', error);
      return {
        values: {} as T,
        errors: {
          root: {
            type: 'unknown',
            message: 'An unknown error occurred during validation'
          } as FieldError
        } as FieldErrors<T>
      };
    }
  };
};

export function useZodForm<TSchema extends z.ZodType<any, any, any>>(
  props: Omit<UseFormProps<z.output<TSchema>>, 'resolver'> & {
    schema: TSchema;
  }
) {
  const { schema, ...rest } = props;
  const form = useForm<z.output<TSchema>>({
    ...rest,
    resolver: zodResolver(schema)
  });

  return form;
}

export const useResetForm = <TFieldValues extends FieldValues>({
  form,
  isOpen,
  values
}: {
  form: ReturnType<typeof useForm<TFieldValues>>;
  isOpen: boolean;
  values: DefaultValues<TFieldValues>;
}) => {
  useEffect(() => {
    if (isOpen) {
      form.reset(values);
    }
  }, [isOpen, form.reset]);
};

export { useFieldArray } from 'react-hook-form';
