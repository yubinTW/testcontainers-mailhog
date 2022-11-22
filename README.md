# Testcontainers-Mailhog

[![NPM version](https://img.shields.io/npm/v/testcontainers-mailhog.svg?style=flat)](https://www.npmjs.com/package/testcontainers-mailhog)

A testcontainers for mailhog

## Install

https://www.npmjs.com/package/testcontainers-mailhog

```
npm i -D testcontainers-mailhog
```

## Configuration

[Reference](https://github.com/testcontainers/testcontainers-node#configuration)

### Logs

- `DEBUG=testcontainers` Enable testcontainers logs
- `DEBUG=testcontainers:containers` Enable container logs
- `DEBUG=testcontainers*` Enable all logs

### Testcontainers

- `TESTCONTAINERS_RYUK_DISABLED=true` Disable ryuk
- `RYUK_CONTAINER_IMAGE=registry.mycompany.com/mirror/ryuk:0.3.0` Custom image for ryuk

## Utility Methods of StartedMailhogContainer

- `.getAllMessages()` Lists all messages excluding message content
- `.getMessage(messageId)` Returns an individual message including message content
- `.deleteAllMessages()` Deletes all messages
- `.getMappedSmtpPort()` Get mapped smtp port, for configure smtp client
- `.getMappedApiPort()` Get mapped api port, if u want to invoke api manually

## Usage

Test with vitest

```typescript
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'

import {
  MailhogContainer,
  StartedMailhogContainer
} from '../src/testcontainers-mailhog'

describe('Mailing test', () => {
  let mailhogContainer: StartedMailhogContainer

  beforeAll(async () => {
    const imageName = 'harbor.yourcompany.com/mailhog'
    mailhogContainer = await new MailhogContainer(imageName).start()
  })

  afterAll(async () => {
    await mailhogContainer.stop()
  })

  afterEach(async () => {
    await mailhogContainer.deleteAllMessages()
  })

  test('some case with mailing', async () => {
    // const smtpUrl = `${mailhogContainer.getHost()}:${mailhogContainer.getMappedSmtpPort()}`
    // ...
  })
})
```

See [test cases](./test/testcontainers-mailhog.spec.ts) for the example with [nodemailer](https://github.com/nodemailer/nodemailer)
