import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import Review from "../models/review.model";

const redis = new Redis();
const voteQueue = new Queue('batch-processor', { connection: redis })

export const addToBatch = async (queueName, id, userId, delay = 30000) => {
    const userKey = `${queueName}:${id}`
    const alreadyVoted = await redis.hexists(userKey, userId);
    if (alreadyVoted) return;

    await redis.hset(userKey, data.userId, 1);
    await voteQueue.add(queueName, id, { delay })
}

const worker = new Worker('batch-processor', async job => {
    const { id } = job.id;
    const voteKey = `${job.name}:${id}`;
    const votes = await redis.hgetall(voteKey);
    const userIds = Object.keys(votes);
    if (userIds.length > 0) {
        let updateField;
        if (job.name === 'helpful-vote') updateField = 'helpfulCount'

        await Review.updateOne({ _id: id }, {
            $inc: { [updateField]: userIds.length },
            $addToSet: { [helpfulUsers]: userIds }
        })

        await redis.del(voteKey)
    }
}, { connection: redis });

