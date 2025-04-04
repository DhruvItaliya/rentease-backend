import { Worker } from "bullmq";
import { redis } from "./queue.service.js";
import { updateHelpfulVotes } from "./helpfulVote.service.js";
import { updateWishlist } from "./wishlist.service.js";

const worker = new Worker(
    "batch-processor",
    async job => {
        console.log('Worker')
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

export default worker;
