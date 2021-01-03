module.exports=()=>{
    
    return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>Analysis Data</title>
          <style>
                .break-before {
                    page-break-before: always;
                }		
                .no-break {
                    page-break-inside: avoid;
                }
          </style>
       </head>
       <body>
            <div> 
                <img src="http://localhost:5000/image/img1.png" alt="img1"/>
            </div>
            <div class="break-before">
                 <img src="http://localhost:5000/image/img2.png" alt="img2"/>
            </div>
            <div class="break-before">
                <img src=http://localhost:5000/image/img3.png alt="img3"/>
            </div>
       </body>
    </html>
    `;

};