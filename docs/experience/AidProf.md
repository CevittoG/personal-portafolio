# AidProf — Professional Experience Documentation

---

## 1. Company Overview

**Company:** AidProf  
**Type:** Early-stage SaaS startup (co-founded)  
**Period:** December 2020 – February 2022  
**Status:** Concluded (business model pivot unsuccessful)  
**Team Size:** 3 co-founders  

AidProf was a SaaS platform designed to automate the grading and review of student assignments in STEM subjects (Science, Technology, Engineering, and Mathematics). The core value proposition was enabling teachers to eliminate manual, time-consuming grading workflows by uploading scanned student exams and receiving automated, annotated feedback reports, gradebooks, and performance analytics — all generated programmatically.

The platform targeted educational institutions in Chile and broader Latin America, combining computer vision, OCR, and NLP techniques to interpret handwritten math and text responses and compare them against teacher-defined rubrics.

---

## 2. Role & Positioning

**Official Title:** Product Owner  
**Actual Function:** Solo Full-Stack Developer · Data Engineer · ML Engineer · DevOps Engineer · Product Manager  

As the sole technical co-founder, the Product Owner title was adopted intentionally to convey to investors that the product was driven not only by engineering decisions but also by a deep understanding of business logic, user needs, and product strategy. In practice, this meant owning 100% of the technical architecture, development, and infrastructure, while simultaneously shaping product priorities and ensuring alignment between technical capabilities and business goals.

### Co-Founder Responsibilities Breakdown

| Co-Founder | Primary Role |
|---|---|
| **You** | Full technical ownership — architecture, development, infrastructure, product logic, data pipeline |
| **CEO** | Vision, marketing, legal, investor relations, customer acquisition, overall coordination |
| **Third Co-Founder** | Support role — innovation research, non-technical contributions |

> ~90% of all code was written solely by you. The third co-founder contributed minimal code due to limited development experience.

---

## 3. Core Responsibilities

- **Sole architect and developer** of the entire SaaS platform, from infrastructure to frontend to data pipeline
- **Designed and implemented** the end-to-end automated exam grading pipeline (PDF ingestion → OCR → NLP comparison → graded output)
- **Owned all technical decisions**: cloud provider selection, tech stack, service integrations, deployment strategy
- **Managed AWS infrastructure**: EC2, S3, Lambda, IAM configuration and security
- **Built and maintained CI/CD pipeline** using GitHub Actions (single production environment)
- **Integrated third-party APIs**: Mathpix OCR API for handwritten math/text recognition
- **Developed the full Django web application** from scratch, including all backend logic and server-rendered frontend
- **Set up and managed production server** environment (EC2 with nginx + gunicorn, SSL)
- **Designed and managed MySQL relational database** on AWS RDS
- **Built the WordPress landing page** (separate from the Django app) for marketing and investor-facing presentation
- **Participated in product demos** with 3 colleges and 5 independent teachers
- **Defined product roadmap** and translated business requirements into technical specifications
- **Managed domain setup and server configuration**

---

## 4. Technical Stack

### Languages & Frameworks
| Category | Technology |
|---|---|
| Backend | Python 3, Django |
| Frontend | Django Templates (HTML, CSS — server-rendered) |
| Data Processing | Python (pandas, NumPy, scikit-learn, OpenCV, PIL/Pillow, matplotlib, openpyxl) |
| OCR & Vision | Mathpix API, OpenCV, pdf2image, Poppler |
| NLP / Similarity | scikit-learn (CountVectorizer, cosine similarity) |
| ML / Predictions | scikit-learn (linear regression for student grade prediction) |

### Infrastructure & Cloud (AWS)
| Service | Usage |
|---|---|
| EC2 | Application hosting (nginx + gunicorn) |
| S3 | File storage (student PDFs, output reports) |
| RDS (MySQL) | Relational database for student data and grading |
| Lambda | Prototyped for connecting files to AWS Textract (replaced by Mathpix) |
| IAM | User and permission management across all AWS services |

### DevOps & Tooling
| Tool | Usage |
|---|---|
| GitHub Actions | CI/CD pipeline (production deployments) |
| GitHub | Version control |
| WordPress | Marketing landing page |
| win32gui / win32com | Windows shell integration for local pipeline directory management |

---

## 5. Product Features Built

The Django web platform was developed entirely from scratch and included the following modules:

- **Authentication & User Management** — Secure login, registration, session management
- **User Profiles** — Role-based profiles (teacher, administrator)
- **Educational Establishments** — Multi-institution support
- **Courses & Sections** — Course creation, section management
- **Evaluation Planning** — Scheduling and organizing evaluations per course
- **Rubric Builder** — Full UI for teachers to define rubrics, including: question/part structure, expected answers, scoring distribution, data types, and key answer sections
- **Bulk Student Test Upload** — Upload multiple student exam PDFs in a single batch
- **Automated Grading Engine** — Pipeline execution triggered from UI
- **Review Dashboard** — Per-evaluation grading results with confidence indicators
- **Manual Review Flagging** — Items below confidence threshold surfaced for teacher review
- **Analytics & Statistics Dashboard** — Multi-level reporting (course, evaluation, student)
- **Individual Student Tracking** — Per-student performance history across evaluations
- **Grade Predictions** — Linear regression model projecting student final grades based on historical performance

---

## 6. Automated Grading Pipeline — Technical Deep Dive

This is the core technical achievement of AidProf: a fully automated pipeline that takes a folder of raw student exam PDFs and produces annotated feedback reports, a formatted gradebook, and statistical charts.

### Pipeline Architecture

```
Raw Student PDFs
       ↓
[1] Directory Resolution       — win32gui/win32com shell picker + hierarchical path construction
       ↓
[2] Folder Scaffolding         — Dynamic folder tree creation based on rubric structure
       ↓
[3] PDF → Image Conversion     — pdf2image + Poppler → high-resolution JPGs per page
       ↓
[4] ROI Detection              — OpenCV: Gaussian blur → inverse binary threshold → findContours
       ↓
[5] Interactive ROI Labelling  — Professor assigns each detected box to question/part; saves crops
       ↓
[6] OCR via Mathpix API        — Base64-encoded ROI → POST /v3/latex → LaTeX string + confidence
       ↓
[7] Answer Comparison          — CountVectorizer bag-of-words → cosine similarity → status label
       ↓
[8] Results Aggregation        — Multi-index DataFrame pivot → grade computation (Chilean 1–7 scale)
       ↓
[9] Statistical Charting       — matplotlib: donut charts, bar/box plots, histograms (SVG)
       ↓
[10] Feedback PDF Generation   — PIL overlay of ✓/✗ icons + scores on student images → PDF
```

### Module Breakdown

#### 1. Directory Resolution (`DirectoryManage.py`)
Uses `win32gui` and `win32com` to open a native Windows folder-picker dialog. Prompts for hierarchical identifiers (establishment → course → section → test number) to construct the working directory path consumed by all downstream modules.

#### 2. Folder Structure Scaffolding (`CreateFolders.py`)
Dynamically infers the number of questions and parts by reading the existing `Pauta/` directory. Creates the full nested folder tree (`Entregas/PDF`, `Entregas/IMAG`, `Respuestas/PreguntaN/ParteN`, `Feedback`) that the pipeline depends on.

#### 3. PDF → Image Conversion (`PDFManage.py`)
Uses `pdf2image` backed by a bundled Poppler binary to rasterize each PDF page into high-resolution JPGs. Handles both the professor's rubric and all student submissions.

#### 4. ROI Detection (`ImageManage.py` + `ROIManage.py`)
Applies Gaussian blur and inverse binary thresholding to each page image, then runs OpenCV's `findContours` with `RETR_TREE` hierarchy. Contours are filtered by minimum area and parent-child relationships to isolate only top-level answer boxes (ROIs), discarding noise and nested contours.

#### 5. Interactive ROI Labelling (`ROIManage.py`, `UploadPauta.py`, `ExtractStudents.py`)
Each detected ROI is displayed to the professor, who manually assigns it to a question/part and optionally rotates it 90°. The labelled crop is saved to the correct `Respuestas/PreguntaN/ParteN/` path, building the structured dataset used during grading.

#### 6. OCR via Mathpix API (`mathpix.py`, `ImageToCSV.py`)
Each saved ROI image (rubric guideline and student answer) is base64-encoded and POSTed to the Mathpix `/v3/latex` endpoint, which returns a LaTeX string and a confidence score. This handles mixed math/text content including integrals, fractions, and multi-line expressions.

> **Note:** AWS Textract was initially prototyped via Lambda but replaced by Mathpix due to superior accuracy on handwritten mathematical notation.

#### 7. Answer Comparison (`ImageToCSV.py — matching()`)
Both LaTeX strings are lowercased and tokenized into bag-of-words frequency vectors using `CountVectorizer`. Cosine similarity is computed between the rubric answer vector and the student answer vector. The score (0–1) is bucketed into status labels using hard-coded thresholds:

| Similarity Score | Status |
|---|---|
| ≥ 0.95 | ✅ Correct |
| ≥ 0.50 | 🟡 Revise (flag for manual teacher review) |
| ≥ 0.20 | ❌ Incorrect |
| < 0.20 | ❌ Incorrect |

The confidence threshold system allows teachers to focus manual review effort only on borderline cases, rather than reviewing all submissions.

#### 8. Results Aggregation & Grading (`DataSelect.py`)
The `revision.csv` is pivoted into a multi-index DataFrame (student × question × part). Per-question totals are summed, and final grades are computed on **Chile's 1–7 grading scale** with a configurable pass threshold and per-question weighting. Output is a formatted `.xlsx` file with custom styles applied via `openpyxl`.

#### 9. Statistical Charting (`ReviewCharts.py`)
Generates SVG charts programmatically using `matplotlib`:
- **Per student:** Donut-style grade graphic
- **Per class:** Bar chart + box plot with annotated outliers
- **Per question:** Score frequency histogram with configurable bin ranges

#### 10. Feedback PDF Generation (`Feedback.py`, `PDFManage.py`)
For each student, loads their annotated test images and overlays a ✓ or ✗ icon (with transparency masking) and a score/max text label at the exact pixel coordinates of each answer box. Reassembles the marked-up pages into a single `Feedback/REV_<name>.pdf` using PIL's multi-page save.

---

## 7. Key Technical Decisions & Rationale

| Decision | Rationale |
|---|---|
| **Mathpix over AWS Textract** | Mathpix demonstrated superior accuracy for handwritten mathematical notation (LaTeX output with confidence scores). Textract was prototyped via Lambda but deprioritized. |
| **Bag-of-words cosine similarity over fine-tuned model** | At early startup stage, insufficient data to train a custom model. BoW + cosine similarity provided a functional, interpretable baseline. Strategy was to collect data through usage and train a custom model in a later stage. |
| **Django server-rendered templates over SPA** | Reduced frontend complexity for a small team, faster initial delivery, sufficient for the UX requirements at that stage. |
| **Single production environment** | Resource-constrained startup; GitHub Actions deployed directly to production EC2. |
| **Rubric fully defined in UI** | This was the key design decision that made automated grading possible — by capturing scoring weights, data types, expected answers, and key sections at rubric creation time, the system had all necessary context to evaluate student responses without additional annotation. |

---

## 8. Business Context & Outcomes

### Go-to-Market Journey
- **Initial model:** B2C — selling directly to individual teachers
  - **Outcome:** Strong product validation. Teachers found the automation compelling and immediately understood the value. Failed to convert due to teachers being unwilling to pay out-of-pocket for institutional tools.
- **Pivot:** B2B — selling directly to colleges and institutions
  - **Outcome:** Institutions already had functioning (if manual) grading systems using teacher/student assistants. Resistance to change and switching costs prevented adoption despite positive reception.

### Validation Signals
- Demo sessions conducted with **3 colleges** and **5 independent teachers**
- Consistent positive feedback on automation level and perceived time savings
- Product was functional and demo-ready with real exam processing

### Conclusion
The startup concluded in February 2022 due to inability to close institutional sales, not due to product failure. The core technology worked as designed and received genuine enthusiasm from end users.

---

## 9. Skills Demonstrated

| Dimension | Evidence |
|---|---|
| **Full-Stack Development** | Built entire Django platform from scratch — auth, multi-entity data model, file handling, dashboards, analytics |
| **Data Engineering** | Designed end-to-end file ingestion and processing pipeline; structured output generation (CSV, Excel, PDF) |
| **Computer Vision** | OpenCV-based ROI detection using contour analysis, thresholding, and image preprocessing |
| **NLP / ML** | Implemented bag-of-words cosine similarity for answer matching; linear regression for grade prediction |
| **API Integration** | Mathpix OCR API, AWS services (S3, EC2, Lambda, RDS, IAM) |
| **Cloud Infrastructure** | AWS architecture design, EC2 server setup (nginx + gunicorn), S3 file storage, RDS database management |
| **DevOps** | GitHub Actions CI/CD, production deployment pipeline, SSL and domain configuration |
| **Product Ownership** | Translated business requirements into technical specs; prioritized features against startup constraints; maintained product coherence across technical and business dimensions |
| **Technical Leadership** | Sole technical decision-maker; evaluated and selected all tools, frameworks, and services |
| **Entrepreneurship** | Co-founded company, navigated two B2C → B2B pivots, presented to investors and clients |

---

*Document generated for portfolio and interview preparation purposes.*
*Last updated: May 2026*
