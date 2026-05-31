const { createServer } = require('./src/app');
const { normalizeConfig } = require('./src/config');
const { validateChatPayload } = require('./src/chat/validation');
const { buildChatCompletionUrl } = require('./src/chat/proxy');

if (require.main === module) {
  const config = normalizeConfig();
  const server = createServer(config);

  server.on('error', error => {
    console.error(`Failed to start server on ${config.host}:${config.port}:`, error.message);
    process.exitCode = 1;
  });

  server.listen(config.port, config.host, () => {
    console.log(`GEO Workbench running at http://${config.host}:${config.port}`);
  });
}

module.exports = {
  createServer,
  normalizeConfig,
  validateChatPayload,
  buildChatCompletionUrl,
};
