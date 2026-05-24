# uPlanner — Professional Experience Documentation

---

## 1. Company Overview

**Company:** uPlanner  
**Website:** https://uplanner.com/en  
**Type:** B2B SaaS — EdTech / Higher Education  
**Founded:** 2012 (Universidad Adolfo Ibáñez, Chile) by Juan Pablo Mena & Rodrigo Hernández  
**Headquarters:** Santiago, Chile  
**Size:** 90+ specialists (engineers, data scientists, education experts)  
**Work Mode:** Fully remote  
**Geographic Footprint:** Offices in 8 countries — USA, Chile, Colombia, Brazil, Peru, Mexico, Sweden, and Abu Dhabi; clients on 3 continents  
**Clients:** 30+ higher education institutions including Universidad de los Andes, Pontifical Catholic University of Chile, and Aliat Universities (Mexico)  
**Recognition:** Financial Times Americas' Fastest Growing Companies 2023 · Edtech Digest Cool Tool Award 2023 · Microsoft Community Response Partner 2021 · ISO/IEC 27001 certified  

uPlanner delivers AI-powered, data-driven solutions for higher education institutions, helping colleges and universities improve academic planning, course scheduling, curriculum building, resource optimization, dropout prediction, and student engagement. The product suite spans the full institutional lifecycle:

| Product | Purpose |
|---|---|
| **uForecast** | Demand forecasting |
| **uPlanning** | Class optimization, academic scheduling, faculty allocation |
| **uBooking** | Event management, exam scheduling |
| **uAssessment** | Curriculum design, syllabus management, learning outcomes |
| **uEngagement** | Retention and wellbeing tracking |
| **uClass** | Attendance and grades monitoring |
| **uExperience** | Student life mobile application |
| **uSuite** | Integrated platform combining all uPlanner solutions |

At scale, uPlanner has served 20 public universities simultaneously in Peru covering 350,000 students (2020). Because the company serves a diverse international client base with solutions customized per client, every product can vary in implementation detail — engineers must maintain deep awareness of client-specific configurations across multiple simultaneous deployments.

---

## 2. Role & Positioning

**Official Title:** Data Engineer  
**Team:** Data Services  
**Team Size:** 3–6 people (fluctuating)  
**Period:** July 2021 – October 2024  
**Work Mode:** Remote  

As a Data Engineer on the Data Services team, responsibilities spanned the full lifecycle of data pipelines: design, development, maintenance, documentation, and client-facing support. The role required operating simultaneously as a pipeline developer, integration engineer, cloud migration contributor, internal tooling builder, and technical representative in international client meetings.

While not the team lead, the role carried significant autonomy — particularly for owning end-to-end integrations, leading client meetings, and independently driving projects from requirements gathering through to delivery.

---

## 3. Core Responsibilities

- **Designed, developed, and maintained ETL/ELT pipelines** supporting multiple international higher education clients simultaneously
- **Owned all integrations with D2L Brightspace LMS API** — the primary external data source used by uPlanner across 5 international clients
- **Led Pentaho → Azure Synapse migration initiative**: developed the first pipeline from scratch on Synapse, then began migrating existing pipelines in batches
- **Developed Python customizations** for data transformation, validation, cross-referencing, and business logic execution
- **Built and maintained a Streamlit-based internal web platform** consolidating 20+ internal tools for use across Data Engineering, Product, Customer Success, and Data Science teams
- **Wrote and maintained technical documentation** for all owned developments (pipelines, integrations, automations, tools)
- **Mentored 2–3 junior/mid engineers**, both during onboarding and as part of formal growth plans
- **Served as technical representative in international client meetings** — leading discussions, gathering requirements, evaluating feasibility of custom integrations, and following up on issue resolution
- **Collaborated cross-functionally** with technical, product, and customer service teams to restructure data models and product requirements

---

## 4. Technical Stack

### Languages & Frameworks
| Category | Technology |
|---|---|
| Primary Language | Python |
| Internal Tooling | Streamlit |
| ETL (Legacy) | Pentaho Data Integration (PDI) |
| ETL (Modern) | Azure Synapse Pipelines, Notebooks, Spark, SQL Pools |

### Databases
| Database | Role |
|---|---|
| MariaDB | Staging database (ETL Steps A–B), product database |
| MySQL | uPlanner internal application database |
| SQL Server | Product database (some clients) |
| MongoDB | Key-value data storage for mobile application (Step Y) |

### Cloud & Infrastructure
| Service | Usage |
|---|---|
| Azure Synapse Analytics | New ETL pipeline development and legacy migration |
| Azure Data Lake | Storage layer for Synapse pipelines |
| SFTP | Client file delivery protocol |

### Integrations & APIs
| Integration | Details |
|---|---|
| D2L Brightspace REST API | Primary LMS integration — grades, attendance, courses, curriculum upload |
| Internal uPlanner APIs | Cross-referenced with external APIs for data aggregation |

---

## 5. ETL Pipeline Architecture (Pentaho-based)

uPlanner's core ETL system was built on Pentaho Data Integration, organized into 6 sequential steps executed per client per run. Each step had distinct responsibilities, and Python customizations were layered throughout to handle client-specific business logic.

```
Client CSV Files (via SFTP)
        ↓
[Step A] Server Access & File Discovery
        — Connect to client SFTP server
        — Search for and retrieve CSV files with client data
        ↓
[Step B] Format Validation & Staging Load
        — Validate file format and minimum data requirements
        — Upload validated data to staging database (MariaDB)
        ↓
[Step C] Data Crossing & Consistency Validation
        — Cross-reference and validate data consistency
        — Load to product database (MariaDB or SQL Server, per client)
        ↓
[Step D] Algorithm Execution
        — Run product-specific algorithms
        — Generate simulations and final output for client
        ↓
[Step E] Report Generation
        — Generate log report, validation summary, and ETL specification report
        ↓
[Step Y] Mobile Data Load (specific product only)
        — Push key-value data to MongoDB for consumption by mobile application
```

> **Note on customization:** Because each client has unique data structures, business rules, and product configurations, Python scripts were layered into the pipeline at multiple steps to handle client-specific transformations, validations, and logic. Maintaining awareness of per-client variations across simultaneous deployments was a core operational requirement.

---

## 6. Key Projects & Achievements

---

### 6.1 D2L Brightspace LMS Integration Suite
**Impact:** Eliminated 250+ hours of manual work per semester for one client; served 5 international clients

D2L Brightspace is a leading Learning Management System used by universities worldwide. uPlanner clients frequently used D2L as their primary academic data platform, requiring a robust, reusable integration layer between uPlanner's internal systems and the D2L API.

**What was built:**
Multiple distinct integration workflows were developed, all following a consistent architectural pattern:

```
uPlanner MySQL DB (base data)
        ↓
D2L Brightspace REST API (fetch matching records)
        ↓
Cross-reference & aggregation
        ↓
Business logic algorithms
        ↓
Output → uPlanner DB or back to D2L
```

**Integration types developed:**
- **Student grades processing** — Fetch and process grade data from D2L per course/student
- **Attendance tracking** — Extract and aggregate attendance records
- **Course and curriculum fetching** — Retrieve D2L course structures for cross-referencing with uPlanner records
- **Curriculum upload automation** — Programmatically push uPlanner-generated curricula to D2L (see 6.2)

**Technical complexity handled:**
- **Token-based authentication** — Credentials stored in database; access tokens generated and refreshed automatically per session
- **Pagination** — Implemented for endpoints returning tens of thousands of records
- **Asynchronous data availability** — Some D2L endpoints trigger an internal D2L background job rather than returning data immediately. Logic was built to poll export job status before ingesting data, preventing processing of incomplete datasets
- **REST API consumption** — Full handling of request construction, response parsing, error handling, and retry logic

**Scale:** 5 international clients across Colombia, Mexico, Argentina, France, and others.  
**Ownership:** All D2L integrations were led and delivered end-to-end.

---

### 6.2 Curriculum Upload Automation (Colombia Client)
**Impact:** Eliminated 250+ hours of manual work per semester

**Context:** uPlanner's curriculum-building product generates complete course curriculum plans automatically — a process that, once tuned per institution, runs reliably at scale. However, publishing those curricula to D2L required teachers to manually navigate D2L's UI and upload each curriculum individually, a process that was slow, error-prone, and not scalable.

**Solution:** A custom Python integration that:
1. Fetched uPlanner's generated curriculum records from the internal MySQL database
2. Cross-referenced each record against D2L courses using the Brightspace API to find the matching course plan
3. Programmatically uploaded curriculum files to D2L as each became ready, without any manual UI interaction

**Outcome:** Fully automated a workflow that had previously consumed over 250 hours of teacher/staff time per semester, for a single Colombian university client.

---

### 6.3 Automated Error Logging System
**Impact:** Reduced data validation and transformation work time by 43%

Developed and implemented automated error logging across the data transformation and validation stages of ETL pipelines. By systematically capturing, categorizing, and surfacing errors at the point of occurrence — rather than requiring manual log inspection — the team significantly reduced time spent diagnosing and resolving pipeline issues.

---

### 6.4 Pentaho → Azure Synapse Migration
**Impact:** Modernized pipeline infrastructure; improved performance and scalability; improved integration efficiency by 35%

**Context:** uPlanner's ETL infrastructure was built on Pentaho Data Integration — a legacy tool with performance ceilings, limited scalability, and increasing maintenance costs. The strategic decision was made to migrate to Azure Synapse Analytics, aligning with modern cloud-native data engineering practices.

**Approach:**
- Initiated with a **greenfield development**: designed and built one complete ETL pipeline from scratch on Synapse to evaluate the tooling, establish development patterns, measure performance, and identify Synapse-specific constraints
- Used findings to define the migration strategy for existing pipelines
- Began migrating legacy Pentaho pipelines in batches

**Azure Synapse components used:**
- **Synapse Pipelines** — Orchestration and workflow management
- **Notebooks** — Python/PySpark-based transformation logic
- **Apache Spark Pools** — Distributed data processing
- **SQL Pools** — Analytical query execution
- **Azure Data Lake** — Storage layer

**Status:** Migration was underway at time of departure. First pipeline developed from scratch; 2 legacy pipelines successfully migrated.

---

### 6.5 Internal Streamlit Web Platform
**Impact:** Reduced common Customer Success query resolution time from up to 2 hours to under 2 minutes

**Context:** The Data Services team frequently received requests from Customer Success (CS), Product, and Data Science teams requiring SQL queries, database lookups, file transformations, or API testing. CS staff had no SQL knowledge and depended entirely on Data Engineers to resolve client-facing issues — creating bottlenecks, delays, and context-switching costs for the engineering team.

**Solution:** Designed and developed a Streamlit-based internal web platform consolidating **20+ internal tools**, accessible across the company. Tools were purpose-built around the most frequent recurring needs of each team.

**Tool categories included:**
- File transformation utilities
- File parsing tools
- Recurrent database query runners (with user-friendly interfaces, no SQL required)
- Database job management
- Configuration comparison tools (between environments/clients)
- API testing interfaces
- And more

**Flagship tool — CS Debugging Suite:**
After two years of repeatedly solving the same categories of client-reported issues for the Customer Success team, all recurring query patterns were compiled and translated into purpose-built, form-driven tools. CS staff could now self-serve diagnosis of frequent client issues without engineering involvement.

| Before | After |
|---|---|
| CS waits for Data Engineer availability | Instant self-service |
| Engineer gathers context, runs queries, interprets results | Automated via UI |
| Up to 2 hours per issue | Under 2 minutes per issue |
| Blocked on SQL knowledge | No SQL knowledge required |

---

### 6.6 Data Model Restructuring Initiative
**Impact:** Reduced initial customer data delivery time by 20%

Led and coordinated cross-functional meetings involving technical, product, and customer service teams to restructure the data model and realign product requirements. By identifying misalignments between how data was structured internally and what clients needed at onboarding, the restructuring reduced the time required to deliver initial data to new customers.

---

## 7. Client-Facing Work

One of the distinguishing aspects of this role was serving as the **technical face of the Data Services team** in international client meetings. Clients spanned multiple countries including Colombia, Mexico, Argentina, France, and others.

**Meeting types:**
- **Requirements gathering** — Understanding client needs, data sources, system configurations, and desired outcomes for custom integrations
- **Feasibility evaluation** — Assessing whether requested developments were technically viable, estimating complexity, and recommending approaches
- **Project follow-ups** — Tracking progress on active custom developments and reporting status to clients
- **Issue resolution** — Diagnosing and resolving client-reported technical problems in live deployments

**Leadership in meetings:** Frequently led meetings directly, not just as a participant — setting agenda, facilitating discussion, and driving to decisions.

---

## 8. Mentorship & Knowledge Sharing

- Mentored **2–3 engineers** across the team's lifecycle, both during initial onboarding periods and as part of structured growth plans for more tenured team members
- Maintained technical documentation for all owned developments — pipelines, integrations, automations, and internal tools — as a team-wide standard

---

## 9. Skills Demonstrated

| Dimension | Evidence |
|---|---|
| **Data Engineering** | End-to-end ETL/ELT design, development, and maintenance across multiple clients and products |
| **API Integration** | D2L Brightspace REST API (auth, pagination, async job polling, bidirectional data flows) |
| **Python Development** | Custom transformation scripts, business logic algorithms, automation pipelines, internal tooling |
| **Cloud Data Engineering** | Azure Synapse (Pipelines, Notebooks, Spark, SQL Pools), Azure Data Lake |
| **Database Proficiency** | MariaDB, MySQL, SQL Server, MongoDB — querying, cross-referencing, schema analysis |
| **Legacy Modernization** | Pentaho → Azure Synapse migration; greenfield pipeline design on new platform |
| **Internal Tooling** | Streamlit platform with 20+ tools, eliminating cross-team bottlenecks |
| **Client-Facing Communication** | Technical lead in international meetings across 5+ countries |
| **Cross-functional Collaboration** | Coordinated with Product, Customer Success, Data Science, and technical teams |
| **Mentorship** | Onboarding and growth plan mentoring for 2–3 engineers |
| **Technical Documentation** | Documented all owned developments to team standard |
| **Problem Scoping** | Translated recurring operational pain points into automated, scalable internal tools |

---

*Document generated for portfolio and interview preparation purposes.*  
*Last updated: May 2026*
