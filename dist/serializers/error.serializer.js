"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatJsonApiError = formatJsonApiError;
function formatJsonApiError(errors) {
    return {
        errors: errors.map((error) => ({
            status: error.status || "400",
            title: error.title || "Bad Request",
            detail: error.detail || "An error occurred",
        })),
    };
}
