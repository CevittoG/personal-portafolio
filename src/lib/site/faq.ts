import type { Locale } from "@/i18n/locale";
import { getEngineeringYears } from "./profile";

/**
 * Content of the FAQ page (`/faq`, `/es/faq`), the single source for the
 * page, its FAQPage JSON-LD and `/llms.txt`.
 *
 * Every lead and answer is a self-contained 40–60 word block that opens
 * with the answer, so an AI search engine can lift it without the page
 * around it (`tests/unit/faq.test.ts` enforces the length in English).
 * Facts here must already be true elsewhere on the site; Apple content
 * stays NDA-conservative (no specifics beyond what the Story already says).
 * `{years}` is replaced at build time from the same source as the hero.
 *
 * Authored here, not in the message catalogues, because the catalogues are
 * shipped to the browser and this copy is only ever rendered on the server.
 */
export type Localized = Record<Locale, string>;

export interface FaqItem {
  id: string;
  question: Localized;
  answer: Localized;
}

export interface FaqSection {
  id: string;
  title: Localized;
  lead: Localized;
  items: readonly FaqItem[];
}

export const FAQ_SECTIONS: readonly FaqSection[] = [
  {
    id: "where",
    title: { en: "Where I work and with whom", es: "Dónde trabajo y con quién" },
    lead: {
      en: "Sebastián Gutiérrez is a senior data platform engineer based in Austin, Texas. He works remotely or in a hybrid setup, is authorized to work for any U.S. employer without sponsorship, and works in English and Spanish. These answers cover location, work authorization and languages.",
      es: "Sebastián Gutiérrez es ingeniero senior de plataformas de datos y vive en Austin, Texas. Trabaja de forma remota o híbrida, tiene autorización para trabajar con cualquier empleador de EE. UU. sin patrocinio y trabaja en inglés y español. Estas respuestas cubren ubicación, autorización de trabajo e idiomas.",
    },
    items: [
      {
        id: "location",
        question: {
          en: "Where is Sebastián Gutiérrez based, and can he work remotely?",
          es: "¿Dónde vive Sebastián Gutiérrez y puede trabajar de forma remota?",
        },
        answer: {
          en: "Sebastián is based in Austin, Texas, on Central Time. He is open to remote roles across the Americas and EU time zones, and to hybrid roles in Austin. A fully on-site role is a conversation to have once you share the details of the position.",
          es: "Sebastián vive en Austin, Texas, en horario central. Está abierto a roles remotos en husos horarios de América y de la UE, y a roles híbridos en Austin. Un rol totalmente presencial es una conversación que conviene tener cuando compartas los detalles del puesto.",
        },
      },
      {
        id: "authorization",
        question: {
          en: "Is Sebastián authorized to work in the United States?",
          es: "¿Sebastián tiene autorización para trabajar en Estados Unidos?",
        },
        answer: {
          en: "Yes. Sebastián is a U.S. permanent resident and green card holder. He is authorized to work for any U.S. employer, and he needs no visa sponsorship now or in the future. That applies to full-time, contract and remote positions with U.S. companies alike.",
          es: "Sí. Sebastián es residente permanente de EE. UU. y tiene green card. Está autorizado para trabajar con cualquier empleador estadounidense y no necesita patrocinio de visa ni ahora ni en el futuro. Esto aplica por igual a puestos de tiempo completo, por contrato y remotos con empresas de EE. UU.",
        },
      },
      {
        id: "languages",
        question: {
          en: "Which languages does he work in?",
          es: "¿En qué idiomas trabaja?",
        },
        answer: {
          en: "Sebastián works in English and Spanish. He has led client meetings as the technical representative of a data team serving universities in several Latin American countries and in France, and this site is published in both languages. Documentation, code reviews and stakeholder conversations all work in either one.",
          es: "Sebastián trabaja en inglés y español. Ha liderado reuniones con clientes como representante técnico de un equipo de datos que atendía universidades en varios países de Latinoamérica y en Francia, y este sitio está publicado en ambos idiomas. La documentación, las revisiones de código y las conversaciones con interesados funcionan en cualquiera de los dos.",
        },
      },
    ],
  },
  {
    id: "what",
    title: { en: "What I build", es: "Qué construyo" },
    lead: {
      en: "Sebastián builds data platforms: the ingestion pipelines, APIs, warehouses and shared libraries that other teams build on. His core stack is Python, SQL, Snowflake, Kubernetes, PostgreSQL, Spark, FastAPI and Airflow. He has {years}+ years in engineering, and these answers explain the role and his track record.",
      es: "Sebastián construye plataformas de datos: los pipelines de ingesta, las APIs, los data warehouses y las librerías compartidas sobre las que otros equipos construyen. Su stack principal es Python, SQL, Snowflake, Kubernetes, PostgreSQL, Spark, FastAPI y Airflow. Tiene más de {years} años en ingeniería, y estas respuestas explican el rol y su trayectoria.",
    },
    items: [
      {
        id: "role",
        question: {
          en: "What does a data platform engineer do?",
          es: "¿Qué hace un ingeniero de plataformas de datos?",
        },
        answer: {
          en: "A data platform engineer builds the shared system that data pipelines run on, such as the warehouse, ingestion layer, orchestration, access control and internal libraries. A data engineer focuses on delivering particular datasets, while a platform engineer makes it safe and fast for every team to deliver their own. Sebastián works on that platform side.",
          es: "Un ingeniero de plataformas de datos construye el sistema compartido sobre el que corren los pipelines de datos: el warehouse, la capa de ingesta, la orquestación, el control de acceso y las librerías internas. Un ingeniero de datos se centra en entregar conjuntos de datos concretos, mientras que el de plataforma hace que cada equipo pueda entregar los suyos de forma segura y rápida. Sebastián trabaja en el lado de la plataforma.",
        },
      },
      {
        id: "stack",
        question: {
          en: "Which tools and languages does Sebastián use most?",
          es: "¿Qué herramientas y lenguajes usa más Sebastián?",
        },
        answer: {
          en: "His core stack is Python and SQL, with Snowflake, PostgreSQL and Spark for data, FastAPI and Django for services, Airflow for orchestration, and Kubernetes for running it all. He has also worked with Azure Synapse and AWS. The Explorer on the home page lets you filter his experience by any tool.",
          es: "Su stack principal es Python y SQL, con Snowflake, PostgreSQL y Spark para los datos, FastAPI y Django para los servicios, Airflow para la orquestación y Kubernetes para ejecutarlo todo. También ha trabajado con Azure Synapse y AWS. El Explorador de la página de inicio permite filtrar su experiencia por cualquier herramienta.",
        },
      },
      {
        id: "results",
        question: {
          en: "What results has he delivered?",
          es: "¿Qué resultados ha logrado?",
        },
        answer: {
          en: "At uPlanner, a planning platform used by universities, he automated curriculum uploads and saved one client over 250 staff hours per semester, and he cut common support queries from up to two hours to under two minutes. Today he is a contract engineer on an internal data platform at Apple.",
          es: "En uPlanner, una plataforma de planificación usada por universidades, automatizó la carga de currículos y le ahorró a un cliente más de 250 horas de personal por semestre, y redujo consultas frecuentes de soporte de hasta dos horas a menos de dos minutos. Hoy es ingeniero por contrato en una plataforma de datos interna de Apple.",
        },
      },
    ],
  },
  {
    id: "fit",
    title: { en: "How I work and what I look for", es: "Cómo trabajo y qué busco" },
    lead: {
      en: "Sebastián looks for senior data platform or data engineering roles, with backend work welcome, on teams where the people side matters as much as the technical side. He is comfortable as the first engineer on a team or as the calm one on a large team. These answers describe how he works.",
      es: "Sebastián busca roles senior de plataformas de datos o ingeniería de datos, con trabajo de backend bienvenido, en equipos donde el lado humano importa tanto como el técnico. Se siente cómodo como primer ingeniero de un equipo o como la persona tranquila en uno grande. Estas respuestas describen cómo trabaja.",
    },
    items: [
      {
        id: "looking-for",
        question: {
          en: "What kind of role is Sebastián looking for?",
          es: "¿Qué tipo de rol busca Sebastián?",
        },
        answer: {
          en: "He wants a senior data platform or data engineering role, with backend work welcome, where he can keep building systems that hold up and explain them to the people who depend on them. He is open to opportunities now, based in Austin and available for remote or hybrid work.",
          es: "Busca un rol senior de plataformas de datos o ingeniería de datos, con trabajo de backend bienvenido, donde pueda seguir construyendo sistemas que aguanten y explicárselos a las personas que dependen de ellos. Está abierto a oportunidades ahora, vive en Austin y está disponible para trabajo remoto o híbrido.",
        },
      },
      {
        id: "non-engineers",
        question: {
          en: "How does he work with people who are not engineers?",
          es: "¿Cómo trabaja con personas que no son ingenieras?",
        },
        answer: {
          en: "He translates between the people who build systems and the people who depend on them. At uPlanner he built a set of self-service internal tools so Customer Success could answer data questions without waiting on engineering, and he represented the data team in meetings with international clients. He has also mentored two to three engineers.",
          es: "Traduce entre quienes construyen los sistemas y quienes dependen de ellos. En uPlanner construyó un conjunto de herramientas internas de autoservicio para que Customer Success respondiera preguntas de datos sin esperar a ingeniería, y representó al equipo de datos en reuniones con clientes internacionales. También ha mentoreado a dos o tres ingenieros.",
        },
      },
      {
        id: "founder",
        question: {
          en: "Has he worked in a startup or as the only engineer?",
          es: "¿Ha trabajado en una startup o como único ingeniero?",
        },
        answer: {
          en: "Yes. Sebastián co-founded AidProf, an education startup that graded handwritten STEM exams automatically, and he was its only engineer. He designed and shipped the platform, the AWS infrastructure and a ten-stage grading pipeline. The company closed in 2022, and the Story page tells that part of his career.",
          es: "Sí. Sebastián cofundó AidProf, una startup de educación que corregía automáticamente exámenes escritos a mano de materias STEM, y fue su único ingeniero. Diseñó y puso en producción la plataforma, la infraestructura en AWS y un pipeline de corrección de diez etapas. La empresa cerró en 2022, y la página Mi historia cuenta esa parte de su carrera.",
        },
      },
    ],
  },
  {
    id: "hire",
    title: { en: "How to get in touch", es: "Cómo ponerse en contacto" },
    lead: {
      en: "The fastest way to reach Sebastián is by email, and his résumé is sent on request rather than published, because he tailors it to each role. The answers below explain how to ask for it and where to see his work before you do.",
      es: "La forma más rápida de contactar a Sebastián es por correo, y su CV se envía a pedido en lugar de publicarse, porque lo adapta a cada rol. Las respuestas siguientes explican cómo pedirlo y dónde ver su trabajo antes de hacerlo.",
    },
    items: [
      {
        id: "resume",
        question: {
          en: "How do I get Sebastián's résumé?",
          es: "¿Cómo obtengo el CV de Sebastián?",
        },
        answer: {
          en: "Request it from the Contact page or by email. Tell him the role, the company, a link to the posting and whether the job is remote, and he replies with a version tailored to that position. There is deliberately no public résumé file, so every copy fits the role it was sent for.",
          es: "Pídelo desde la página de Contacto o por correo. Cuéntale el rol, la empresa, un enlace a la oferta y si el trabajo es remoto, y responderá con una versión adaptada a ese puesto. No hay un archivo de CV público a propósito, de modo que cada copia se ajusta al rol para el que se envió.",
        },
      },
      {
        id: "see-work",
        question: {
          en: "Where can I see Sebastián's work before contacting him?",
          es: "¿Dónde puedo ver el trabajo de Sebastián antes de contactarlo?",
        },
        answer: {
          en: "Start with the home page, where you can filter his experience by tool or role, then read the Story page for his career in three acts. The code for this site is public on GitHub, including its tests and CI workflow, and his LinkedIn profile lists his roles.",
          es: "Empieza por la página de inicio, donde puedes filtrar su experiencia por herramienta o rol, y luego lee la página Mi historia para ver su carrera en tres actos. El código de este sitio es público en GitHub, con sus pruebas y su flujo de CI, y su perfil de LinkedIn enumera sus roles.",
        },
      },
    ],
  },
];

/** Substitute build-time facts (`{years}`) into a piece of FAQ copy. */
export function faqText(text: string): string {
  return text.replaceAll("{years}", String(getEngineeringYears()));
}
