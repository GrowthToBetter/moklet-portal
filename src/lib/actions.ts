export const ErrorCode = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

export type ActionError = {
  code: ErrorCodeType;
  message: string;
  field?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: ActionError;
};

export function createError(
  code: ErrorCodeType,
  message: string,
  field?: string,
): ActionError {
  return { code, message, field };
}

export const ActionResponses = {
  success<T>(data: T): ActionResponse<T> {
    return {
      success: true,
      data,
    };
  },

  error(error: ActionError): ActionResponse {
    return {
      success: false,
      error,
    };
  },

  badRequest(message: string, field?: string): ActionResponse {
    return {
      success: false,
      error: createError(ErrorCode.BAD_REQUEST, message, field),
    };
  },

  notFound(message: string): ActionResponse {
    return {
      success: false,
      error: createError(ErrorCode.NOT_FOUND, message),
    };
  },

  unauthorized(message = "Forbidden"): ActionResponse {
    return {
      success: false,
      error: createError(ErrorCode.FORBIDDEN, message),
    };
  },

  serverError(message = "Internal server error"): ActionResponse {
    return {
      success: false,
      error: createError(ErrorCode.SERVER_ERROR, message),
    };
  },
};
