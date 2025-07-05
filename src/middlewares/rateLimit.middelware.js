import Redis from "ioredis";
import { asyncErrorHandler, sendError } from "../services/common.service.js";
const redis = new Redis();

export const fixedWindowRateLimit = asyncErrorHandler(async (req, res, next) => {
    const ip = req.ip
    const key = `fixed_rate_limit:${ip}`
    const WINDOW_SIZE_IN_SEC = 5;
    const MAX_REQUESTS = 1000;
    let requests = await redis.get(key);
    if (!requests) {
        redis.set(key, 1, 'EX', WINDOW_SIZE_IN_SEC)
        requests = 1;
    }
    else {
        requests = await redis.incr(key);
    }
    if (requests > MAX_REQUESTS) {
        return sendError(next, "You reached Max Request Limit!", 429);
    }
    next();
})