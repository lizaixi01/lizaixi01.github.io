// The template's interaction hooks remain local; no analytics service is enabled.
export function trackSiteEvent(_event: string, _properties: Record<string, unknown> = {}) {}
export function getDestinationType(href: string | null): string | null {
  if (!href) return null
  if (href.startsWith('/')) return 'internal'
  return href.startsWith('https://github.com/') ? 'github' : 'external'
}
