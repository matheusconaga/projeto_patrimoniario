type FirestoreTimestamp = {
    seconds: number;
    nanoseconds: number;
};

export function formatarData(data?: string | Date | FirestoreTimestamp): string {
    if (!data) return "-";

    let dateObj: Date;

    if (typeof data === "string") {
        dateObj = new Date(data);
    }
    else if (data instanceof Date) {
        dateObj = data;
    }
    else if ("seconds" in data && typeof data.seconds === "number") {
        dateObj = new Date(data.seconds * 1000);
    }
    else {
        return "-";
    }

    if (isNaN(dateObj.getTime())) return "-";

    const formatter = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    return formatter.format(dateObj).replace(",", " -");
}

export function formatISODateForInput(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return ""; 
    }

    const datePart = date.getFullYear() + '-' + 
      String(date.getMonth() + 1).padStart(2, '0') + '-' + 
      String(date.getDate()).padStart(2, '0');

    const timePart = String(date.getHours()).padStart(2, '0') + ':' + 
      String(date.getMinutes()).padStart(2, '0');

    return `${datePart}T${timePart}`;
  } catch (e) {
    console.error("Erro ao formatar data:", e);
    return "";
  }
}