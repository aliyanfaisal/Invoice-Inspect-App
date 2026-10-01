import { NextResponse } from "next/server";
import { inspectPdf } from "@/lib/pdf/inspect";
import { InspectError, type InspectErrorCode } from "@/lib/pdf/types";

export const runtime = "nodejs";

const STATUS: Record<InspectErrorCode, number> = {
  not_a_pdf: 415,
  too_large: 413,
  too_many_pages: 422,
  unreadable: 422,
};

export async function POST(request: Request) {
  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    // Held in memory only; nothing is written to disk or logged.
    const document = await inspectPdf(Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ document });
  } catch (err) {
    if (err instanceof InspectError) {
      return NextResponse.json(
        { error: err.code, message: err.message },
        { status: STATUS[err.code] },
      );
    }
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
