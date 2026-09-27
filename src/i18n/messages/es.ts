import type { Messages } from "./en";

/**
 * Spanish message catalogue (plan §18).
 *
 * Hand-authored, not machine-translated. Style guide: same
 * professional-conversational register as English (plan §13). Tutea, not
 * ustedea — should sound like the same person, just in Spanish. Reviewed
 * by a fluent speaker before merge.
 */
export const es: Messages = {
  meta: {
    title:
      "{name} | Ingeniero Senior de Plataformas de Datos (Python, Snowflake, Kubernetes)",
    description:
      "Ingeniero senior de plataformas de datos en Austin, TX. {years}+ años construyendo pipelines de ingesta, APIs y plataformas de datos con Python, Snowflake y Kubernetes.",
  },
  nav: {
    explorer: "Explorar",
    story: "Mi historia",
    contact: "Contacto",
    themeToDark: "Cambiar a tema oscuro",
    themeToLight: "Cambiar a tema claro",
    languageLabel: "Idioma",
    primary: "Principal",
    site: "Navegación del sitio",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  footer: {
    rights: "© {year} {name}. Todos los derechos reservados.",
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Correo",
  },
  hero: {
    greeting: "Hola, soy",
    role: "Ingeniero Senior de Plataformas de Datos",
    proofLine: "Ingeniero contratista en Apple · {years}+ años construyendo sistemas de datos · Austin, TX",
    positioningStatement:
      "Construyo plataformas de datos que aguantan a escala, y me aseguro de que la gente que depende de ellas entienda qué hacen.",
    resumePrompt: "¿Estás contratando?",
    resumeLink: "Pide mi CV",
    cta: {
      explore: "Explorar mi experiencia",
      story: "Leer mi historia",
    },
    logos: {
      regionLabel: "Tecnologías con las que trabajo",
    },
  },
  contactCta: {
    title: "¿Buscas a alguien para un rol de datos?",
    email: "Escríbeme",
    resume: "Pedir mi CV",
    navResume: "CV",
    sticky: "Opciones de contacto",
  },
  discover: {
    eyebrow: "Descubre",
    title: "¿Qué estás buscando?",
    subtitle:
      "Busca por habilidad, herramienta o rol. Las tarjetas y estadísticas se ajustan a lo que selecciones.",
  },
  search: {
    placeholder: "Busca por habilidad, herramienta o rol…",
    inputLabel: "Buscar experiencias por etiqueta",
    suggestionsLabel: "Sugerencias de etiquetas",
    empty: "Empieza a escribir para ver sugerencias…",
    noMatch: 'Ninguna etiqueta coincide con "{query}".',
    commonStartingPoints: "Puntos de partida frecuentes",
    commonSearches: "Búsquedas frecuentes",
    rolesToStartWith: "Empieza por un rol",
    orBrowseByType: "O elige una etiqueta",
  },
  filters: {
    region: "Filtros activos",
    clearAll: "Limpiar todo",
    removeTag: "Quitar {label}",
  },
  stats: {
    region: "Estadísticas",
    yearsOfExperience: "Años en ingeniería",
    technologies: "Tecnologías",
    projectsAndRoles: "Proyectos y roles",
  },
  grid: {
    sortLabel: "Ordenar",
    sortRecent: "Más recientes",
    sortRelevant: "Más relevantes",
    showing: "Mostrando {visible} de {total}",
    download: "Descargar perfil filtrado",
    emptyTitle: "Ninguna experiencia coincide con estos filtros.",
    emptyHint: "Prueba a quitar una etiqueta o a ampliar tu búsqueda.",
    featuredInstead: "Destacadas en su lugar",
    viewDetails: "Ver detalles →",
  },
  card: {
    open: "Abrir detalles",
  },
  drawer: {
    close: "Cerrar",
    closeDrawer: "Cerrar panel",
    impact: "Impacto",
    tags: "Etiquetas",
    digDeeper: "Profundizar",
  },
  experience: {
    metaTitle: "{title} | {name}",
    duration: {
      year: "{n} año",
      years: "{n} años",
      month: "{n} mes",
      months: "{n} meses",
    },
    sidebar: {
      company: "Empresa",
      institution: "Institución",
      context: "Contexto",
      period: "Periodo",
      type: "Tipo",
      impact: "Impacto",
      tags: "Etiquetas",
      links: "Enlaces",
    },
    fullWriteupSoon: "El detalle completo aparecerá pronto.",
    related: {
      title: "Experiencia relacionada",
      view: "Ver →",
    },
    backToExplorer: "← Volver a Explorar",
  },
  story: {
    metaTitle: "Mi historia | {name}",
    metaDescription:
      "Una narrativa en tres actos: antes de la tecnología, el giro y la carrera técnica.",
    eyebrow: "Mi historia",
    title: "El camino que me trajo hasta aquí",
    intro:
      "Tres actos, en orden. Los dos primeros explican de dónde vienen la comunicación y la resiliencia; el tercero es donde se encontraron con las herramientas.",
    actOne: {
      eyebrow: "Acto 1",
      title: "Antes de la terminal",
      intro:
        "Años de hostelería, enseñanza y viajes: la base, no el preludio.",
      emptyTitle: "Las experiencias personales se están redactando.",
      emptyHint:
        "Las entradas previas a la tecnología aparecerán aquí a medida que se documenten.",
    },
    actTwo: {
      eyebrow: "Acto 2",
      title: "El giro",
      paragraphs: [
        "En algún momento la pregunta dejó de ser **«qué sigue»** y empezó a ser **«qué quiero construir durante la próxima década»**.",
        "La respuesta fueron los sistemas. No porque amara el código en abstracto, sino porque había pasado años explicando cosas complejas a personas que no tenían tiempo de profundizar, y el software era la versión más apalancada de ese trabajo que pude encontrar.",
      ],
    },
    actThree: {
      eyebrow: "Acto 3",
      title: "Construyendo sistemas",
      intro:
        "Trabajo profesional de ingeniería: infraestructura de datos, herramientas internas y los productos que las rodean.",
      emptyTitle: "Aquí aparecerán los roles técnicos.",
      emptyHint:
        "Cada rol enlaza a su página completa cuando estés listo para ver el detalle.",
    },
    now: {
      eyebrow: "Ahora",
      title: "Lo que sigue",
      body: "Estoy buscando el siguiente rol donde pueda seguir haciendo esto: construir sistemas de datos y backend que aguanten, y traducir entre quienes los construyen y quienes dependen de ellos. Si encaja con lo que estás contratando, la página de contacto es la ruta más rápida.",
      cta: "Hablemos",
    },
  },
  contact: {
    metaTitle: "Contacto | {name}",
    metaDescription:
      "Disponibilidad, autorización de trabajo, qué busco y la forma más rápida de contactarme o pedir mi CV.",
    eyebrow: "Contacto",
    title: "Hablemos",
    availability: {
      open: "Abierto a oportunidades",
      closed: "Actualmente no estoy buscando",
    },
    availabilityNote:
      "Con base en Austin, TX (hora central). Abierto a roles remotos en zonas horarias de las Américas y la UE.",
    workAuthorization:
      "Residente permanente en EE. UU. (green card). Autorizado para trabajar con cualquier empleador en EE. UU., sin necesidad de patrocinio de visa, ni ahora ni en el futuro.",
    lookingForTitle: "Qué estoy buscando",
    lookingForBody:
      "Roles senior de plataformas de datos o ingeniería de datos, con trabajo de backend bienvenido; idealmente en un sitio donde el problema humano importe tanto como el técnico. Cómodo como primer ingeniero de un equipo o como el ingeniero tranquilo de uno grande.",
    primaryAction: "Envíame un correo",
    resume: {
      title: "¿Quieres mi CV?",
      body: "Adapto mi CV a cada rol, así que lo envío a pedido. Cuéntame sobre el puesto y te respondo con una versión hecha para él.",
      action: "Pedir mi CV",
      emailSubject: "Solicitud de CV: [rol] en [empresa]",
      emailBody:
        "Hola Sebastián,\n\nMe gustaría ver tu CV para este puesto:\n\nRol:\nEmpresa:\nEnlace a la oferta:\nUbicación o remoto:\n\nAlgo más que debería saber:\n\nGracias,\n",
    },
  },
  notFound: {
    code: "404",
    title: "No encontrado",
    body: "Esa página no existe (aún).",
    back: "← Volver al Explorador",
  },
};
