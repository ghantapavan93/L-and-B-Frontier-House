import { spawn } from 'node:child_process'
import type { ChildProcess } from 'node:child_process'

/**
 * Boots the production build and waits for it to answer.
 *
 * The structural tests must run against real HTTP responses: a component test cannot prove
 * that a wholesale price is absent from the bytes a crawler receives, and that absence is
 * the property being asserted.
 */

export const TEST_PORT = 3111
export const BASE_URL = `http://127.0.0.1:${TEST_PORT}`
export const TEST_SESSION_SECRET = 'structural-test-secret'

let server: ChildProcess | undefined

async function waitForServer(timeoutMs = 90_000): Promise<void> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const response = await fetch(BASE_URL, { redirect: 'manual' })
      if (response.status < 500) return
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 400))
  }
  throw new Error(`Test server did not become ready on ${BASE_URL}`)
}

export async function setup(): Promise<void> {
  server = spawn('npx', ['next', 'start', '-p', String(TEST_PORT)], {
    shell: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      LB_SESSION_SECRET: TEST_SESSION_SECRET,
      LB_SITE_URL: BASE_URL,
    },
  })

  await waitForServer()
}

export async function teardown(): Promise<void> {
  if (!server?.pid) return

  if (process.platform === 'win32') {
    // `next start` spawns a child; killing the shell alone leaves the port bound.
    spawn('taskkill', ['/pid', String(server.pid), '/f', '/t'], { stdio: 'ignore' })
  } else {
    server.kill('SIGTERM')
  }

  await new Promise((resolve) => setTimeout(resolve, 500))
}
