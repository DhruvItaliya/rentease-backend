import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import { updateHelpfulVotes } from "./helpfulVote.service.js";
import { updateWishlist } from "./wishlist.service.js";

const redis = new Redis({ maxRetriesPerRequest: null });
const queue = new Queue("batch-processor", { connection: redis });

export const addToBatch = async (queueName, id, dataId, delay = 10000) => {
    const key = `${queueName}:${id}`;
    const alreadyVoted = await redis.hexists(key, dataId);
    if (alreadyVoted) return dataId;

    await redis.hset(key, dataId, 1);
    await queue.add(queueName, id, { delay });
};


const worker = new Worker(
    "batch-processor",
    async job => {
        const id = job.data;
        const key = `${job.name}:${id}`;
        const result = await redis.hgetall(key);
        const dataIds = Object.keys(result);

        console.log("Processing job:", key);
        console.log("Data:", result);

        if (dataIds.length > 0) {
            if (job.name === "helpful-vote") await updateHelpfulVotes(id, dataIds);
            else if (job.name === "wishlist") await updateWishlist(id, dataIds);

            await redis.del(key);
        }
    },
    { connection: redis }
);

worker.on("completed", (job) => {
    console.log(`${job.queueName}:${job.data} is completed!`);
});


