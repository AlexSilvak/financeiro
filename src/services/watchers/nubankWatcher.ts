
import fs from 'fs';
import pdf from 'pdf-parse';




export default function processaExtrato(){

    const dataBuffer = fs.readFileSync('Nubank_2025-06-26.pdf');

pdf(dataBuffer).then(data => {
  console.log(data.text);
});

}