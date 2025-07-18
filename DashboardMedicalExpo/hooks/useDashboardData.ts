import {
    chartData,
    dashboardStats,
    notifications,
    todaysProgram,
} from '../data/dashboardData';

export function useDashboardData() {
    return {
        stats: dashboardStats,
        program: todaysProgram,
        notifications,
        chartData,
    };
}
