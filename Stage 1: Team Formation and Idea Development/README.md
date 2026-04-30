# Stage 1 Report: Team Formation and Idea Development

## Project Overview

This report documents the first stage of a software engineering student project focused on the design and planning of a modern e-commerce web platform for a small independent brand. The brand sells clothing, handmade chairs, and creative decorative objects, and currently needs a digital presence that can showcase products professionally, support customer browsing, and allow basic shopping cart interaction.

The goal of this stage is to define the team structure, evaluate multiple project ideas, justify the selected concept, and refine it into a realistic MVP suitable for a student development cycle. The proposed solution uses React and Tailwind CSS for the frontend, Node.js and Express for the backend, and MongoDB as the database.

---

## 1. Team Formation

### 1.1 Team Roles

The project is carried out by a team of two students. To keep responsibilities balanced while covering both user experience and system implementation, the team is organized as follows:

| Team Member | Role | Main Responsibilities |
|---|---|---|
| Student 1 | Frontend and UX Lead | Interface design, React component structure, responsive layouts, Tailwind styling, user flows, accessibility checks, integration with API data |
| Student 2 | Backend and Data Lead | Express API design, MongoDB schema design, product and cart logic, server-side validation, deployment support, database connectivity |

### 1.2 Role Justification

The chosen role split reflects the technical demands of the MVP. The project requires a polished storefront experience as well as a stable data layer for product browsing and cart behavior. Dividing responsibilities by frontend and backend ensures that both students can work in parallel while still collaborating on shared decisions such as product data structure, page navigation, and API contracts.

This distribution also supports a realistic learning environment. Each student develops competence in a distinct layer of the stack while gaining enough exposure to the other area to understand how the full application fits together.

### 1.3 Collaboration Tools

| Tool | Purpose |
|---|---|
| GitHub | Version control, branch management, pull requests, issue tracking |
| VS Code | Shared development environment and code editing |
| Figma | Wireframes, page layout planning, and UI discussion |
| Trello or GitHub Projects | Task breakdown, sprint planning, and progress tracking |
| Discord or WhatsApp | Fast communication and coordination |
| Google Drive | Report drafting, shared notes, and supporting documentation |

### 1.4 Communication Rules

To reduce coordination problems, the team will follow the rules below:

| Rule | Description |
|---|---|
| Regular check-ins | At least two short progress meetings per week, with extra meetings before milestones |
| Branch workflow | Each feature is developed in a separate branch and merged through pull requests |
| Task ownership | Every task has one responsible student, even if both contribute to discussion |
| Response time | Messages in the team channel should be acknowledged within 24 hours during active work periods |
| Shared decisions | Changes affecting design, architecture, or scope require agreement from both students |
| Documentation | Important decisions are written down in project notes to avoid ambiguity later |

### 1.5 Stakeholders and Their Impact

| Stakeholder | Interest in the Project | Impact on the Project |
|---|---|---|
| Brand owner / client | Wants an attractive and useful online presence for products | High: provides requirements, validates design choices, and reviews outcomes |
| End customers | Need a simple, responsive shopping experience | High: determines usability, layout, and browsing structure |
| Project team | Needs a feasible and assessable student project | High: shapes scope, architecture, and delivery pace |
| Course instructor / assessor | Evaluates academic quality and technical execution | High: influences report structure, realism, and evidence of planning |
| Potential future users | May use the platform if developed beyond MVP | Medium: informs extensibility and future features |

---

## 2. Brainstorming and Idea Evaluation

### 2.1 Ideas Explored

Three project ideas were considered before selecting the final MVP.

| Idea | Short Description |
|---|---|
| Idea A: E-commerce platform for a local creative brand | A responsive product catalog and cart system for a brand selling clothing, chairs, and decorative items |
| Idea B: Student productivity task manager | A web app for tracking assignments, deadlines, and study sessions with reminders |
| Idea C: Event booking and ticket reservation system | A booking platform for small events, with seat selection and reservation tracking |

### 2.2 Evaluation Criteria

The ideas were compared using criteria relevant to a student software engineering project.

| Criterion | Meaning |
|---|---|
| Feasibility | Can the idea be implemented within the available time and skill level? |
| Technical relevance | Does it use the intended web stack in a meaningful way? |
| User value | Does it solve a real and understandable problem? |
| Scope clarity | Can the MVP be clearly defined and limited? |
| Presentation quality | Will the final product look professional and demonstrate engineering effort? |
| Learning value | Does it allow the team to practice front-end, back-end, and database design? |

### 2.3 Ranking Table

Each idea was scored from 1 to 5, where 5 is the strongest result.

| Idea | Feasibility | Technical Relevance | User Value | Scope Clarity | Presentation Quality | Learning Value | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| Idea A: E-commerce platform | 5 | 5 | 5 | 4 | 5 | 5 | 29 |
| Idea B: Productivity task manager | 4 | 4 | 4 | 4 | 3 | 4 | 23 |
| Idea C: Event booking system | 3 | 4 | 4 | 3 | 4 | 4 | 22 |

### 2.4 Reasons for Rejecting Non-Selected Ideas

| Rejected Idea | Reason for Rejection |
|---|---|
| Student productivity task manager | This idea was useful but less distinctive. It risked becoming a standard CRUD application with limited visual identity and weaker connection to a real client context. |
| Event booking and ticket reservation system | The core logic for booking validation, seat management, and reservation conflicts would add complexity that is not necessary for a first-stage MVP. |

### 2.5 Brainstorming Justification

The e-commerce platform was selected because it aligns well with the brief, supports a realistic client scenario, and provides a balanced technical challenge. It allows the team to build a polished interface, structure product data, implement cart interaction, and design a backend API without requiring advanced payment integration at this stage. The variety of product types also makes the catalog more interesting than a single-category store, while still remaining manageable for two students.

---

## 3. Decision and Refinement

### 3.1 Selected MVP

The selected project is a responsive e-commerce web platform for a small independent brand that sells clothing, handmade chairs, and creative decorative objects. The MVP focuses on browsing, product presentation, and cart interaction, with the brand experience prioritized over complex commerce automation.

### 3.2 Problem Statement

The brand currently lacks a modern digital storefront that presents its products in a professional and organized way. Potential customers may struggle to browse the catalog, understand the brand identity, or quickly add items to a shopping cart. Without an accessible online platform, the brand has limited ability to attract new customers and present its products consistently.

### 3.3 Solution Description

The proposed solution is a responsive web application that displays the brand’s products in a visually appealing catalog and allows users to view product details, filter or navigate by category, and add items to a simple cart. The interface will be designed with React and Tailwind CSS, while the backend will provide product data and cart-related operations through a Node.js and Express API connected to MongoDB.

### 3.4 Target Users

| User Group | Needs |
|---|---|
| Customers | Browse products easily, view item details, and add products to a cart on mobile or desktop |
| Brand owner | Present products professionally and communicate brand identity clearly |
| Site administrator | Manage product data and maintain content in a structured way |

### 3.5 Application Type

The project is a responsive full-stack web application with a storefront-oriented user interface. It is not a native mobile app and does not include a production-grade payment or logistics system in the MVP stage.

### 3.6 Reasons for Choosing This Idea

| Reason | Explanation |
|---|---|
| Realistic scope | The project can be completed by two students within an academic timeline |
| Strong visual outcome | E-commerce interfaces naturally support attractive design work |
| Full-stack coverage | The solution uses frontend, backend, and database components meaningfully |
| Clear user value | Customers need a straightforward way to explore the brand’s products |
| Expandable future | The MVP can later grow into payments, authentication, and order management |

### 3.7 SMART Goals

| Goal | Specific | Measurable | Achievable | Relevant | Time-bound |
|---|---|---|---|---|---|
| Build a responsive product catalog | Create a homepage and product listing page with category-based browsing | At least 3 visible product categories and fully responsive layouts | Yes, with React and Tailwind | Central to the user experience | By the end of the development stage |
| Implement cart functionality | Allow users to add, remove, and update quantities in a cart | Cart actions work consistently across tested flows | Yes, without payment integration | Required for the MVP shopping experience | Before final demo preparation |
| Create a backend API | Provide endpoints for products and cart data | API returns valid data from MongoDB and supports required CRUD-style operations | Yes, given limited scope | Supports the frontend interface | During the implementation phase |
| Prepare a deployable MVP | Produce a working web application ready for presentation | App runs successfully in a hosted or local environment with documented setup | Yes, with focused scope | Necessary for assessment | By the project submission date |

### 3.8 Feature Priorities

| Priority | Features |
|---|---|
| Must | Responsive homepage, product catalog, product detail view, simple cart, backend API, MongoDB product storage, basic navigation, brand information page |
| Should | Category filtering, search by product name, quantity updates in cart, improved loading and empty states |
| Could | Wishlist, customer reviews, contact form, newsletter signup, advanced animations |
| Future | User accounts, authentication, order history, payment integration, admin dashboard, inventory tracking, shipping workflow |

### 3.9 Project Scope

| In Scope | Out of Scope |
|---|---|
| Product browsing and product detail pages | Full payment processing |
| Simple shopping cart | Shipping carrier integration |
| Responsive design for mobile, tablet, and desktop | Real order fulfillment workflow |
| Backend API for product data | Advanced user authentication and profiles |
| MongoDB storage for catalog data | Complex inventory forecasting |
| Brand-focused presentation | Multi-vendor marketplace functionality |

### 3.10 Feature Feasibility Table

| Feature | Feasibility | Rationale |
|---|---|---|
| Product catalog | High | Straightforward data model and display logic |
| Product detail page | High | Uses a single product record and route-based view |
| Cart system | High | Can be built with state management and backend support |
| Category filtering | High | Simple query or client-side filtering approach |
| Search feature | Medium | Requires careful filtering logic and UI feedback |
| Authentication | Low for MVP | Adds unnecessary complexity for the current stage |
| Online payment | Low for MVP | Requires external services, security considerations, and more testing |

### 3.11 Risks and Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scope creep | Medium | High | Freeze MVP requirements early and log all non-essential ideas for future stages |
| Uneven workload between team members | Medium | Medium | Assign clear ownership, review progress weekly, and rebalance tasks if needed |
| API and frontend integration issues | Medium | High | Define API contracts early and test endpoints with sample data before full UI integration |
| Limited time for polish | Medium | Medium | Prioritize must-have features first and reserve final time for testing and refinement |
| Inconsistent design system | Low | Medium | Establish shared UI components, spacing rules, and color usage from the beginning |
| Database modeling errors | Low | High | Review schema structure before implementation and test with realistic product records |

### 3.12 Expected Impact of the Project

The project is expected to demonstrate how a small brand can benefit from a focused digital storefront that is simple, attractive, and technically credible. For customers, the site improves discoverability and access to product information. For the brand, it strengthens online presentation and creates a basis for future commercial features. For the team, the project provides practical experience in designing a full-stack application, working with a product-oriented data model, and making realistic MVP decisions under constraint.

---

## 4. Conclusion

The team selected a responsive e-commerce web platform as the most suitable project idea after evaluating feasibility, user value, and academic relevance. The chosen MVP is well aligned with the technical stack and can be delivered in a structured, realistic way by two students. The project has a clear problem statement, a focused scope, measurable goals, and a strong foundation for future expansion beyond the MVP stage.

This stage establishes the planning basis for implementation and confirms that the project is both meaningful and achievable within an academic software engineering context.