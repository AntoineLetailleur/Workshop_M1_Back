import { Serializer } from "jsonapi-serializer";

export function formatJsonApiError(errors: any[]): any {
  return {
    errors: errors.map((error) => ({
      status: error.status || "400",
      title: error.title || "Bad Request",
      detail: error.detail || "An error occurred",
    })),
  };
}
