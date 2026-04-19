export function shouldRequireReview(params: { normalizedCount: number; hasCommittedDuplicate: boolean }) {
  return params.normalizedCount === 0 || params.hasCommittedDuplicate;
}

export function isIdempotentCommitAlreadyDone(params: { hasCommittedLog: boolean }) {
  return params.hasCommittedLog;
}
