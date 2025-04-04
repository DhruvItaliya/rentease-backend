import { asyncErrorHandler, sendSuccess } from "../services/common.service.js";
import Request from "../models/request.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
// export const getDashboard = asyncErrorHandler(async (req, res) => {
//     const { filter } = req.query;
//     const dateRange = getDateRange(filter);
//     if (!dateRange) return res.status(400).json({ error: 'Invalid filter' });

//     const { startDate, endDate } = dateRange;

//     // Fetch revenue
//     const revenueData = await Request.aggregate([
//         {
//             $match: {
//                 status: { $in: ['done', 'returned'] },
//                 createdAt: { $gte: startDate, $lte: endDate }
//             }
//         },
//         { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$amount' } } },
//         { $sort: { _id: 1 } }
//     ]);

//     // Fetch category trends
//     const categoryTrendsData = await Request.aggregate([
//         {
//             $match: { createdAt: { $gte: startDate, $lte: endDate } }
//         },
//         {
//             $group: {
//                 _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//                 Electronics: { $sum: { $cond: [{ $eq: ['$category', 'Electronics'] }, 1, 0] } },
//                 Sports: { $sum: { $cond: [{ $eq: ['$category', 'Sports'] }, 1, 0] } },
//                 Tools: { $sum: { $cond: [{ $eq: ['$category', 'Tools'] }, 1, 0] } },
//                 Home: { $sum: { $cond: [{ $eq: ['$category', 'Home'] }, 1, 0] } }
//             }
//         },
//         { $sort: { _id: 1 } }
//     ]);

//     // Fetch rental trends
//     const rentalTrendsData = await Request.aggregate([
//         {
//             $match: { createdAt: { $gte: startDate, $lte: endDate } }
//         },
//         {
//             $group: {
//                 _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//                 active: { $sum: { $cond: [{ $eq: ['$status', 'ongoing'] }, 1, 0] } },
//                 completed: { $sum: { $cond: [{ $in: ['$status', ['done', 'returned']] }, 1, 0] } }
//             }
//         },
//         { $sort: { _id: 1 } }
//     ]);

//     // Fetch rating distribution
//     const ratingDistribution = await Review.aggregate([
//         { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
//         { $group: { _id: '$rating', count: { $sum: 1 } } }
//     ]).then(data =>
//         [5, 4, 3, 2, 1].map(r => ({ rating: `${r}★`, count: data.find(d => d._id === r)?.count || 0 }))
//     );

//     // Fetch category data
//     const categoryData = await Request.aggregate([
//         {
//             $match: { createdAt: { $gte: startDate, $lte: endDate } }
//         },
//         {
//             $group: {
//                 _id: '$category',
//                 value: { $sum: 1 }
//             }
//         }
//     ]).then(data => data.map(d => ({ name: d._id, value: d.value })));

//     // Fetch stats data
//     const totalRevenue = revenueData.reduce((acc, val) => acc + val.revenue, 0);
//     const activeRentals = await Request.countDocuments({
//         status: 'ongoing',
//         createdAt: { $gte: startDate, $lte: endDate }
//     });
//     const totalUsers = await User.countDocuments({
//         createdAt: { $gte: startDate, $lte: endDate }
//     });
//     const avgRating = await Review.aggregate([
//         { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
//         { $group: { _id: null, avgRating: { $avg: '$rating' } } }
//     ]).then(res => res.length ? res[0].avgRating.toFixed(1) : '0.0');

//     const statsData = [
//         { title: 'Total Revenue', value: `₹${totalRevenue}`, change: '+2.1%', isPositive: true, period: filter, icon: '💰' },
//         { title: 'Active Rentals', value: activeRentals, change: '+5.6%', isPositive: true, period: filter, icon: '🛒' },
//         { title: 'Total Users', value: totalUsers, change: '+4.2%', isPositive: true, period: filter, icon: '👥' },
//         { title: 'Avg. Rating', value: avgRating, change: '-0.1%', isPositive: false, period: filter, icon: '⭐' }
//     ];

//     sendSuccess(res, {
//         revenueData,
//         categoryTrendsData,
//         rentalTrendsData,
//         ratingDistribution,
//         categoryData,
//         statsData
//     }, 200);
// })

// const getDateRange = (filter) => {
//     const now = new Date();
//     let startDate;

//     if (filter === 'weekly') {
//         startDate = new Date(now);
//         startDate.setDate(now.getDate() - 7);
//     } else if (filter === 'monthly') {
//         startDate = new Date(now);
//         startDate.setMonth(now.getMonth() - 1);
//     } else if (filter === 'yearly') {
//         startDate = new Date(now);
//         startDate.setFullYear(now.getFullYear() - 1);
//     } else {
//         return null;
//     }

//     return { startDate, endDate: now };
// };

// models imports are already defined in your schema files
import Product from '../models/product.model.js';
import Agreement from '../models/agreement.model.js';

export const getStats = async (req, res) => {
    try {
        const { period = 'weekly' } = req.query;

        // Define date ranges for current period
        const now = new Date();
        let currentStartDate;
        let previousStartDate;
        let previousEndDate;

        switch (period) {
            case 'weekly':
                // Current period: last 7 days
                currentStartDate = new Date(now);
                currentStartDate.setDate(now.getDate() - 7);
                
                // Previous period: 7 days before current period
                previousEndDate = new Date(currentStartDate);
                previousEndDate.setDate(previousEndDate.getDate() - 1);
                previousStartDate = new Date(previousEndDate);
                previousStartDate.setDate(previousEndDate.getDate() - 7);
                break;
                
            case 'monthly':
                // Current period: last 30 days
                currentStartDate = new Date(now);
                currentStartDate.setMonth(now.getMonth() - 1);
                
                // Previous period: 30 days before current period
                previousEndDate = new Date(currentStartDate);
                previousEndDate.setDate(previousEndDate.getDate() - 1);
                previousStartDate = new Date(previousEndDate);
                previousStartDate.setMonth(previousEndDate.getMonth() - 1);
                break;
                
            case 'yearly':
                // Current period: last 365 days
                currentStartDate = new Date(now);
                currentStartDate.setFullYear(now.getFullYear() - 1);
                
                // Previous period: 365 days before current period
                previousEndDate = new Date(currentStartDate);
                previousEndDate.setDate(previousEndDate.getDate() - 1);
                previousStartDate = new Date(previousEndDate);
                previousStartDate.setFullYear(previousEndDate.getFullYear() - 1);
                break;
                
            default:
                // Default to weekly
                currentStartDate = new Date(now);
                currentStartDate.setDate(now.getDate() - 7);
                previousEndDate = new Date(currentStartDate);
                previousEndDate.setDate(previousEndDate.getDate() - 1);
                previousStartDate = new Date(previousEndDate);
                previousStartDate.setDate(previousEndDate.getDate() - 7);
        }

        // Current Period Metrics
        
        // 1. Current Total Revenue
        const currentRevenue = await Agreement.aggregate([
            { $match: { createdAt: { $gte: currentStartDate, $lte: now } } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const currentRevenueTotal = currentRevenue[0]?.total || 0;

        // 2. Current Active Rentals
        const currentActiveRentals = await Request.countDocuments({
            status: { $in: ['approved', 'pending'] },
            createdAt: { $gte: currentStartDate, $lte: now }
        });

        // 3. Current Total Users
        const currentTotalUsers = await User.countDocuments({
            createdAt: { $gte: currentStartDate, $lte: now }
        });

        // 4. Current Average Rating
        const currentRatings = await Review.aggregate([
            { $match: { createdAt: { $gte: currentStartDate, $lte: now } } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        const currentAvgRating = currentRatings[0]?.avgRating || 0;

        // Previous Period Metrics
        
        // 1. Previous Total Revenue
        const previousRevenue = await Agreement.aggregate([
            { $match: { createdAt: { $gte: previousStartDate, $lte: previousEndDate } } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const previousRevenueTotal = previousRevenue[0]?.total || 0;

        // 2. Previous Active Rentals
        const previousActiveRentals = await Request.countDocuments({
            status: { $in: ['approved', 'pending'] },
            createdAt: { $gte: previousStartDate, $lte: previousEndDate }
        });

        // 3. Previous Total Users
        const previousTotalUsers = await User.countDocuments({
            createdAt: { $gte: previousStartDate, $lte: previousEndDate }
        });

        // 4. Previous Average Rating
        const previousRatings = await Review.aggregate([
            { $match: { createdAt: { $gte: previousStartDate, $lte: previousEndDate } } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        const previousAvgRating = previousRatings[0]?.avgRating || 0;

        // Calculate percentage changes
        
        // Helper function to calculate percentage change
        const calculateChange = (current, previous) => {
            if (previous === 0) {
                return current > 0 ? '+100.0%' : '0.0%';
            }
            const change = ((current - previous) / previous) * 100;
            return (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
        };

        const revenueChange = calculateChange(currentRevenueTotal, previousRevenueTotal);
        const rentalsChange = calculateChange(currentActiveRentals, previousActiveRentals);
        const usersChange = calculateChange(currentTotalUsers, previousTotalUsers);
        const ratingsChange = calculateChange(currentAvgRating, previousAvgRating);

        // Determine if changes are positive
        const isRevenuePositive = !revenueChange.startsWith('-');
        const isRentalsPositive = !rentalsChange.startsWith('-');
        const isUsersPositive = !usersChange.startsWith('-');
        const isRatingPositive = !ratingsChange.startsWith('-');

        const stats = [
            {
                title: 'Total Revenue',
                value: '₹' + currentRevenueTotal.toLocaleString('en-IN'),
                change: revenueChange,
                isPositive: isRevenuePositive,
                period
            },
            {
                title: 'Active Rentals',
                value: currentActiveRentals.toString(),
                change: rentalsChange,
                isPositive: isRentalsPositive,
                period
            },
            {
                title: 'Total Users',
                value: currentTotalUsers.toString(),
                change: usersChange,
                isPositive: isUsersPositive,
                period
            },
            {
                title: 'Avg. Rating',
                value: currentAvgRating.toFixed(1),
                change: ratingsChange,
                isPositive: isRatingPositive,
                period
            },
        ];

        res.json({ success: true, stats });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getRevenue = async (req, res) => {
    try {
        const { period = 'weekly' } = req.query;
        const now = new Date();
        let groupBy, startDate, labels = [];

        switch (period) {
            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                groupBy = { $dayOfWeek: "$createdAt" };

                // Generate last 7 days (Sunday to Saturday)
                labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                break;

            case 'monthly':
                startDate = new Date(now);
                startDate.setMonth(startDate.getMonth() - 6);
                groupBy = { $month: "$createdAt" };

                // Generate last 6 months
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                for (let i = 5; i >= 0; i--) {
                    let month = new Date();
                    month.setMonth(now.getMonth() - i);
                    labels.push(monthNames[month.getMonth()]);
                }
                break;

            case 'yearly':
                startDate = new Date(now);
                startDate.setFullYear(startDate.getFullYear() - 5);
                groupBy = { $year: "$createdAt" };

                // Generate last 5 years
                for (let i = 5; i >= 1; i--) {
                    labels.push((now.getFullYear() - i).toString());
                }
                labels.push(now.getFullYear().toString());
                break;

            default:
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                groupBy = { $dayOfWeek: "$createdAt" };
                labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        }

        const revenueData = await Agreement.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: groupBy,
                    revenue: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Map database results to an object for quick lookup
        let revenueMap = new Map(revenueData.map(item => [item._id, item.revenue]));

        // Fill missing periods with zero revenue
        let formattedData = labels.map((label, index) => ({
            period: label,
            revenue: revenueMap.get(index + 1) || revenueMap.get(parseInt(label)) || 0
        }));

        res.json({ success: true, data: formattedData });

    } catch (error) {
        console.error('Error fetching revenue data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



// /**
//  * @route   GET /api/dashboard/category-trends
//  * @desc    Get rental trends by category
//  * @access  Private (Admin)
export const categoryTrends = async(req, res) => {
    try {
        const { period } = req.query;
        const now = new Date();
        let groupBy, startDate, dateFormat;

        switch (period) {
            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                groupBy = {
                    day: { $dayOfWeek: "$createdAt" },
                    category: "$product.category"
                };
                break;
            case 'monthly':
                startDate = new Date(now);
                startDate.setMonth(startDate.getMonth() - 6);
                groupBy = {
                    month: { $month: "$createdAt" },
                    category: "$product.category"
                };
                break;
            case 'yearly':
                startDate = new Date(now);
                startDate.setFullYear(startDate.getFullYear() - 5);
                groupBy = {
                    year: { $year: "$createdAt" },
                    category: "$product.category"
                };
                break;
            default:
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                groupBy = {
                    day: { $dayOfWeek: "$createdAt" },
                    category: "$product.category"
                };
        }

        const categoryTrends = await Request.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: { $in: ['approved', 'done', 'returned'] }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: groupBy,
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    timePeriod: "$_id.day" || "$_id.month" || "$_id.year",
                    category: "$_id.category",
                    count: 1
                }
            },
            { $sort: { timePeriod: 1 } }
        ]);

        // Transform data for chart format
        // First get unique categories and time periods
        const categories = [...new Set(categoryTrends.map(item => item.category))];
        let timePeriods;

        switch (period) {
            case 'weekly':
                timePeriods = [
                    { id: 1, name: 'Sun' },
                    { id: 2, name: 'Mon' },
                    { id: 3, name: 'Tue' },
                    { id: 4, name: 'Wed' },
                    { id: 5, name: 'Thu' },
                    { id: 6, name: 'Fri' },
                    { id: 7, name: 'Sat' }
                ];
                break;
            case 'monthly':
                timePeriods = [
                    { id: 1, name: 'Jan' }, { id: 2, name: 'Feb' }, { id: 3, name: 'Mar' },
                    { id: 4, name: 'Apr' }, { id: 5, name: 'May' }, { id: 6, name: 'Jun' },
                    { id: 7, name: 'Jul' }, { id: 8, name: 'Aug' }, { id: 9, name: 'Sep' },
                    { id: 10, name: 'Oct' }, { id: 11, name: 'Nov' }, { id: 12, name: 'Dec' }
                ];
                break;
            case 'yearly':
                // For yearly, extract years from the data
                const years = [...new Set(categoryTrends.map(item => item.timePeriod))].sort();
                timePeriods = years.map(year => ({ id: year, name: year.toString() }));
                break;
        }

        // Create formatted data for chart
        const formattedData = timePeriods.map(tp => {
            const dataPoint = { period: tp.name };

            categories.forEach(category => {
                const match = categoryTrends.find(
                    item => item.timePeriod === tp.id && item.category === category
                );
                dataPoint[category] = match ? match.count : 0;
            });

            return dataPoint;
        });

        res.json({ success: true, data: formattedData });
    } catch (error) {
        console.error('Error fetching category trends:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// /**
//  * @route   GET /api/dashboard/rental-trends
//  * @desc    Get active vs completed rental trends
//  * @access  Private (Admin)
//  */
// router.get('/rental-trends', async (req, res) => {
//     try {
//         const now = new Date();
//         const startDate = new Date(now);
//         startDate.setDate(startDate.getDate() - 30); // Last 30 days

//         // Get daily active and completed rentals
//         const rentalData = await Request.aggregate([
//             {
//                 $match: {
//                     createdAt: { $gte: startDate }
//                 }
//             },
//             {
//                 $project: {
//                     dateStr: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
//                     isActive: {
//                         $in: ["$status", ["pending", "approved"]]
//                     },
//                     isCompleted: {
//                         $in: ["$status", ["done", "returned"]]
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$dateStr",
//                     active: { $sum: { $cond: ["$isActive", 1, 0] } },
//                     completed: { $sum: { $cond: ["$isCompleted", 1, 0] } }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     date: "$_id",
//                     active: 1,
//                     completed: 1
//                 }
//             },
//             { $sort: { date: 1 } }
//         ]);

//         res.json({ success: true, data: rentalData });
//     } catch (error) {
//         console.error('Error fetching rental trends:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

// /**
//  * @route   GET /api/dashboard/rating-distribution
//  * @desc    Get rating distribution (1-5 stars)
//  * @access  Private (Admin)
//  */
// router.get('/rating-distribution', async (req, res) => {
//     try {
//         const ratingDistribution = await Review.aggregate([
//             { $match: { isDeleted: false } },
//             {
//                 $group: {
//                     _id: "$rating",
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     rating: { $concat: [{ $toString: "$_id" }, "★"] },
//                     count: 1
//                 }
//             },
//             { $sort: { rating: -1 } }
//         ]);

//         // Make sure all ratings 1-5 are represented
//         const ratings = ["5★", "4★", "3★", "2★", "1★"];
//         const formattedData = ratings.map(rating => {
//             const found = ratingDistribution.find(r => r.rating === rating);
//             return {
//                 rating,
//                 count: found ? found.count : 0
//             };
//         });

//         res.json({ success: true, data: formattedData });
//     } catch (error) {
//         console.error('Error fetching rating distribution:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

// /**
//  * @route   GET /api/dashboard/category-distribution
//  * @desc    Get products by category distribution
//  * @access  Private (Admin)
//  */
// router.get('/category-distribution', async (req, res) => {
//     try {
//         const categoryDistribution = await Product.aggregate([
//             {
//                 $group: {
//                     _id: "$category",
//                     value: { $sum: 1 }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     name: "$_id",
//                     value: 1
//                 }
//             },
//             { $sort: { value: -1 } },
//             { $limit: 4 } // Get top 4 categories
//         ]);

//         res.json({ success: true, data: categoryDistribution });
//     } catch (error) {
//         console.error('Error fetching category distribution:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

// export default router;