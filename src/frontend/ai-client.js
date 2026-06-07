(function(root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.GeoAIClient = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(root) {
  function extractChatMessageContent(data) {
    const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    return typeof content === 'string' ? content : '';
  }

  function requireGeneratedContent(content, label) {
    if (typeof content !== 'string' || !content.trim()) {
      throw new Error(`${label}返回空内容`);
    }
    return content.trim();
  }

  function extractRequiredChatContent(data, contextLabel = 'AI response') {
    return requireGeneratedContent(extractChatMessageContent(data), contextLabel);
  }

  function extractStreamDeltaContent(data) {
    const content = data && data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content;
    return typeof content === 'string' ? content : '';
  }

  function buildChatPayload(options = {}) {
    const maxTokens = options.maxTokens != null ? options.maxTokens : options.max_tokens;
    const payload = {
      model: options.model,
      messages: options.messages,
    };

    if (maxTokens != null) payload.max_tokens = maxTokens;
    if (options.temperature != null) payload.temperature = options.temperature;
    if (options.stream != null) payload.stream = options.stream;

    return payload;
  }

  function getFetch(fetchImpl) {
    const resolvedFetch = fetchImpl || root.fetch;
    if (typeof resolvedFetch !== 'function') {
      throw new Error('fetch is unavailable');
    }
    return resolvedFetch;
  }

  function normalizeAIError(error, fallbackMessage = 'AI 请求失败') {
    if (error instanceof Error) return error;
    return new Error(error ? String(error) : fallbackMessage);
  }

  async function callChatCompletion(options = {}) {
    const fetchImpl = getFetch(options.fetchImpl);
    const response = await fetchImpl(options.endpoint || '/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: options.signal,
      body: JSON.stringify(options.payload || buildChatPayload(options)),
    });

    if (!response.ok) {
      throw new Error(`${options.httpErrorPrefix || 'HTTP'} ${response.status}`);
    }

    return response;
  }

  async function fetchChatCompletionJson(options = {}) {
    const response = await callChatCompletion(options);
    return response.json();
  }

  async function checkApiStatus(options = {}) {
    const fetchImpl = getFetch(options.fetchImpl);
    const response = await fetchImpl(options.endpoint || '/api/status');
    return response.json();
  }

  return {
    extractChatMessageContent,
    requireGeneratedContent,
    extractRequiredChatContent,
    extractStreamDeltaContent,
    buildChatPayload,
    normalizeAIError,
    callChatCompletion,
    fetchChatCompletionJson,
    checkApiStatus,
  };
});
