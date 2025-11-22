import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { balanceHistoryQueue } from "./queues/balance-history.queue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(balanceHistoryQueue)],
  serverAdapter: serverAdapter,
});

export default serverAdapter;
