// PdfGenerator.js
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import RevenueChart from './RevenueChart';

export function openPdfWindow(chartData) {
    const dataString = prepareDataString(chartData);

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <html>
        <head>
            <title>Reverse Engineer Valuation Calculation Results</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.0.0-rc.7/html2canvas.min.js"></script>
        </head>
        <body>
            ${dataString}
            <h2>Revenue Graph</h2>
            <div id="chart-container"></div>
            <button onclick="downloadPDF()">Download as PDF</button>
            <script>
                const chartData = ${JSON.stringify(chartData)};
                ReactDOM.hydrate(React.createElement(RevenueChart, {data: chartData}), document.getElementById('chart-container'));

                function downloadPDF() {
                    html2canvas(document.body).then(canvas => {
                        const imgData = canvas.toDataURL('image/png');
                        const pdf = new jsPDF.jsPDF({
                            orientation: 'portrait',
                        });
                        const imgProps = pdf.getImageProperties(imgData);
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                        pdf.save("download.pdf");
                    }).catch(error => console.error('Error generating PDF:', error));
                }
            </script>
        </body>
        </html>
    `);
    newWindow.document.close();
}

function prepareDataString(chartData) {
    // Similar to your existing prepareDataString function
    // Return the string that will be injected into the new window
}
