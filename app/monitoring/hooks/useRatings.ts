"use client";

import { useState, useEffect } from 'react';
import { RatingStats, RatingTimeline, ServicesRatings } from '../types/monitoring';

const API_BASE_URL = process.env.NEXT_PUBLIC_MONITORING_API_URL || 'http://localhost:8000';

export const useRatingsStats = (serviceName?: string, days: number = 30) => {
    const [stats, setStats] = useState<RatingStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                let url = `${API_BASE_URL}/api/ratings/stats?days=${days}`;
                if (serviceName) {
                    url += `&service_name=${encodeURIComponent(serviceName)}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setStats(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching ratings stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [serviceName, days]);

    return { stats, loading, error };
};

export const useRatingsTimeline = (serviceName?: string, days: number = 30) => {
    const [timeline, setTimeline] = useState<RatingTimeline | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                setLoading(true);
                let url = `${API_BASE_URL}/api/ratings/timeline?days=${days}`;
                if (serviceName) {
                    url += `&service_name=${encodeURIComponent(serviceName)}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setTimeline(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching ratings timeline:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTimeline();
    }, [serviceName, days]);

    return { timeline, loading, error };
};

export const useServicesRatings = (days: number = 30) => {
    const [data, setData] = useState<ServicesRatings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServicesRatings = async () => {
            try {
                setLoading(true);
                const url = `${API_BASE_URL}/api/ratings/services?days=${days}`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching services ratings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchServicesRatings();
    }, [days]);

    return { data, loading, error };
};
