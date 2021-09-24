import { formatDate } from './formatDate.js';

export const mapData = (objArray) => {
    return objArray.map((item) => {
        return {
          data: item.data,
          mesAno: formatDate(item.data, { year: "numeric", month: "numeric" }),
          mesAnoFormatado: formatDate(item.data, {
            year: "numeric",
            month: "short",
          }),
          valor: Number.parseFloat(item.valor).toFixed(2),
          valorFormatado: item.valor.replace(".", ",") + "%",
        };
    })
}