import { inspectionService } from './inspection-service';
import {
  processSyncQueue,
  getPendingDraftCount,
  getPendingDrafts,
} from './offline-sync-service';

export async function syncPendingDrafts() {
  return processSyncQueue((objectId, payload) =>
    inspectionService.saveExecution(objectId, payload),
  );
}

export { getPendingDraftCount, getPendingDrafts };
