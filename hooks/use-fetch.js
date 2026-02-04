"use client";

import { useState, useCallback } from "react";

/**
 * Custom hook for handling async operations with loading, error, and data states
 * @param {Function} callback - Async function to execute
 * @returns {Object} - { data, loading, error, fn, setData }
 */
export function useFetch(callback) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fn = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);

            try {
                const result = await callback(...args);
                setData(result);
                return result;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [callback]
    );

    return { data, loading, error, fn, setData };
}

export default useFetch;
