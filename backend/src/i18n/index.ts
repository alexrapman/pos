// backend/src/i18n/index.ts
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

export async function setupI18n() {
    await i18next
        .use(Backend)
        .init({
            backend: {
                loadPath: './locales/{{lng}}/{{ns}}.json'
            },
            fallbackLng: 'en',
            ns: ['email'],
            defaultNS: 'email'
        });
}