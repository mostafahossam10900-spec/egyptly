import { ButtonLink } from '../components/ui'
import { useAuth } from '../lib/auth'
import { useI18n } from '../lib/i18n'

export function ComingSoonPage({ kind }: { kind: 'guides' | 'ai' }) {
  const { t } = useI18n()
  const { session } = useAuth()
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 py-8">
      <p className="eyebrow">{t('coming.title')}</p>
      <h1 className="text-5xl">{kind === 'guides' ? t('coming.guidesTitle') : t('coming.aiTitle')}</h1>
      <p className="text-lg text-muted">{kind === 'guides' ? t('coming.guidesBody') : t('coming.aiBody')}</p>
      <div>
        <ButtonLink to={session ? '/dashboard' : '/'} variant="outline">
          {session ? t('coming.back') : t('nav.home')}
        </ButtonLink>
      </div>
    </div>
  )
}

export function NotFoundPage({ message }: { message?: string }) {
  const { t } = useI18n()
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-5xl">{t('state.notFoundTitle')}</h1>
      <p className="text-muted">{message ?? t('state.notFoundBody')}</p>
      <ButtonLink to="/" variant="outline">
        {t('nav.home')}
      </ButtonLink>
    </div>
  )
}
