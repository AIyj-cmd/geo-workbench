function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
    return 'messages must be a non-empty array with at most 50 items';
  }

  const allowedRoles = new Set(['system', 'user', 'assistant']);
  for (const message of messages) {
    if (!message || typeof message !== 'object' || Array.isArray(message)) {
      return 'each message must be an object';
    }
    if (!allowedRoles.has(message.role)) {
      return 'message.role must be one of system, user, assistant';
    }
    if (typeof message.content !== 'string' || message.content.length === 0) {
      return 'message.content must be a non-empty string';
    }
    if (message.content.length > 200000) {
      return 'message.content exceeds the maximum length';
    }
  }
  return null;
}

function optionalNumber(value, fieldName, min, max) {
  if (value === undefined) return { value: undefined };
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    return { error: `${fieldName} must be a number between ${min} and ${max}` };
  }
  return { value };
}

function validateChatPayload(payload, config) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { error: 'request body must be a JSON object' };
  }

  if (typeof payload.model !== 'string' || !config.allowedChatModels.includes(payload.model)) {
    return { error: `model must be one of: ${config.allowedChatModels.join(', ')}` };
  }

  const messageError = validateMessages(payload.messages);
  if (messageError) return { error: messageError };

  const maxTokens = optionalNumber(payload.max_tokens, 'max_tokens', 1, 65536);
  if (maxTokens.error) return { error: maxTokens.error };

  const temperature = optionalNumber(payload.temperature, 'temperature', 0, 2);
  if (temperature.error) return { error: temperature.error };

  const topP = optionalNumber(payload.top_p, 'top_p', 0, 1);
  if (topP.error) return { error: topP.error };

  const presencePenalty = optionalNumber(payload.presence_penalty, 'presence_penalty', -2, 2);
  if (presencePenalty.error) return { error: presencePenalty.error };

  const frequencyPenalty = optionalNumber(payload.frequency_penalty, 'frequency_penalty', -2, 2);
  if (frequencyPenalty.error) return { error: frequencyPenalty.error };

  if (payload.stream !== undefined && typeof payload.stream !== 'boolean') {
    return { error: 'stream must be a boolean' };
  }

  const sanitized = {
    model: payload.model,
    messages: payload.messages.map(message => ({
      role: message.role,
      content: message.content,
    })),
    stream: payload.stream === true,
  };

  if (maxTokens.value !== undefined) sanitized.max_tokens = maxTokens.value;
  if (temperature.value !== undefined) sanitized.temperature = temperature.value;
  if (topP.value !== undefined) sanitized.top_p = topP.value;
  if (presencePenalty.value !== undefined) sanitized.presence_penalty = presencePenalty.value;
  if (frequencyPenalty.value !== undefined) sanitized.frequency_penalty = frequencyPenalty.value;

  if (payload.stop !== undefined) {
    if (typeof payload.stop === 'string') {
      sanitized.stop = payload.stop;
    } else if (Array.isArray(payload.stop) && payload.stop.length <= 4 && payload.stop.every(item => typeof item === 'string')) {
      sanitized.stop = payload.stop;
    } else {
      return { error: 'stop must be a string or an array of up to 4 strings' };
    }
  }

  return { value: sanitized };
}

module.exports = {
  validateChatPayload,
};
