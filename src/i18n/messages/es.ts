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
    howItsBuilt: "Cómo está construido",
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
    coreStack: "Stack principal",
  },
  contactCta: {
    title: "¿Buscas a alguien para un rol de datos?",
    email: "Escríbeme",
    resume: "Pedir mi CV",
    navResume: "CV",
    sticky: "Opciones de contacto",
  },
  featured: {
    eyebrow: "Trabajo destacado",
    title: "Tres roles, primero los resultados",
    details: "Detalles",
    fullWriteup: "Detalle completo",
  },
  discover: {
    eyebrow: "Filtra por habilidad",
    title: "¿Buscas una habilidad específica?",
    subtitle:
      "Busca una herramienta o un rol, o parte desde una de estas. La lista se reduce a la experiencia que coincide.",
  },
  career: {
    title: "Mi carrera de un vistazo",
    present: "Presente",
    lanes: {
      teaching: "Enseñanza",
      founding: "Emprendimiento",
      data: "Ingeniería de datos",
      platform: "Plataforma de datos",
    },
  },
  storyTeaser: {
    eyebrow: "Mi historia",
    title: "De las salas de clase a las plataformas de datos",
    cta: "Leer mi historia",
  },
  landingContact: {
    more: "Todos los datos de contacto",
  },
  search: {
    placeholder: "Busca por habilidad, herramienta o rol…",
    inputLabel: "Buscar experiencias por etiqueta",
    suggestionsLabel: "Sugerencias de etiquetas",
    empty: "Empieza a escribir para ver sugerencias…",
    noMatch: 'Ninguna etiqueta coincide con "{query}".',
    closest: "Lo más parecido:",
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
    yearsOfExperience: "Años en ingeniería",
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
      "Mi camino en tres actos: antes de la tecnología, la elección y la carrera en ingeniería.",
    eyebrow: "Mi historia",
    title: "El camino que me trajo hasta aquí",
    intro:
      "Tres actos, en orden. Los dos primeros explican de dónde vienen la comunicación y la resiliencia; el tercero es donde se encontraron con las herramientas.",
    actOne: {
      eyebrow: "Acto 1",
      title: "Antes de la terminal",
      intro:
        "Natación, universidad, hotelería y enseñanza: la base, no el preludio.",
      emptyTitle: "Las experiencias personales se están redactando.",
      emptyHint:
        "Las entradas previas a la tecnología aparecerán aquí a medida que se documenten.",
    },
    actTwo: {
      eyebrow: "Acto 2",
      title: "La elección",
      paragraphs: [
        "No hubo un momento único de conversión. Estudiaba computación desde 2016, y durante años **la enseñanza y la ingeniería avanzaron en paralelo**: salas de clase de día, código para la carrera de noche.",
        "La verdadera decisión fue sobre cuál construir una carrera. Enseñar me demostró que podía explicar cosas complejas a cualquiera. El trabajo analítico que asumí en School of Tech me mostró que quería **construir los sistemas**, no solo explicarlos. Así que elegí la ingeniería, y me traje la enseñanza conmigo.",
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
      resultLabel: "Resultado:",
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
    glance: {
      title: "En resumen",
      role: "Rol buscado",
      experience: "Experiencia",
      experienceValue: "{years}+ años en ingeniería",
      stack: "Stack principal",
      location: "Ubicación",
      locationValue: "Austin, TX (hora central)",
      authorization: "Autorización de trabajo",
      education: "Educación",
      educationValue:
        "Ingeniería Civil Informática, Universidad Adolfo Ibáñez (Chile), 2021",
    },
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
  howItsBuilt: {
    metaTitle: "Cómo está construido | {name}",
    metaDescription:
      "La ingeniería detrás de este sitio: contenido validado, un build estático bilingüe y un CI que prueba rutas, accesibilidad y rendimiento antes de publicar.",
    eyebrow: "Cómo está construido",
    title: "Construido como un pequeño producto de datos",
    intro:
      "El contenido vive en archivos versionados con un esquema, cada build lo valida y cada cambio pasa los mismos controles antes de llegar a producción. Así funciona, y estos son sus trade-offs.",
    pipelineTitle: "De las notas a una página publicada",
    pipeline: [
      {
        title: "Notas de origen",
        body: "Cada rol parte como un documento Markdown. Una skill de Claude convierte esas notas en dos archivos JSON: un vocabulario controlado de etiquetas y las experiencias.",
      },
      {
        title: "Contratos",
        body: "Esquemas Zod definen ambos archivos y los tipos de TypeScript se infieren de ellos, así que datos, tipos y validador no pueden desalinearse.",
      },
      {
        title: "Reglas entre archivos",
        body: "Un validador revisa lo que un esquema no puede: cada etiqueta existe en el tipo correcto, los ids son únicos y las listas del código (alias de búsqueda, etiquetas iniciales, carriles de la línea de tiempo) apuntan a datos reales.",
      },
      {
        title: "Build estático",
        body: "Si el contenido no es válido, el build falla con una lista legible de problemas. Si es válido, se convierte en HTML en inglés y español, con enlaces canónicos, hreflang, sitemap e imágenes para compartir.",
      },
      {
        title: "Publicar y medir",
        body: "El sitio corre como archivos estáticos en Render detrás de Cloudflare, sin servidor ni base de datos. Umami registra un conjunto pequeño de eventos tipados, como por qué habilidades filtran los visitantes.",
      },
    ],
    gatesTitle: "Lo que cada cambio debe pasar",
    gates: [
      {
        title: "Lint y tipos",
        body: "ESLint y TypeScript estricto, incluidas las claves de traducción tipadas, así que una traducción faltante es un error de compilación.",
      },
      {
        title: "Validación de contenido",
        body: "Los esquemas y las reglas entre archivos, ejecutados por separado antes del build.",
      },
      {
        title: "Pruebas unitarias",
        body: "Cálculo de fechas, años de experiencia con períodos superpuestos fusionados, orden, puntaje de roles relacionados, alias de búsqueda y tolerancia a errores de tipeo, y pruebas que rompen los datos a propósito para demostrar que el validador lo detecta.",
      },
      {
        title: "Pruebas end-to-end",
        body: "Cada página en ambos idiomas responde 200 con el idioma, el enlace canónico y el hreflang correctos, y se hidrata sin errores, con y sin movimiento reducido.",
      },
      {
        title: "Accesibilidad",
        body: "Chequeos automáticos de contraste en tema oscuro y claro en cada página. Su primera ejecución encontró fallas reales; los tokens de color ahora se calculan para superar 4,6:1 en cada superficie.",
      },
      {
        title: "Presupuesto de Lighthouse",
        body: "Si accesibilidad y SEO bajan de 95 o buenas prácticas de 90, el build falla; el rendimiento se sigue como advertencia.",
      },
    ],
    decisionsTitle: "Decisiones y sus trade-offs",
    tradeoffLabel: "Trade-off:",
    decisions: [
      {
        title: "Export estático, sin servidor",
        body: "El contenido cambia cuando yo lo edito, así que cada página se prerenderiza y se sirve como archivo.",
        tradeoff: "no hay lógica por solicitud; lo dinámico ocurre en el build o en el navegador.",
      },
      {
        title: "Una capa de i18n propia y pequeña",
        body: "El inglés queda en /story y el español en /es/story. La librería habitual lo resuelve con middleware, que un sitio estático no puede ejecutar, así que el traductor y los helpers de rutas son unas 200 líneas de código tipado.",
        tradeoff: "no hay reglas de plural, y por ahora las páginas en español reciben su atributo de idioma desde un script previo al render.",
      },
      {
        title: "Archivos con contratos, no un CMS",
        body: "Dos archivos JSON en git son todo el modelo de contenido: se pueden comparar, revisar y validar en cada build.",
        tradeoff: "editar requiere un pull request, y el paso de JSON crudo a datos tipados es una suposición documentada respaldada por la validación.",
      },
      {
        title: "Servidor por defecto",
        body: "Las páginas se renderizan en el servidor; solo la búsqueda, la grilla y el panel corren en el navegador. Lo que depende de la fecha de hoy se renderiza en el build, así el HTML y la página hidratada no pueden diferir.",
        tradeoff: "la parte interactiva todavía recibe más datos de los que muestra. Reducir eso es el siguiente paso.",
      },
      {
        title: "CV a pedido",
        body: "No hay PDF para descargar. El sitio entrega lo que necesita una primera revisión, y el CV llega por correo, adaptado al rol.",
        tradeoff: "un paso más para quien recluta, a cambio de una conversación.",
      },
      {
        title: "La accesibilidad se prueba",
        body: "El contraste se mide, el texto nunca baja de 12px, las zonas táctiles miden al menos 24px y el movimiento respeta la preferencia de movimiento reducido.",
        tradeoff: "una paleta de etiquetas un poco menos saturada.",
      },
    ],
    sourceTitle: "Lee el código",
    sourceBody:
      "El repositorio es público: los contratos de datos, las pruebas y el workflow de CI están ahí, con una descripción de la arquitectura en el README.",
    sourceCta: "Ver el repositorio",
  },
  notFound: {
    code: "404",
    title: "No encontrado",
    body: "Esa página no existe (aún).",
    back: "← Volver al Explorador",
  },
};
