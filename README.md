# **AI Instant Dashboard**

AI Instant Dashboard is a web application that empowers users to become data analysts in seconds. Users can upload a spreadsheet (.csv or .xlsx), and the application leverages an AI Large Language Model (LLM) to automatically analyze the data, suggest impactful visualizations, and help build a simple, elegant dashboard on the fly.

## **Architecture Overview**

The project is a full-stack application with a clear separation between the frontend and backend.

* **Backend**: A robust API built with **Python** and **FastAPI**, following a "lean layered" architecture for clear separation of concerns. It handles data processing, analysis, and communication with the AI model.  
* **Frontend**: A modern Single-Page Application (SPA) built with **React** and **Vite**, styled with **Tailwind CSS v4**. It provides a clean, intuitive user interface for file uploads and dashboard visualization, structured using Atomic Design principles.

## **Local Setup and Execution Guide**

Follow these steps to get the project running on your local machine.

### **Prerequisites**

* Python 3.8+  
* Node.js v18+ and npm  
* An OpenAI API Key.

### **1\. Backend Setup**

First, let's get the Python server running.
```
# 1. Navigate to the backend directory  
cd backend

# 2. Create and activate a Python virtual environment  
python3 -m venv venv  
source venv/bin/activate

# 3. Install all required dependencies from the requirements.txt file  
pip install -r requirements.txt

# 4. Configure your OpenAI API Key  
# Create a new file named .env in the \`backend/\` directory.  
touch .env

# Add your API key to the .env file.  
# Replace sk-xxxxxxxx with your actual key.  
echo 'OPENAI\_API\_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"' \> .env

# 5. Run the FastAPI server  
uvicorn app.main:app \--reload

# The server will run on http://127.0.0.1:8000  
```
### **2\. Frontend Setup**

Now, let's set up the React user interface.
```
# 1. Navigate to the frontend directory in a new terminal  
cd frontend

# 2. Install the required npm packages  
npm install

# 3. Run the Vite development server  
npm run dev

# The application will be available at http://localhost:5173  
```

At this point, both the backend and frontend should be running, and you can access the application in your browser.

## **💡 Technical Decisions**

This section outlines the key technical choices made during the project's development.

### **Backend**

* **FastAPI**: Chosen for its high performance, asynchronous capabilities, and automatic generation of interactive API documentation (Swagger UI), which is excellent for development and testing. The built-in data validation with Pydantic ensures robust data contracts between the client and server.  
* **Pandas**: The industry-standard library for data manipulation in Python. It provides powerful and efficient tools for reading spreadsheets (.csv, .xlsx) and performing the Exploratory Data Analysis (EDA) needed to generate the summary for the LLM.  
* **Lean Layered Architecture**: The backend code is organized into distinct layers (api, services, adapters) to enforce separation of concerns. This makes the codebase easier to maintain, test, and scale. For example, the storage adapter could be swapped to use a cloud service like AWS S3 with minimal changes to the business logic.

### **Frontend**

* **React & Vite**: React's component-based model is ideal for building a modular and scalable user interface. Vite was chosen over Create React App for its extremely fast development server and Hot Module Replacement (HMR), significantly speeding up the development feedback loop.  
* **Tailwind CSS v4**: Chosen for its utility-first approach, which allows for rapid UI development without writing custom CSS. Version 4's zero-configuration setup and first-class support for native CSS variables simplifies the theming and design token implementation.  
* **Atomic Design & Sections**: The UI is structured following Atomic Design principles (atoms, molecules, organisms) for maximum reusability. This is complemented by a sections directory, where each component maps directly to a major functional area of the SPA (Upload, Suggestions, Dashboard), keeping the main App.jsx component clean and declarative.

### **AI Integration & Prompt Engineering**

* **Model Selection**: gpt-5-nano was chosen as the most cost-effective model from the available options that still provides sufficient reasoning capabilities to understand the data summary and generate the required structured JSON output.  
* **Prompt Design**: A detailed, multi-part prompt was engineered to guide the LLM's behavior precisely and reliably:  
  * **Role-Playing**: The prompt instructs the model to act as a "Senior Data Analyst," setting the context and desired tone for its task.  
  * **Strict Output Formatting**: It explicitly demands a JSON array output and provides a **"few-shot" example** of the exact structure required. This significantly reduces the chances of receiving malformed or unexpected responses.  
  * **Clear Rules & Constraints**: The prompt includes specific rules for chart selection (e.g., use line charts for time series) and constraints (e.g., maximum number of suggestions, word limits for insights) to ensure the output is both high-quality and consistent.

## **API Testing Guide (Happy Path)**

You can test the entire backend flow using an API client like Postman.

### **Step 1: Upload a Dataset**

First, create a sample file named `sample.csv` with the following content:
```
OrderDate,Region,Category,Product,SaleAmount  
2025-01-15,North,Electronics,Laptop,1200  
2025-01-22,South,Electronics,Keyboard,187  
2025-02-05,North,Office Supplies,Pens,30  
2025-02-12,West,Furniture,Desk,200  
2025-03-20,South,Furniture,Chair,180  
2025-03-28,East,Electronics,Mouse,125  
2025-04-10,West,Furniture,Bookcase,200  
2025-04-19,North,Electronics,Webcam,150  
2025-05-01,East,Office Supplies,Paper,50
```

* **Request**: `POST` `http://127.0.0.1:8000/api/v1/datasets/upload`
* **Body**: form-data  
  * KEY: file  
  * VALUE: `(Select the sample\_sales.csv file)`  
* **Expected Response (201 Created)**: A JSON object with the datasetId. **Copy this ID.**  
  ```
  {  
      "datasetId": "your-unique-dataset-id",  
      "filename": "sample\_sales.csv"  
  }
  ```

### **Step 2: Get AI-Powered Suggestions**

* **Request**: `POST` `http://127.0.0.1:8000/api/v1/analysis/suggestions`  
* **Body**: raw (JSON)  
* **Payload**: Use the datasetId from the previous step.  
  ```
  {  
      "datasetId": "your-unique-dataset-id"  
  }
  ```

* **Expected Response (200 OK)**: A JSON array of 3-5 chart suggestions generated by the AI. e.g.
    ```
    [
        {
            "title": "Total Sales by Region",
            "insight": "The North region has the highest total sales, indicating a potential market opportunity or strong customer base in that region.",
            "parameters": {
                "chart_type": "bar",
                "x_axis": "Region",
                "y_axis": "Total Sales",
                "aggregation": "sum"
            }
        },
        {
            "title": "Sales Distribution by Product Category",
            "insight": "Electronics category contributes the most to total sales, highlighting its popularity or profitability compared to other categories.",
            "parameters": {
                "chart_type": "pie",
                "x_axis": "Product Category",
                "y_axis": "Total Sales",
                "aggregation": "sum"
            }
        },
        {
            "title": "Sales Trend over Time",
            "insight": "Sales show a fluctuating trend over time, indicating potential seasonality or external factors influencing purchasing behavior.",
            "parameters": {
                "chart_type": "line",
                "x_axis": "Date",
                "y_axis": "Total Sales",
                "aggregation": "sum"
            }
        }
    ]
    ```

### **Step 3: Get Data for a Specific Chart**

* **Request**: `POST` `http://127.0.0.1:8000/api/v1/charts/data`  
* **Body**: raw (JSON)  
* **Payload**: Combine the datasetId with the parameters from one of the suggestions you received.
  ```  
  {
    "datasetId": "e1073859-05d0-4328-a6ff-92333747db06",
    "chart_type": "pie",
    "x_axis": "Region",
    "y_axis": "Total Sales",
    "aggregation": "sum"
  }
  ```

* **Expected Response (200 OK)**: A JSON object with the aggregated data, ready to be rendered by a charting library.  
  ```
  {  
      "series": [  
          {  
              "label": "SaleAmount",  
              "data": [  
                  { "x": "Electronics", "y": 1662 },  
                  { "x": "Furniture", "y": 580 },  
                  { "x": "Office Supplies", "y": 80 }  
              ]  
          }  
      ]  
  }
  ```

If you can complete these three steps successfully, the backend is fully functional.