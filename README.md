
# SwiftConvert

A modern file conversion application built with React, Tailwind CSS, and FastAPI. 
**No AI, no tracking, just pure library-based conversion.**

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**

## Setup & Running

### 1. Backend (FastAPI)

1. Navigate to the `backend/` directory.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   python main.py
   ```
   *The backend runs on `http://localhost:8000`.*

### 2. Frontend (React)

1. Open the project root in your terminal.
2. If running locally, install dependencies:
   `npm install`
3. Start the development server:
   `npm start`

## Supported Conversions

| Source | Target Formats | Library Used |
|--------|----------------|--------------|
| **PDF** | DOCX, PNG, JPG | `pdf2docx`, `PyMuPDF` |
| **DOCX**| PDF | `docx2pdf` |
| **CSV** | XLSX, PDF | `pandas`, `fpdf2` |
| **XLSX**| CSV, PDF | `pandas`, `fpdf2` |
| **JPG** | PDF, PNG | `img2pdf`, `Pillow` |
| **PNG** | PDF, JPG | `img2pdf`, `Pillow` |

## Notes

- **DOCX to PDF**: Requires a PDF printer or Office installation on the server host if using `docx2pdf`. For pure headless Linux, use LibreOffice as a backend engine.
- **Privacy**: Files are stored in the system's temp directory with random UUID names and are deleted immediately after the download task completes.
