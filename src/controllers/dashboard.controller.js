import Product from "../models/product.model.js";
import Request from "../models/request.model.js";
import User from "../models/user.model.js";
import { asyncErrorHandler } from "../services/common.service.js";

// Enhanced Dashboard Stats API with time period filtering
export const dashboardStats = asyncErrorHandler(async (req, res) => {
    try {
        // Get time period from query params (default to monthly)
        const timePeriod = req.query.period || 'monthly'; // Options: 'weekly', 'monthly', 'yearly'

        const currentDate = new Date();

        // Calculate date ranges based on selected time period
        let currentPeriodStart, currentPeriodEnd;
        let previousPeriodStart, previousPeriodEnd;

        switch (timePeriod) {
            case 'weekly':
                // Calculate the start of the current week (Sunday as first day of week)
                currentPeriodStart = new Date(currentDate);
                currentPeriodStart.setDate(currentPeriodStart.getDate() - currentPeriodStart.getDay());
                currentPeriodStart.setHours(0, 0, 0, 0);

                // Previous week
                previousPeriodStart = new Date(currentPeriodStart);
                previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);

                previousPeriodEnd = new Date(currentPeriodStart);
                previousPeriodEnd.setMilliseconds(previousPeriodEnd.getMilliseconds() - 1);
                break;

            case 'yearly':
                // Current year
                currentPeriodStart = new Date(currentDate.getFullYear(), 0, 1);

                // Previous year
                previousPeriodStart = new Date(currentDate.getFullYear() - 1, 0, 1);
                previousPeriodEnd = new Date(currentDate.getFullYear(), 0, 0);
                break;

            case 'monthly':
            default:
                // Current month
                currentPeriodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

                // Previous month
                previousPeriodStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                previousPeriodEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                break;
        }

        // Set current period end to current date (for all periods)
        currentPeriodEnd = currentDate

        // 1. Revenue stats with time period filtering
        const revenueStats = await Request.aggregate([
            {
                $match: {
                    status: { $in: ["returned", "done"] },
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: null,
                    currentPeriodRevenue: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$createdAt", currentPeriodStart] },
                                        { $lte: ["$createdAt", currentPeriodEnd] }
                                    ]
                                },
                                "$total",
                                0
                            ]
                        }
                    },
                    previousPeriodRevenue: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$createdAt", previousPeriodStart] },
                                        { $lte: ["$createdAt", previousPeriodEnd] }
                                    ]
                                },
                                "$total",
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        // 2. Active rentals - current period
        const activeRentals = await Request.countDocuments({
            status: "approved",
            isDeleted: false,
            "dateRange.startDate": { $lte: currentPeriodEnd },
            "dateRange.endDate": { $gte: currentPeriodStart }
        });

        // Previous period active rentals
        const previousActiveRentals = await Request.countDocuments({
            status: "approved",
            isDeleted: false,
            "dateRange.startDate": { $lte: previousPeriodEnd },
            "dateRange.endDate": { $gte: previousPeriodStart }
        });

        // 3. User stats - new users in the current period
        const totalUsers = await User.countDocuments({ isDeleted: false });

        const newUsers = await User.countDocuments({
            isDeleted: false,
            createdAt: { $gte: currentPeriodStart, $lte: currentPeriodEnd }
        });

        const prevPeriodNewUsers = await User.countDocuments({
            isDeleted: false,
            createdAt: { $gte: previousPeriodStart, $lte: previousPeriodEnd }
        });

        // 4. Rating stats - updated in the current period
        const ratingsData = await Product.aggregate([
            {
                $match: {
                    isDeleted: false,
                    rating: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ]);

        // Ratings updated in previous period
        const prevRatingsData = await Product.aggregate([
            {
                $match: {
                    isDeleted: false,
                    rating: { $exists: true, $ne: null },
                    updatedAt: { $gte: previousPeriodStart, $lte: previousPeriodEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ]);

        // Calculate percentage changes
        let revenueChange = 0;
        let currentPeriodRevenue = 0;
        if (revenueStats.length > 0) {
            currentPeriodRevenue = revenueStats[0].currentPeriodRevenue;
            const previousPeriodRevenue = revenueStats[0].previousPeriodRevenue;

            if (previousPeriodRevenue > 0) {
                revenueChange = ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
            } else {
                revenueChange = currentPeriodRevenue > 0 ? 100 : 0;
            }
        }

        let rentalChange = 0;
        if (previousActiveRentals > 0) {
            rentalChange = ((activeRentals - previousActiveRentals) / previousActiveRentals) * 100;
        } else {
            rentalChange = activeRentals > 0 ? 100 : 0;
        }

        let userChange = 0;
        if (prevPeriodNewUsers > 0) {
            userChange = ((newUsers - prevPeriodNewUsers) / prevPeriodNewUsers) * 100;
        } else {
            userChange = newUsers > 0 ? 100 : 0;
        }

        let averageRating = 0;
        let ratingChange = 0;
        if (ratingsData.length > 0) {
            averageRating = parseFloat(ratingsData[0].averageRating?.toFixed(1)) || 0;

            if (prevRatingsData.length > 0) {
                const prevAvgRating = prevRatingsData[0].averageRating || 0;
                if (prevAvgRating > 0) {
                    ratingChange = ((averageRating - prevAvgRating) / prevAvgRating) * 100;
                } else {
                    ratingChange = averageRating > 0 ? 100 : 0;
                }
            }
        }

        // Format the response according to your dashboard needs
        return res.status(200).json({
            timePeriod,
            revenue: {
                total: Math.round(currentPeriodRevenue),
                percentageChange: parseFloat(revenueChange.toFixed(1))
            },
            activeRentals: {
                count: activeRentals,
                percentageChange: parseFloat(rentalChange.toFixed(1))
            },
            users: {
                total: totalUsers,
                percentageChange: parseFloat(userChange.toFixed(1))
            },
            rating: {
                average: averageRating,
                percentageChange: parseFloat(ratingChange.toFixed(1))
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});