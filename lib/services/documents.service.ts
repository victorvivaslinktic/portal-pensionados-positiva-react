import { SendDocumentRequest, SendDocumentResponse } from "@/lib/types/auth.types";
import { httpInterceptor } from "@/lib/utils/http-interceptor";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://bdggw7se0m.execute-api.us-east-1.amazonaws.com/prod";

export class DocumentsService {
  private static instance: DocumentsService;

  private constructor() {}

  public static getInstance(): DocumentsService {
    if (!DocumentsService.instance) {
      DocumentsService.instance = new DocumentsService();
    }
    return DocumentsService.instance;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  private normalizeMonthForType(docType: string, rawMonth: string): string {
    const trimmed = (rawMonth || "").trim();

    if (docType === "CIR") {
      return "03";
    }

    if (docType === "CVP") {
      const now = new Date();
      const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
      return currentMonth;
    }

    if (docType === "DPP") {
      if (/^\d{4}-\d{2}$/.test(trimmed)) {
        return trimmed.split("-")[1];
      }
      if (/^\d{1,2}$/.test(trimmed)) {
        return trimmed.padStart(2, "0");
      }
      return trimmed;
    }

    return trimmed;
  }

  async sendDocument(request: SendDocumentRequest): Promise<SendDocumentResponse> {
    try {
      const normalizedMonth = this.normalizeMonthForType(request.type, request.month);

      const response = await httpInterceptor.fetch(`${API_URL}/api/sendDocument`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          type: request.type,
          month: normalizedMonth,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as { message: string }).message || "Error al enviar el documento");
      }

      return data as SendDocumentResponse;
    } catch (error) {
      console.error("Error sending document:", error);
      throw error;
    }
  }

  // Métodos de conveniencia para cada tipo de certificado
  async sendCIR(): Promise<SendDocumentResponse> {
    return this.sendDocument({ type: "CIR", month: "03" });
  }

  async sendCVP(): Promise<SendDocumentResponse> {
    const now = new Date();
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
    return this.sendDocument({ type: "CVP", month: currentMonth });
  }

  async sendDPP(month: string): Promise<SendDocumentResponse> {
    return this.sendDocument({ type: "DPP", month });
  }

  // Obtener meses disponibles para DPP (últimos 3 meses)
  getAvailableMonthsForDPP(): string[] {
    const months = [];
    const now = new Date();

    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      months.push(`${year}-${month}`);
    }

    return months;
  }
}

export const documentsService = DocumentsService.getInstance();
