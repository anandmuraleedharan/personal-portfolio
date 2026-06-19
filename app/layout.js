import "./globals.css";

export const metadata = {
  title: "Anand Muraleedharan — Principal Data Engineer & Architect",
  description: "Personal portfolio of Anand Muraleedharan, Principal Data Engineer specializing in modern data warehousing (Snowflake, dbt, Airflow, BigQuery), cloud migrations, and scalable data platforms.",
  keywords: ["Anand Muraleedharan", "Data Engineer", "Principal Data Engineer", "Snowflake", "dbt", "Airflow", "BigQuery", "Analytics Engineer", "Autodesk", "Maven Wave"],
  authors: [{ name: "Anand Muraleedharan" }],
  openGraph: {
    title: "Anand Muraleedharan — Principal Data Engineer & Architect",
    description: "Sleek personal portfolio showing experience in large-scale BI re-platforming, dbt pipelines, and warehouse design.",
    url: "https://anandmuraleedharan.com",
    siteName: "Anand Muraleedharan Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anand Muraleedharan — Principal Data Engineer & Architect",
    description: "Personal portfolio showing experience in Snowflake, dbt, Airflow, and BigQuery.",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
