import { getImage } from 'astro:assets'
import alain from '../../assets/team/alain-sobre.jpg'
import { site } from '../../data/site'
import type { Lang } from '../../i18n'

/** JSON-LD de Alain Castellat para la página «Sobre nosotros» */
export async function alainJsonLd(lang: Lang, base: URL | undefined) {
  const img = await getImage({ src: alain, width: 800, format: 'jpg' })
  const en = lang === 'en'
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${site.url}/#alain-castellat`,
    name: 'Alain Castellat',
    honorificSuffix: 'APRN, FNP-C',
    jobTitle: en
      ? 'Founder and Medical Director, Nurse Practitioner'
      : 'Fundador y director médico, Nurse Practitioner',
    image: new URL(img.src, base ?? site.url).href,
    worksFor: { '@id': `${site.url}/#clinic` },
    knowsLanguage: ['es', 'en'],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: "Bachelor's Degree in Nursing",
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: "Master's Degree in Healthcare Administration",
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: "Master's in Nursing",
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'license',
        name: 'Advanced Practice Registered Nurse (APRN), Family Nurse Practitioner (FNP-C)',
        recognizedBy: { '@type': 'State', name: 'Florida' },
      },
    ],
  }
}
