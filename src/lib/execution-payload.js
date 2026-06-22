export function buildExecutionPayload({
  status,
  objectInfo,
  values,
  attachments,
  recommendation,
  result,
}) {
  return {
    status_uji: status,
    object_info: {
      location: objectInfo.location,
      is_recertification: objectInfo.is_recertification,
      technical_spec: objectInfo.technical_spec,
    },
    content_values: values,
    attachment_links: attachments,
    recommendation,
    result,
  };
}

export function buildExecutionWatchKey(state) {
  return JSON.stringify({
    values: state.values,
    objectInfo: state.objectInfo,
    attachments: state.attachments,
    recommendation: state.recommendation,
    result: state.result,
  });
}
