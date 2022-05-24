import { Rule } from "antd/lib/form";

export const rules = {
  required: (message: string): Rule => ({
    required: true,
    message,
  }),
  length: (length: number, message: string): Rule => ({
    len: length,
    message,
  }),
  max: (maxLength: number, message: string): Rule => ({
    max: maxLength,
    message,
  }),
  min: (minLength: number, message: string): Rule => ({
    min: minLength,
    message,
  }),
  pattern: (pattern: RegExp, message: string): Rule => ({
    pattern,
    message,
  }),
};
