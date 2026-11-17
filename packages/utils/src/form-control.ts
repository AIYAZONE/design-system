import { maxLengthValidator } from "@open-wc/form-control";

const validityStates: Array<keyof ValidityState> = [
  "valueMissing",
  "typeMismatch",
  "tooLong",
  "tooShort",
  "rangeUnderflow",
  "rangeOverflow",
  "stepMismatch",
  "badInput",
  "patternMismatch",
  "customError",
];

export const innerInputValidators = validityStates.map((key) => ({
  key,
  isValid(instance: HTMLElement & { validationTarget: HTMLInputElement }) {
    if (instance.validationTarget) {
      return !instance.validationTarget.validity[key];
    }
    return true;
  },
}));

export interface TextareaLengthValidator {
  attribute?: string | string[];
  key?: keyof ValidityState;
  message: string | ((instance: HTMLElement, value: File | FormData | string | null) => string);
  isValid(instance: HTMLElement & { validationTarget: HTMLTextAreaElement }): boolean;
}

export const textareaLengthValidator: TextareaLengthValidator = {
  ...maxLengthValidator,
  isValid(instance: HTMLElement & { validationTarget: HTMLTextAreaElement }) {
    if (instance.validationTarget && instance.getAttribute("maxlength")) {
      return (
        Number(instance.getAttribute("maxlength")) >=
        instance.validationTarget.value.length
      );
    }
    return true;
  },
};

export const textAreaValidators = [
  ...innerInputValidators,
  textareaLengthValidator,
];
