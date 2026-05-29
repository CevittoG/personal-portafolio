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
    title: "Sebastián Gutiérrez — Portafolio",
    description:
      "Portafolio interactivo. Busca por habilidad, herramienta o rol para descubrir las experiencias que coinciden con lo que estás buscando.",
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
    introVerb: "Trabajo como",
    positioningStatement:
      "Construyo sistemas de datos que aguantan escala real, y me aseguro de que la gente que depende de ellos entienda de verdad qué hacen.",
    cta: {
      explore: "Explorar mi experiencia",
      story: "Leer mi historia",
    },
    logos: {
      regionLabel: "Tecnologías con las que trabajo",
    },
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
    yearsOfExperience: "Años de experiencia",
    technologies: "Tecnologías",
    industries: "Industrias",
    projectsAndRoles: "Proyectos y roles",
    sentence:
      "Mostrando {entries} experiencias a lo largo de {years} años, {technologies} tecnologías, {industries} industrias.",
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
    metaTitle: "Mi historia — {name}",
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
    metaTitle: "Contacto — {name}",
    metaDescription:
      "Ponte en contacto: disponibilidad, qué busco y la forma más rápida de llegar a mí.",
    eyebrow: "Contacto",
    title: "Hablemos",
    availability: {
      open: "Abierto a oportunidades",
      closed: "Actualmente no estoy buscando",
    },
    availabilityNote:
      "Con base en Austin TX, abierto a roles remotos en zonas horarias de las Américas y la UE.",
    lookingForTitle: "Qué estoy buscando",
    lookingForBody:
      "Ingeniería senior de datos, plataforma o backend; idealmente en un sitio donde el problema humano importe tanto como el técnico. Cómodo como primer ingeniero de un equipo o como el ingeniero tranquilo de uno grande.",
    primaryAction: "Envíame un correo",
    resumeAction: "Descargar CV completo (PDF)",
  },
};
