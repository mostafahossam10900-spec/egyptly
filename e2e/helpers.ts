import { expect, type Page } from '@playwright/test'

const MAILPIT = process.env.MAILPIT_URL ?? 'http://127.0.0.1:54324'

export const uniqueEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.test`
export const PASSWORD = 'Egyptly2026'

export function futureDate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Polls the local Mailpit inbox for the newest email to `to` whose subject matches, and returns its first /auth/confirm link. */
export async function emailLink(to: string, subject: RegExp): Promise<string> {
  for (let i = 0; i < 30; i++) {
    const res = await fetch(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`)
    const body = (await res.json()) as { messages: { ID: string; Subject: string }[] }
    const msg = body.messages.find((m) => subject.test(m.Subject))
    if (msg) {
      const full = (await (await fetch(`${MAILPIT}/api/v1/message/${msg.ID}`)).json()) as { HTML: string }
      const m = /href="([^"]*\/auth\/confirm\?[^"]+)"/.exec(full.HTML)
      if (m) return m[1].replaceAll('&amp;', '&')
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error(`No email "${subject}" for ${to}`)
}

export async function signUpAndConfirm(page: Page, email: string, first = 'Mariam', last = 'Hassan') {
  await page.goto('/signup')
  await page.getByLabel('First name').fill(first)
  await page.getByLabel('Last name').fill(last)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(PASSWORD)
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()

  // Not confirmed yet → cannot log in.
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(PASSWORD)
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page.getByText('Please confirm your email first.')).toBeVisible()

  const link = await emailLink(email, /Confirm your Egyptly account/)
  await page.goto(link)
  await page.getByRole('button', { name: 'It’s me' }).click()
  await expect(page.getByRole('heading', { name: 'Email confirmed' })).toBeVisible()
}

export async function login(page: Page, email: string, password = PASSWORD) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page.getByRole('heading', { name: 'My trips' })).toBeVisible()
}

export async function logout(page: Page) {
  const menu = page.getByRole('button', { name: 'Menu' })
  if (await menu.isVisible()) await menu.click()
  await page.getByRole('button', { name: /Log out/ }).first().click()
  await expect(page.getByText('You have been logged out.')).toBeVisible()
}

export async function next(page: Page) {
  await page.getByTestId('wizard-next').click()
}

export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
}
