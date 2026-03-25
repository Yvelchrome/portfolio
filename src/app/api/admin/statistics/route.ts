import { NextRequest, NextResponse } from "next/server";

import { Resend } from "resend";

import { requireAdmin } from "lib/auth/middleware";

type EmailLastEvent = "sent" | "delivered" | "bounced" | "failed";

interface ResendEmail {
  id: string;
  last_event: EmailLastEvent;
  created_at: string;
}

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const limit = parseInt(searchParams.get("limit") || "100");

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const resendApiKey = process.env["RESEND_API_KEY"];
    if (!resendApiKey) {
      return NextResponse.json(
        { error: "RESEND_API_KEY not configured" },
        { status: 500 },
      );
    }

    const resend = new Resend(resendApiKey);

    // Demo mode for demonstration
    const isDemo = searchParams.get("demo") === "1";

    let counts: Record<string, number>;

    if (isDemo) {
      counts = {
        sent: 3,
        delivered: 8,
        bounced: 1,
        failed: 1,
      };
    } else {
      const { data, error } = await resend.emails.list({ limit });

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch from Resend" },
          { status: 500 },
        );
      }

      counts = {
        sent: 0,
        delivered: 0,
        bounced: 0,
        failed: 0,
      };

      const emailsData = data.data;
      const emails = emailsData as ResendEmail[];
      emails.forEach((email) => {
        const emailDate = new Date(email.created_at);
        if (emailDate >= startDate) {
          const event = email.last_event;
          if (event in counts) {
            counts[event] = (counts[event] ?? 0) + 1;
          }
        }
      });
    }

    const sent = counts["sent"] ?? 0;
    const delivered = counts["delivered"] ?? 0;
    const bounced = counts["bounced"] ?? 0;
    const failed = counts["failed"] ?? 0;

    const totalSent = sent + delivered + bounced + failed;

    return NextResponse.json({
      summary: {
        totalSent,
        sent,
        delivered,
        bounced,
        failed,
        deliveryRate:
          totalSent > 0 ? ((delivered / totalSent) * 100).toFixed(1) : "0",
      },
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
