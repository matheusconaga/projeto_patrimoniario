<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-blue?style=for-the-badge" alt="English"></a>
  <a href="README.pt.md"><img src="https://img.shields.io/badge/Lang-Português-green?style=for-the-badge" alt="Português"></a>
</p>

<h1 align="center">🏢 Patrimoniario</h1>

<p align="center">
A modern web system for asset management, featuring real-time dashboards, QR Code generation, bulk import, and smart asset tracking.
</p>

<p align="center">
  <img src="https://github.com/matheusconaga/projeto_patrimoniario/blob/main/assets/patrimoniario.png?raw=true" width="800"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Styled%20Components-db7093?style=for-the-badge&logo=styledcomponents&logoColor=white"/>
  <img src="https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white"/>
</p>

<p align="center">
  <a href="https://projeto-patrimoniario.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-000000?style=for-the-badge"/>
  </a>
</p>

---

## 📌 About the Project

The **Asset Management System** was developed to streamline asset tracking for companies and institutions, offering a modern, fast, and intuitive user interface.

### Key Features:

- 📦 Create, read, update, and delete (CRUD) assets
- 📊 Real-time management dashboards
- 🔍 Advanced filters and smart search
- 📥 Bulk data import via Excel
- 🏷️ Smart label generation with QR Codes
- 📄 Report and PDF exporting
- 📱 Responsive UI tailored for desktop and mobile

### 🧪 Test Access:

```text
E-mail: visit@gmail.com
Password: visit123
```

## 🧠 Core Differentials

- ⚡ High-performance SPA interface
- ☁️ Modern serverless architecture
- 🧩 Dynamic category and model management
- 📈 Reduction of manual processes
- 🔧 Scalable and easy to maintain

## 🎥 System Preview

<div align="center">

| Dashboard | Asset Management |
|-----------|--------------------|
| <p align="center"><img src="https://github.com/matheusconaga/projeto_patrimoniario/blob/main/assets/home_patrimonio.png?raw=true" width="430"></p> | <p align="center"><img src="https://github.com/matheusconaga/projeto_patrimoniario/blob/main/assets/02_tabeladados.jpg?raw=true" width="430"></p> |

| Add Asset | Smart Labels |
|----------------------|------------------------|
| <p align="center"><img src="https://github.com/matheusconaga/projeto_patrimoniario/blob/main/assets/03_adicaopatrimonio.jpg?raw=true" width="430"></p> | <p align="center"><img src="https://github.com/matheusconaga/projeto_patrimoniario/blob/main/assets/04_etiqueta.png?raw=true" width="430"></p> |

| Bulk Import | Mobile Version |
|---------------------|---------------|
| <p align="center"><img src="https://github.com/matheusconaga/projeto_patrimoniario/blob/main/assets/05_importacao.jpg?raw=true" width="430"></p> | <p align="center"><img src="https://github.com/matheusconaga/projeto_patrimoniario/blob/main/assets/06_mobile.jpg?raw=true" width="200"></p> |
  
</div>

## 🛠️ Tech Stack

### Frontend

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Styled%20Components-db7093?style=flat&logo=styledcomponents&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white"/>
</p>

### Backend as a Service (BaaS)

<p>
  <img src="https://img.shields.io/badge/Firebase%20Auth-ffca28?style=flat&logo=firebase&logoColor=black"/>
  <img src="https://img.shields.io/badge/Firestore-ffca28?style=flat&logo=firebase&logoColor=black"/>
</p>

### Third-Party Services

<p>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/QR%20Code-000000?style=flat&logo=qrcode&logoColor=white"/>
  <img src="https://img.shields.io/badge/XLSX%20Import%2FExport-217346?style=flat&logo=microsoft-excel&logoColor=white"/>
</p>

### Deployment

<p>
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=black"/>
</p>

## 🧩 Architecture

```text
React SPA Frontend
         ↓
Firebase Auth → Authentication & Security
Firestore → Real-time database
Cloudinary → Image hosting
External Services → QR Code / Excel / PDF
```
### Benefits
- ☁️ Streamlined infrastructure
- ⚡ Fast response times
- 📈 Automatic scalability
- 💸 Low operational cost


## 💻 How to Run the Project Locally

### 🔧 Prerequisites

* Node.js installed (LTS version recommended)
* NPM or Yarn

### 📥 1. Clone the repository

```bash
git clone https://github.com/matheusconaga/projeto_patrimoniario.git
```

### 📂 2. Navigate to the project folder

```bash
cd projeto_patrimoniario
```

### 📦 3. Install dependencies

```bash
npm install
```

or

```bash
npm i
```

### ▶️ 4. Start the development server

```bash
npm run dev
```

### 🌐 5. Access in your browser

The system will be available at:

```
http://localhost:5173
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

## 📈 Future Enhancements
- 🔐 Role-Based Access Control (RBAC)
- 📝 Asset transfer and movement history
- 📊 Audit logs for tracking changes
- 🔔 Automated alerts and notifications
- 🤖 Predictive AI analytics dashboard

## 📄 License
<p>
This project is available for study, portfolio, and learning purposes. 
Feel free to fork it, enhance the solution, and build new improvements on top of it.
</p>

## 👨‍💻 Author

<p align="center">
  <img src="https://avatars.githubusercontent.com/matheusconaga" width="110px;" style="border-radius:50%;" />
</p>

<h3 align="center">Matheus Lula</h3>

<p align="center">
Full-Stack Developer • React • Flutter • FastAPI • AI & Automation</p>

<div align="center">
<a href="mailto:matheusphillip170@gmail.com"><img src="https://img.shields.io/badge/Gmail-FF0000?style=for-the-badge&logo=gmail&logoColor=white"/></a>
<a href="https://www.linkedin.com/in/matheusconaga/"><img src="https://img.shields.io/badge/💼%20LinkedIn-0e76a8?style=for-the-badge&logo=linkedin"/></a>
<a href="https://portifoliomatheuslula.onrender.com/"><img src="https://img.shields.io/badge/Portfólio-000000?style=for-the-badge&logo=render&logoColor=white"/></a>
</div>
