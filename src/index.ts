#!/usr/bin/env node

import { setupCommander } from './commander';

async function main() {
  const program = setupCommander();
  await program.parseAsync();
}

main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});