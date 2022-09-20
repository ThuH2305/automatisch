import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import flowQueue from '../queues/flow';
import actionQueue from '../queues/action';

const serverAdapter = new ExpressAdapter();

const createBullBoardHandler = async (serverAdapter: ExpressAdapter) => {
  createBullBoard({
    queues: [new BullMQAdapter(flowQueue), new BullMQAdapter(actionQueue)],
    serverAdapter: serverAdapter,
  });
};

export { createBullBoardHandler, serverAdapter };
